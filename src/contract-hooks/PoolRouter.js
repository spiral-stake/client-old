import { Base } from "./Base";
import { abi as POOL_ROUTER_ABI } from "../abi/SpiralPoolRouter.sol/SpiralPoolRouter.json";
import addresses from "../addresses/89346162.json";
import { parseUnits } from "../utils/formatUnits";

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
    return this.write("depositCollateral", [
      this.poolAddress,
      syAddress,
      collateralTokenAddress,
      parseUnits(amountCollateral),
    ]);
  }
}
