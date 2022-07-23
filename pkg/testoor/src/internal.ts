import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

interface Addresses {
  [chainId: number]: string;
}

export const Context = createContext<{
  library?: JsonRpcProvider;
  chainId?: number;
}>({});

export function useProvider() {
  return useContext(Context);
}

export function useRefresh() {
  const [tick, setRefreshCount] = useState(1);
  const refresh = () => setRefreshCount((x) => x + 1);
  return { refresh, tick };
}

export function useCall<T, U extends []>(
  addresses: Addresses,
  contract: Contract,
  method: string,
  args?: U
) {
  const { library, chainId } = useProvider();
  const [data, setData] = useState<T | null>(null);
  const { refresh, tick } = useRefresh();

  useEffect(() => {
    async function f() {
      if (!chainId || !library) return;

      const address = addresses[chainId];
      const attached = contract.connect(library).attach(address);
      const resp = await attached[method](...(args || []));

      setData(resp);
    }

    tick && library && chainId && f();
  }, [chainId, library, tick]);

  return { data, refresh };
}

export function useSend<U extends any[]>(
  addresses: Addresses,
  contract: Contract,
  method: string
) {
  const { library, chainId } = useProvider();

  const send = useCallback(
    async (...args: U) => {
      if (!chainId || !library) return;

      const address = addresses[chainId];
      const attached = contract.attach(address).connect(library.getSigner());
      const tx = await attached[method](...(args || []));
      const resp = await tx.wait();
      return resp;
    },
    [library, chainId]
  );

  return { send };
}
