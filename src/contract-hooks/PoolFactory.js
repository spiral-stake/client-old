import { Base } from "./Base";
import { abi as POOL_FACTORY_ABI } from "../abi/SpiralPoolFactory.sol/SpiralPoolFactory.json";
import { parseUnits } from "../utils/formatUnits";

export default class PoolFactory extends Base {
  constructor(poolFactoryAddress) {
    super(poolFactoryAddress, POOL_FACTORY_ABI);
  }

  static async createInstance(chainId) {
    const { spiralPoolFactory } = await import(`../addresses/${chainId}.json`);
    return new PoolFactory(spiralPoolFactory);
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async createSpiralPool(baseToken, amountCycle, totalCycles, cycleDuration, startInterval) {
    const receipt = await this.write("createSpiralPool", [
      baseToken.address,
      parseUnits(amountCycle, baseToken.decimals),
      cycleDuration,
      totalCycles,
      startInterval,
    ]);

    const paddedAddress = receipt.logs[0].topics[1];
    const newSpiralPoolAddress = "0x" + paddedAddress.slice(26);
    return newSpiralPoolAddress;
  }

  ///////////////////////////
  // READ FUNCTIONS
  /////////////////////////

  async getSyTokensForBaseToken(baseTokenAddress) {
    return this.read("getValidSYCollateralTokensForBaseToken", [baseTokenAddress]);
  }

  async getPoolsForBaseToken(baseTokenAddress) {
    const pools = await this.read("getSpiralPoolsForBaseToken", [baseTokenAddress]);
    return pools.reverse();
  }
}
