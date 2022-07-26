```js
// takes an ABI and pump out a hooks library
import {} from "use-abi";

// View functions
const { data } = useGetMintCost(...args);

// Payable functions
const { send } = useMint();

// Activity
const activity = useActivity();

// transaction button to call mint with args
<TxButton label="Mint" method="mint" args={["1", "0x00...00"] />

// multicalls like this
const results = useMulticall([
	getMintCost(),
	getStakerAmount(staker),
	getFoo(bar)
]);

// Raw hooks
const { data } = useCall(getMintCost());

const { send } = useSend(mint(id, to));
```

```json
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "stake",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}
```

```js
interface Call<Args> {
  contract: Contract;
  method: string;
  args: Args;
}

function useSend(call: Call) {
  // ...
}

function stake(amount: BigNumberish): Call {
  // ...
}

function useStake(): { send: unknown } {
  return useSend({ contract, method: "stake" });
}

const { send } = useStake();

send(amount);
```
