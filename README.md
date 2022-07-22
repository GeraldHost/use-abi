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
