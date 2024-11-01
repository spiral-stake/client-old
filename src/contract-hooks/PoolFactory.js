import { Base } from "./Base";
import { abi as POOL_FACTORY_ABI } from "../../../v1-core/out/SpiralPoolFactory.sol/SpiralPoolFactory.json";
import addresses from "../../../v1-core/addresses/31337.json";

const poolFactoryAddress = addresses.spiralPoolFactory;
const underlyingTokensObj = addresses.underlying;

export default class PoolFactory extends Base {
  constructor() {
    super(poolFactoryAddress, POOL_FACTORY_ABI);
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async createSpiralPool(baseToken, amountCycle, cycleDuration, totalCycles, startInterval) {
    const cycleDurationInSeconds = cycleDuration * 60;
    const startIntervalInSeconds = startInterval * 60;

    const receipt = await this.write("createSpiralPool", [
      baseToken.address,
      this.parseUnits(amountCycle, baseToken.decimals),
      cycleDurationInSeconds,
      totalCycles,
      startIntervalInSeconds,
    ]);

    const paddedAddress = receipt.logs[0].topics[1];
    const newSpiralPoolAddress = "0x" + paddedAddress.slice(26);
    return newSpiralPoolAddress;
  }

  ///////////////////////////
  // READ FUNCTIONS
  /////////////////////////

  async getSyTokensForUnderlying(underlyingTokenAddress) {
    return this.read("getValidSYCollateralTokensForBaseToken", [underlyingTokenAddress]);
  }

  async getPoolsForUnderlying(underlyingTokenAddress) {
    return this.read("getSpiralPoolsForBaseToken", [underlyingTokenAddress]);
  }

  readBaseTokensAndYbts() {
    const underlyingTokens = [];

    for (let underlyingObj of Object.values(underlyingTokensObj)) {
      if (underlyingObj.symbol === "wETH") underlyingObj.symbol = "ETH";

      const ybts = [];
      for (let ybtObj of Object.values(underlyingObj.YBTs)) {
        ybts.push({ ...ybtObj });
      }

      underlyingTokens.push({
        address: underlyingObj.address,
        name: underlyingObj.name,
        symbol: underlyingObj.symbol,
        decimals: underlyingObj.decimals,
        ybts,
      });
    }

    return underlyingTokens;
  }
}
