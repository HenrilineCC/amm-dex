/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { MyToken, MyTokenInterface } from "../../contracts/MyToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161188c38038061188c8339818101604052810190610032919061031b565b338282816003908161004491906105b4565b50806004908161005491906105b4565b505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100c95760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100c091906106c7565b60405180910390fd5b6100d8816100e060201b60201c565b5050506106e2565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61020d826101c4565b810181811067ffffffffffffffff8211171561022c5761022b6101d5565b5b80604052505050565b600061023f6101a6565b905061024b8282610204565b919050565b600067ffffffffffffffff82111561026b5761026a6101d5565b5b610274826101c4565b9050602081019050919050565b60005b8381101561029f578082015181840152602081019050610284565b60008484015250505050565b60006102be6102b984610250565b610235565b9050828152602081018484840111156102da576102d96101bf565b5b6102e5848285610281565b509392505050565b600082601f830112610302576103016101ba565b5b81516103128482602086016102ab565b91505092915050565b60008060408385031215610332576103316101b0565b5b600083015167ffffffffffffffff8111156103505761034f6101b5565b5b61035c858286016102ed565b925050602083015167ffffffffffffffff81111561037d5761037c6101b5565b5b610389858286016102ed565b9150509250929050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806103e557607f821691505b6020821081036103f8576103f761039e565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026104607fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610423565b61046a8683610423565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006104b16104ac6104a784610482565b61048c565b610482565b9050919050565b6000819050919050565b6104cb83610496565b6104df6104d7826104b8565b848454610430565b825550505050565b600090565b6104f46104e7565b6104ff8184846104c2565b505050565b5b81811015610523576105186000826104ec565b600181019050610505565b5050565b601f82111561056857610539816103fe565b61054284610413565b81016020851015610551578190505b61056561055d85610413565b830182610504565b50505b505050565b600082821c905092915050565b600061058b6000198460080261056d565b1980831691505092915050565b60006105a4838361057a565b9150826002028217905092915050565b6105bd82610393565b67ffffffffffffffff8111156105d6576105d56101d5565b5b6105e082546103cd565b6105eb828285610527565b600060209050601f83116001811461061e576000841561060c578287015190505b6106168582610598565b86555061067e565b601f19841661062c866103fe565b60005b828110156106545784890151825560018201915060208501945060208101905061062f565b86831015610671578489015161066d601f89168261057a565b8355505b6001600288020188555050505b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006106b182610686565b9050919050565b6106c1816106a6565b82525050565b60006020820190506106dc60008301846106b8565b92915050565b61119b806106f16000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c806370a082311161008c57806395d89b411161006657806395d89b4114610202578063a9059cbb14610220578063dd62ed3e14610250578063f2fde38b14610280576100cf565b806370a08231146101aa578063715018a6146101da5780638da5cb5b146101e4576100cf565b806306fdde03146100d4578063095ea7b3146100f257806318160ddd1461012257806323b872dd14610140578063313ce5671461017057806340c10f191461018e575b600080fd5b6100dc61029c565b6040516100e99190610def565b60405180910390f35b61010c60048036038101906101079190610eaa565b61032e565b6040516101199190610f05565b60405180910390f35b61012a610351565b6040516101379190610f2f565b60405180910390f35b61015a60048036038101906101559190610f4a565b61035b565b6040516101679190610f05565b60405180910390f35b61017861038a565b6040516101859190610fb9565b60405180910390f35b6101a860048036038101906101a39190610eaa565b610393565b005b6101c460048036038101906101bf9190610fd4565b6103a9565b6040516101d19190610f2f565b60405180910390f35b6101e26103f1565b005b6101ec610405565b6040516101f99190611010565b60405180910390f35b61020a61042f565b6040516102179190610def565b60405180910390f35b61023a60048036038101906102359190610eaa565b6104c1565b6040516102479190610f05565b60405180910390f35b61026a6004803603810190610265919061102b565b6104e4565b6040516102779190610f2f565b60405180910390f35b61029a60048036038101906102959190610fd4565b61056b565b005b6060600380546102ab9061109a565b80601f01602080910402602001604051908101604052809291908181526020018280546102d79061109a565b80156103245780601f106102f957610100808354040283529160200191610324565b820191906000526020600020905b81548152906001019060200180831161030757829003601f168201915b5050505050905090565b6000806103396105f1565b90506103468185856105f9565b600191505092915050565b6000600254905090565b6000806103666105f1565b905061037385828561060b565b61037e8585856106a0565b60019150509392505050565b60006012905090565b61039b610794565b6103a5828261081b565b5050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6103f9610794565b610403600061089d565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461043e9061109a565b80601f016020809104026020016040519081016040528092919081815260200182805461046a9061109a565b80156104b75780601f1061048c576101008083540402835291602001916104b7565b820191906000526020600020905b81548152906001019060200180831161049a57829003601f168201915b5050505050905090565b6000806104cc6105f1565b90506104d98185856106a0565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b610573610794565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036105e55760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016105dc9190611010565b60405180910390fd5b6105ee8161089d565b50565b600033905090565b6106068383836001610963565b505050565b600061061784846104e4565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81101561069a578181101561068a578281836040517ffb8f41b2000000000000000000000000000000000000000000000000000000008152600401610681939291906110cb565b60405180910390fd5b61069984848484036000610963565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107125760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016107099190611010565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107845760006040517fec442f0500000000000000000000000000000000000000000000000000000000815260040161077b9190611010565b60405180910390fd5b61078f838383610b3a565b505050565b61079c6105f1565b73ffffffffffffffffffffffffffffffffffffffff166107ba610405565b73ffffffffffffffffffffffffffffffffffffffff1614610819576107dd6105f1565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016108109190611010565b60405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361088d5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108849190611010565b60405180910390fd5b61089960008383610b3a565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036109d55760006040517fe602df050000000000000000000000000000000000000000000000000000000081526004016109cc9190611010565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610a475760006040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610a3e9190611010565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610b34578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610b2b9190610f2f565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b8c578060026000828254610b809190611131565b92505081905550610c5f565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610c18578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610c0f939291906110cb565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610ca85780600260008282540392505081905550610cf5565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d529190610f2f565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d99578082015181840152602081019050610d7e565b60008484015250505050565b6000601f19601f8301169050919050565b6000610dc182610d5f565b610dcb8185610d6a565b9350610ddb818560208601610d7b565b610de481610da5565b840191505092915050565b60006020820190508181036000830152610e098184610db6565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610e4182610e16565b9050919050565b610e5181610e36565b8114610e5c57600080fd5b50565b600081359050610e6e81610e48565b92915050565b6000819050919050565b610e8781610e74565b8114610e9257600080fd5b50565b600081359050610ea481610e7e565b92915050565b60008060408385031215610ec157610ec0610e11565b5b6000610ecf85828601610e5f565b9250506020610ee085828601610e95565b9150509250929050565b60008115159050919050565b610eff81610eea565b82525050565b6000602082019050610f1a6000830184610ef6565b92915050565b610f2981610e74565b82525050565b6000602082019050610f446000830184610f20565b92915050565b600080600060608486031215610f6357610f62610e11565b5b6000610f7186828701610e5f565b9350506020610f8286828701610e5f565b9250506040610f9386828701610e95565b9150509250925092565b600060ff82169050919050565b610fb381610f9d565b82525050565b6000602082019050610fce6000830184610faa565b92915050565b600060208284031215610fea57610fe9610e11565b5b6000610ff884828501610e5f565b91505092915050565b61100a81610e36565b82525050565b60006020820190506110256000830184611001565b92915050565b6000806040838503121561104257611041610e11565b5b600061105085828601610e5f565b925050602061106185828601610e5f565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806110b257607f821691505b6020821081036110c5576110c461106b565b5b50919050565b60006060820190506110e06000830186611001565b6110ed6020830185610f20565b6110fa6040830184610f20565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061113c82610e74565b915061114783610e74565b925082820190508082111561115f5761115e611102565b5b9291505056fea264697066735822122077f5d8e35f06bab745eabf2543cb66dc9f24983e5f32c38468109d752611a16164736f6c634300081c0033";

type MyTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MyTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MyToken__factory extends ContractFactory {
  constructor(...args: MyTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override deploy(
    name: string,
    symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(name, symbol, overrides || {}) as Promise<
      MyToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MyToken__factory {
    return super.connect(runner) as MyToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MyTokenInterface {
    return new Interface(_abi) as MyTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): MyToken {
    return new Contract(address, _abi, runner) as unknown as MyToken;
  }
}
