import { JsonRpcProvider } from "@ethersproject/providers";

import { Context } from "./internal";

interface IProvider {
  library?: JsonRpcProvider;
  chainId?: number;
  children: any;
}

export function Provider({ children, library, chainId }: IProvider) {
  return (
    <Context.Provider value={{ library, chainId }}>{children}</Context.Provider>
  );
}
