// Example of generated content
import { Contract } from "@ethersproject/contracts";
import { useCall, useSend } from "../internal";

import { ZERO_ADDRESS } from "../constants";

import ABI from "./abi.json";
import ADDRESSES from "./address.json";
import { BigNumberish } from "ethers";

const contract = new Contract(ZERO_ADDRESS, ABI);

export function useGetCount() {
  return useCall<BigNumberish, never>(ADDRESSES, contract, "getCount");
}

export function useIncrement() {
  return useSend<never>(ADDRESSES, contract, "increment");
}

export function useSetCount() {
  return useSend<[number]>(ADDRESSES, contract, "setCount");
}

