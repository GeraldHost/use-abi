import { JsonRpcProvider } from "@ethersproject/providers";
import { useEthers } from "@usedapp/core";

import { useGetCount, useIncrement } from "./counter/index";
import { Provider } from "./Provider";

function Counter() {
  const { data: count } = useGetCount();
  const { send: increment } = useIncrement();

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {count?.toString()}</p>
      <button onClick={() => increment()}>Increment</button>
    </div>
  );
}

function App() {
  const { library, chainId, account, activateBrowserWallet } = useEthers();

  return (
    <div>
      <Provider library={library as JsonRpcProvider} chainId={chainId}>
        <h1>Testoor</h1>
        <button disabled={!!account} onClick={() => activateBrowserWallet()}>
          Connect
        </button>
        <p>Connected as: {account}</p>
        <Counter />
      </Provider>
    </div>
  );
}

export default App;
