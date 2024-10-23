import { Base } from "./Base";
import { abi as POOL_FACTORY_ABI } from "../../../v1-core/out/SpiralPoolFactory.sol/SpiralPoolFactory.json";
import addresses from "../../../v1-core/addresses/31337.json";

const poolFactoryAddress = addresses.spiralPoolFactory;

export default class PoolFactory extends Base {
  constructor() {
    super(poolFactoryAddress, POOL_FACTORY_ABI);
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  ///////////////////////////
  // READ FUNCTIONS
  /////////////////////////

  async getSyTokensForUnderlying(underlyingTokenAddress) {
    return this.read("getSYTokensForUnderlying", [underlyingTokenAddress]);
  }

  async getPoolsForUnderlying(underlyingTokenAddress) {
    return this.read("getSpiralPoolsForUnderlying", [underlyingTokenAddress]);
  }

  readUnderlyingTokensAndYbts() {
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
