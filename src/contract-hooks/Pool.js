import { Base } from "./Base";
import { abi as POOL_ABI } from "../../../v1-core/out/SpiralPool.sol/SpiralPool.json";
import { formatUnits } from "../utils/formatUnits";

export default class Pool extends Base {
  constructor(address) {
    super(address, POOL_ABI);
  }

  static async createInstance(address) {
    const instance = new Pool(address);

    const [
      amountCycleDeposit,
      amountCollateralInAccounting,
      cycleDuration,
      totalCycles,
      startTime,
    ] = await Promise.all([
      instance.read("getAmountCycleDeposit"),
      instance.read("getAmountCollateralInAccounting"), // Need to calc here only
      instance.read("getCycleDuration"),
      instance.read("getTotalCycles"),
      instance.read("getStartTime"),
      instance.getPositionsFilled(),
      instance.getCyclesFinalized(),
    ]);

    instance.address = instance.address;
    instance.amountCycleDeposit = formatUnits(amountCycleDeposit);
    instance.amountCollateralInAccounting = formatUnits(amountCollateralInAccounting);
    instance.cycleDuration = parseInt(cycleDuration);
    instance.totalCycles = parseInt(totalCycles);
    instance.requiredPositions = parseInt(totalCycles);
    instance.startTime = parseInt(startTime);
    instance.endTime = instance.startTime + instance.cycleDuration * instance.totalCycles;

    return instance;
  }

  async getPositionsFilled() {
    return parseInt(await this.read("getPositionsFilled"));
  }

  async getCyclesFinalized() {
    return parseInt(await this.read("getCyclesFinalized"));
  }

  async getAmountCollateral(collateralToken) {
    const amountCollateral = await this.read("getAmountCollateral", [collateralToken.syAddress]);
    return formatUnits(amountCollateral, collateralToken.decimals);
  }

  async getAllPositionsWithOwners() {
    const positions = await this.read("getAllPositions");
    const owners = await Promise.all(positions.map((_, index) => this.read("ownerOf", [index])));

    for (let i = 0; i < positions.length; i++) {
      positions[i].owner = owners[i];
    }

    return positions;
  }

  currentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  calcPoolState(positionsFilled, cyclesFinalized) {
    const timestamp = this.currentTimestamp();

    if (timestamp < this.startTime) return "WAITING";
    if (positionsFilled < this.requiredPositions) return "DISCARDED";
    if (timestamp >= this.endTime || cyclesFinalized === this.totalCycles) return "ENDED";
    return "LIVE";
  }

  calcCurrentCycle() {
    const timestamp = this.currentTimestamp();
    return Math.floor((timestamp - this.startTime) / this.cycleDuration) + 1;
  }
}
