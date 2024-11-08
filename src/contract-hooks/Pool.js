import { Base } from "./Base";
import { abi as POOL_ABI } from "../abi/SpiralPool.sol/SpiralPool.json";
import { formatUnits } from "../utils/formatUnits";
import { readBaseToken } from "../config/contractsData";
import ERC20 from "./ERC20";

export default class Pool extends Base {
  constructor(address) {
    super(address, POOL_ABI);
  }

  static async createInstance(address, chainId, baseTokenSymbol) {
    const instance = new Pool(address);
    instance.chainId = chainId;

    if (baseTokenSymbol) {
      const baseTokenData = await readBaseToken(chainId, baseTokenSymbol);
      const collateralTokensData = baseTokenData.ybts;

      const { address: tokenAddress, name, symbol, decimals } = baseTokenData;
      const baseToken = new ERC20(tokenAddress, name, symbol, decimals);
      const collateralTokens = instance.formatCollateralTokens(collateralTokensData);

      instance.baseToken = baseToken;
      instance.collateralTokens = collateralTokens;
    }

    const [
      amountCycle,
      amountCollateralInAccounting,
      cycleDuration,
      cycleDepositDuration,
      totalCycles,
      startTime,
    ] = await Promise.all([
      instance.read("getamountCycle", [], chainId),
      instance.read("getAmountCollateralInAccounting", [], chainId),
      instance.read("getCycleDuration", [], chainId),
      instance.read("getCycleDepositDuration", [], chainId),
      instance.read("getTotalCycles", [], chainId),
      instance.read("getStartTime", [], chainId),
      instance.getPositionsFilled(),
      instance.getCyclesFinalized(),
    ]);

    instance.address = instance.address;
    instance.amountCycle = formatUnits(amountCycle);
    instance.amountCollateralInAccounting = formatUnits(amountCollateralInAccounting);
    instance.cycleDuration = parseInt(cycleDuration);
    instance.cycleDepositDuration = parseInt(cycleDepositDuration);
    instance.totalCycles = parseInt(totalCycles);
    instance.totalPositions = parseInt(totalCycles);
    instance.startTime = parseInt(startTime);
    instance.endTime = instance.startTime + instance.cycleDuration * instance.totalCycles;

    return instance;
  }

  async depositYbtCollateral(syCollateralTokenAddress, receiver) {
    return this.write("depositYbtCollateral", [syCollateralTokenAddress, receiver]);
  }

  async depositCycle(positionId) {
    return this.write("depositCycle", [positionId]);
  }

  async redeemCollateralYield(positionId) {
    return this.write("redeemCollateralYield", [positionId]);
  }

  async redeemCollateralIfDiscarded(positionId) {
    return this.write("redeemCollateralIfDiscarded", [positionId]);
  }

  async getPositionsFilled() {
    return parseInt(await this.read("getPositionsFilled", [], this.chainId));
  }

  async getCyclesFinalized() {
    return parseInt(await this.read("getCyclesFinalized", [], this.chainId));
  }

  async getAmountCollateral(collateralToken) {
    const amountCollateral = await this.read(
      "getAmountCollateral",
      [collateralToken.syAddress],
      this.chainId
    );
    return formatUnits(amountCollateral, collateralToken.decimals);
  }

  async getAllPositions() {
    const positionsData = await this.read("getAllPositions", [], this.chainId);
    const positions = await Promise.all(positionsData.map((_, index) => this.getPosition(index)));
    return positions;
  }

  async getPosition(positionId) {
    const [position, owner] = await Promise.all([
      this.read("getPosition", [positionId], this.chainId),
      this.read("ownerOf", [positionId], this.chainId),
    ]);

    const collateralToken = this.collateralTokens.find(
      (collateralToken) => collateralToken.syAddress === position.syCollateralToken
    );

    position.id = positionId;
    position.owner = owner;
    position.collateralToken = collateralToken;
    position.amountCollateral = formatUnits(position.amountCollateral);
    position.winningCycle = parseInt(position.winningCycle);

    return position;
  }

  async getCollateralYield(position) {
    const amountCollateralYield = await this.read(
      "getCollateralYield",
      [position.id],
      this.chainId
    );
    return formatUnits(amountCollateralYield, position.collateralToken.decimals);
  }

  currentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  calcPoolState(positionsFilled, cyclesFinalized) {
    const timestamp = this.currentTimestamp();

    if (timestamp < this.startTime) return "WAITING";
    else if (positionsFilled < this.totalPositions) return "DISCARDED";
    else if (timestamp >= this.endTime || cyclesFinalized === this.totalCycles) return "ENDED";
    else return "LIVE";
  }

  calcCurrentCycle() {
    const timestamp = this.currentTimestamp();
    return Math.floor((timestamp - this.startTime) / this.cycleDuration) + 1;
  }

  calcIsCycleDepositWindowOpen(currentCycle) {
    const timestamp = this.currentTimestamp();

    const currentCycleStartTime = this.startTime + (currentCycle - 1) * this.cycleDuration;
    const currentCycleDepositEndTime = currentCycleStartTime + this.cycleDepositDuration; // cycleDepositDuration can be calculated here only

    return timestamp >= currentCycleStartTime && timestamp <= currentCycleDepositEndTime;
  }

  formatCollateralTokens = (collateralTokensData) => {
    const collateralTokens = [];

    collateralTokensData.forEach((tokenData, index) => {
      const { address, name, symbol, decimals, syAddress } = tokenData;
      const _collateralToken = new ERC20(address, name, symbol, decimals);
      _collateralToken.syAddress = syAddress;
      _collateralToken.index = index; // Add index to each token
      collateralTokens.push(_collateralToken);
    });

    return collateralTokens;
  };
}
