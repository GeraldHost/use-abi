import ReactDOM from "react-dom/client";
import { DAppProvider, Config, Kovan } from "@usedapp/core";

import App from "./App";

const config: Config = {
  readOnlyChainId: Kovan.chainId,
  readOnlyUrls: {
    [Kovan.chainId]: "https://kovan.infura.io/v3/b3359a5636d64b858b26fc5cccab8578",
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <DAppProvider config={config}>
    <App />
  </DAppProvider>
);
