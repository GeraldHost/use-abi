#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

const templatePath = path.resolve(__dirname, "template.mustache");

function exitLog(str) {
  console.log(`[!] ${str}`);
  process.exit();
}

function cleanOutput(path) {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path, { force: true, recursive: true });
  }
  fs.mkdirSync(path);
}

function saveAddresses(name, addresses, out) {
  fs.writeFileSync(
    path.resolve(out, name, "address.json"),
    JSON.stringify(addresses)
  );
}

function saveAbi(name, abi, out) {
  fs.writeFileSync(path.resolve(out, name, "abi.json"), JSON.stringify(abi));
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
      arguments: args,
      returns,
      stateMutability: obj.stateMutability,
      strings: {
        method: obj.name,
        hookName: `use${capitalise(obj.name)}`,
        hookArgs: args.map((arg, i) => `arg${i}: ${arg}`).join(", "),
        useCallArgs: args.map((_, i) => `arg${i}`).join(", "),
        typeArgs: args.join(", "),
        retTypeArgs: returns.length > 1 ? returns.join(", ") : returns[0],
      },
    };
  });

  return {
    view: result.filter((r) => r.stateMutability === "view"),
    send: result.filter((r) => r.stateMutability !== "view"),
  };
}

function saveIndex(name, abi, out) {
  const template = fs.readFileSync(templatePath, "utf8");
  const result = parseAbi(abi);
  const content = Mustache.render(template, result);
  fs.writeFileSync(path.resolve(out, name, "index.ts"), content);
}

function main() {
  const inputDirectory = process.argv[2];
  const outputDiretcory = process.argv[3];

  if (!inputDirectory || !outputDiretcory) {
    exitLog("Usage: useabi <INPUT_PATH> <OUTPUT_PATH>");
  }

  const inputDirectoryPath = path.resolve(inputDirectory);
  const outputDirectoryPath = path.resolve(outputDiretcory);

  if (!fs.existsSync(inputDirectoryPath)) {
    exitLog("input directory not found: ", inputDirectory);
  }

  cleanOutput(outputDirectoryPath);

  const files = fs.readdirSync(inputDirectoryPath);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  for (const file of jsonFiles) {
    const name = file.split(".")[0];

    const json = JSON.parse(
      fs.readFileSync(path.resolve(inputDirectoryPath, file), "utf8")
    );

    fs.mkdirSync(path.resolve(outputDirectoryPath, name.toLowerCase()));
    saveAddresses(name, json.addresses, outputDirectoryPath);
    saveAbi(name, json.abi, outputDirectoryPath);
    saveIndex(name, json.abi, outputDirectoryPath);
  }
}

main();
