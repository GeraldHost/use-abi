// Generated by use-abi
import { BigNumberish } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useCall, useSend, ZERO_ADDRESS } from "@useabi/internal";

import ABI from "./abi.json";
import ADDRESSES from "./address.json";

const contract = new Contract(ZERO_ADDRESS, ABI);

export function useCount() {
  return useCall<[], BigNumberish>(ADDRESSES, contract, "count", []);
}

export function useGetCount() {
  return useCall<[], BigNumberish>(ADDRESSES, contract, "getCount", []);
}

export function useDecrement() {
  return useSend<[]>(ADDRESSES, contract, "decrement");
}

export function useIncrement() {
  return useSend<[]>(ADDRESSES, contract, "increment");
}

export function useSetCount() {
  return useSend<[BigNumberish]>(ADDRESSES, contract, "setCount");
}
