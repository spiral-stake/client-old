import { Base } from "./Base";
import { abi as POOL_ROUTER_ABI } from "../../../v1-core/out/SpiralPoolRouter.sol/SpiralPoolRouter.json";
import addresses from "../../../v1-core/addresses/31337.json";

const poolRouterAddress = addresses.spiralPoolRouter;

export default class PoolFactory extends Base {
  constructor(poolAddress) {
    super(poolRouterAddress, POOL_ROUTER_ABI);

    this.poolAddress = poolAddress;
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async depositCollateral(collateralTokenAddress, syAddress, amountCollateral) {
    return await this.write("depositCollateral", [
      this.poolAddress,
      syAddress,
      collateralTokenAddress,
      this.parseUnits(amountCollateral),
    ]);
  }
}
