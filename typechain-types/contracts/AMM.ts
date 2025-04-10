/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface AMMInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addLiquidity"
      | "allowance"
      | "approve"
      | "balanceOf"
      | "buyWithETH"
      | "decimals"
      | "feeRate"
      | "isLP"
      | "name"
      | "owner"
      | "removeLiquidity"
      | "renounceOwnership"
      | "reserveA"
      | "reserveB"
      | "setFeeRate"
      | "setLP"
      | "swap"
      | "symbol"
      | "tokenA"
      | "tokenB"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AddLiquidity"
      | "Approval"
      | "BuyWithETH"
      | "OwnershipTransferred"
      | "RemoveLiquidity"
      | "SetFeeRate"
      | "Swap"
      | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "buyWithETH",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "feeRate", values?: undefined): string;
  encodeFunctionData(functionFragment: "isLP", values: [AddressLike]): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeLiquidity",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "reserveA", values?: undefined): string;
  encodeFunctionData(functionFragment: "reserveB", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setFeeRate",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setLP",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(functionFragment: "tokenA", values?: undefined): string;
  encodeFunctionData(functionFragment: "tokenB", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buyWithETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isLP", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "reserveA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "reserveB", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setFeeRate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setLP", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenA", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenB", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace AddLiquidityEvent {
  export type InputTuple = [
    provider: AddressLike,
    amountA: BigNumberish,
    amountB: BigNumberish,
    liquidity: BigNumberish
  ];
  export type OutputTuple = [
    provider: string,
    amountA: bigint,
    amountB: bigint,
    liquidity: bigint
  ];
  export interface OutputObject {
    provider: string;
    amountA: bigint;
    amountB: bigint;
    liquidity: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    spender: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [owner: string, spender: string, value: bigint];
  export interface OutputObject {
    owner: string;
    spender: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BuyWithETHEvent {
  export type InputTuple = [
    buyer: AddressLike,
    tokenOut: AddressLike,
    ethIn: BigNumberish,
    tokenAmount: BigNumberish
  ];
  export type OutputTuple = [
    buyer: string,
    tokenOut: string,
    ethIn: bigint,
    tokenAmount: bigint
  ];
  export interface OutputObject {
    buyer: string;
    tokenOut: string;
    ethIn: bigint;
    tokenAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RemoveLiquidityEvent {
  export type InputTuple = [
    provider: AddressLike,
    amountA: BigNumberish,
    amountB: BigNumberish,
    liquidity: BigNumberish
  ];
  export type OutputTuple = [
    provider: string,
    amountA: bigint,
    amountB: bigint,
    liquidity: bigint
  ];
  export interface OutputObject {
    provider: string;
    amountA: bigint;
    amountB: bigint;
    liquidity: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetFeeRateEvent {
  export type InputTuple = [newFeeRate: BigNumberish];
  export type OutputTuple = [newFeeRate: bigint];
  export interface OutputObject {
    newFeeRate: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SwapEvent {
  export type InputTuple = [
    sender: AddressLike,
    tokenIn: AddressLike,
    tokenOut: AddressLike,
    amountIn: BigNumberish,
    amountOut: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    amountOut: bigint
  ];
  export interface OutputObject {
    sender: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: bigint;
    amountOut: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AMM extends BaseContract {
  connect(runner?: ContractRunner | null): AMM;
  waitForDeployment(): Promise<this>;

  interface: AMMInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addLiquidity: TypedContractMethod<
    [amountA: BigNumberish, amountB: BigNumberish],
    [void],
    "nonpayable"
  >;

  allowance: TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;

  approve: TypedContractMethod<
    [spender: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  buyWithETH: TypedContractMethod<[tokenOut: AddressLike], [void], "payable">;

  decimals: TypedContractMethod<[], [bigint], "view">;

  feeRate: TypedContractMethod<[], [bigint], "view">;

  isLP: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  name: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  removeLiquidity: TypedContractMethod<
    [amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  reserveA: TypedContractMethod<[], [bigint], "view">;

  reserveB: TypedContractMethod<[], [bigint], "view">;

  setFeeRate: TypedContractMethod<
    [_feeRate: BigNumberish],
    [void],
    "nonpayable"
  >;

  setLP: TypedContractMethod<
    [user: AddressLike, status: boolean],
    [void],
    "nonpayable"
  >;

  swap: TypedContractMethod<
    [tokenIn: AddressLike, amountIn: BigNumberish, minAmountOut: BigNumberish],
    [void],
    "nonpayable"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  tokenA: TypedContractMethod<[], [string], "view">;

  tokenB: TypedContractMethod<[], [string], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addLiquidity"
  ): TypedContractMethod<
    [amountA: BigNumberish, amountB: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "allowance"
  ): TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [spender: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "buyWithETH"
  ): TypedContractMethod<[tokenOut: AddressLike], [void], "payable">;
  getFunction(
    nameOrSignature: "decimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "feeRate"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "isLP"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "removeLiquidity"
  ): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "reserveA"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "reserveB"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "setFeeRate"
  ): TypedContractMethod<[_feeRate: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setLP"
  ): TypedContractMethod<
    [user: AddressLike, status: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "swap"
  ): TypedContractMethod<
    [tokenIn: AddressLike, amountIn: BigNumberish, minAmountOut: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "tokenA"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "tokenB"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, value: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "AddLiquidity"
  ): TypedContractEvent<
    AddLiquidityEvent.InputTuple,
    AddLiquidityEvent.OutputTuple,
    AddLiquidityEvent.OutputObject
  >;
  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "BuyWithETH"
  ): TypedContractEvent<
    BuyWithETHEvent.InputTuple,
    BuyWithETHEvent.OutputTuple,
    BuyWithETHEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "RemoveLiquidity"
  ): TypedContractEvent<
    RemoveLiquidityEvent.InputTuple,
    RemoveLiquidityEvent.OutputTuple,
    RemoveLiquidityEvent.OutputObject
  >;
  getEvent(
    key: "SetFeeRate"
  ): TypedContractEvent<
    SetFeeRateEvent.InputTuple,
    SetFeeRateEvent.OutputTuple,
    SetFeeRateEvent.OutputObject
  >;
  getEvent(
    key: "Swap"
  ): TypedContractEvent<
    SwapEvent.InputTuple,
    SwapEvent.OutputTuple,
    SwapEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "AddLiquidity(address,uint256,uint256,uint256)": TypedContractEvent<
      AddLiquidityEvent.InputTuple,
      AddLiquidityEvent.OutputTuple,
      AddLiquidityEvent.OutputObject
    >;
    AddLiquidity: TypedContractEvent<
      AddLiquidityEvent.InputTuple,
      AddLiquidityEvent.OutputTuple,
      AddLiquidityEvent.OutputObject
    >;

    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "BuyWithETH(address,address,uint256,uint256)": TypedContractEvent<
      BuyWithETHEvent.InputTuple,
      BuyWithETHEvent.OutputTuple,
      BuyWithETHEvent.OutputObject
    >;
    BuyWithETH: TypedContractEvent<
      BuyWithETHEvent.InputTuple,
      BuyWithETHEvent.OutputTuple,
      BuyWithETHEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "RemoveLiquidity(address,uint256,uint256,uint256)": TypedContractEvent<
      RemoveLiquidityEvent.InputTuple,
      RemoveLiquidityEvent.OutputTuple,
      RemoveLiquidityEvent.OutputObject
    >;
    RemoveLiquidity: TypedContractEvent<
      RemoveLiquidityEvent.InputTuple,
      RemoveLiquidityEvent.OutputTuple,
      RemoveLiquidityEvent.OutputObject
    >;

    "SetFeeRate(uint256)": TypedContractEvent<
      SetFeeRateEvent.InputTuple,
      SetFeeRateEvent.OutputTuple,
      SetFeeRateEvent.OutputObject
    >;
    SetFeeRate: TypedContractEvent<
      SetFeeRateEvent.InputTuple,
      SetFeeRateEvent.OutputTuple,
      SetFeeRateEvent.OutputObject
    >;

    "Swap(address,address,address,uint256,uint256)": TypedContractEvent<
      SwapEvent.InputTuple,
      SwapEvent.OutputTuple,
      SwapEvent.OutputObject
    >;
    Swap: TypedContractEvent<
      SwapEvent.InputTuple,
      SwapEvent.OutputTuple,
      SwapEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
