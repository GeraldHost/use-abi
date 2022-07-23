const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

const outputDir = path.resolve(__dirname, "output");
const templatePath = path.resolve(__dirname, "template.mustache");

function exitLog(str) {
  console.log(`[!] ${str}`);
  process.exit();
}

function cleanOutput() {
  if (fs.existsSync(outputDir)) {
    fs.rmdirSync(outputDir, { force: true, recursive: true });
  }
  fs.mkdirSync(outputDir);
}

function saveAddresses(name, addresses) {
  fs.writeFileSync(
    path.resolve(outputDir, name, "address.json"),
    JSON.stringify(addresses)
  );
}

function saveAbi(name, abi) {
  fs.writeFileSync(
    path.resolve(outputDir, name, "abi.json"),
    JSON.stringify(abi)
  );
}

function parseTypes(types) {
  const typeMap = {
    bool: "boolean",
  };

  // TODO: this doesn't support tuple/struct types
  function parseType(type) {
    if (type.endsWith("[]")) {
      return `Array<${parseType(typeMap[type.replace("[]")])}>`;
    }

    if (type.startsWith("uint")) {
      return "BigNumberish";
    }

    return typeMap[type] || "string";
  }

  return types.map(({ type }) => {
    return parseType(type);
  });
}

function capitalise(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function parseAbi(abi) {
  const result = abi.map((obj) => {
    if (obj.type !== "function") {
      return false;
    }

    const args = parseTypes(obj.inputs);
    const returns = parseTypes(obj.outputs);

    return {
      method: obj.name,
      arguments: args,
      returns,
      argumentTypesString: args.length <= 0 ? "never" : args.join(","),
      returnsTypesString: returns.length <= 0 ? "never" : returns.join(","),
      hookName: `use${capitalise(obj.name)}`,
      stateMutability: obj.stateMutability,
    };
  });

  return {
    view: result.filter((r) => r.stateMutability === "view"),
    send: result.filter((r) => r.stateMutability !== "view"),
  };
}

function saveIndex(name, abi) {
  const template = fs.readFileSync(templatePath, "utf8");
  const result = parseAbi(abi);
  const content = Mustache.render(template, result);

  console.log(content);

  fs.writeFileSync(path.resolve(outputDir, name, "index.ts"), "");
}

function main() {
  const inputDirectory = process.argv[2];
  if (!inputDirectory) {
    exitLog("Usage: ./generate.js <INPUT_PATH>");
  }

  const inputDirectoryPath = path.join(__dirname, inputDirectory);

  if (!fs.existsSync(inputDirectoryPath)) {
    exitLog("input directory not found: ", inputDirectory);
  }

  cleanOutput();

  const files = fs.readdirSync(inputDirectoryPath);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  for (const file of jsonFiles) {
    const name = file.split(".")[0];

    const json = JSON.parse(
      fs.readFileSync(path.resolve(inputDirectoryPath, file), "utf8")
    );

    fs.mkdirSync(path.resolve(outputDir, name.toLowerCase()));
    saveAddresses(name, json.addresses);
    saveAbi(name, json.abi);
    saveIndex(name, json.abi);
  }
}

main();
