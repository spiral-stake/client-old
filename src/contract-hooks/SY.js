import ERC20 from "./ERC20"; // Importing the ERC20 class
import { abi as ABI_SY } from "../abi/SYBase.sol/SYBase.json";
import { formatUnits } from "../utils/formatUnits";

export default class SY extends ERC20 {
  constructor(address) {
    super(address, ...ABI_SY);
  }

  ///////////////////////////
  // SPECIFIC SY FUNCTIONS
  /////////////////////////

  async getYbtExchangeRate(ybt) {
    const syExchangeRate = await this.read("exchangeRate");
    return formatUnits(syExchangeRate, ybt.decimals);
  }

  async getUnderlying() {
    const assetInfo = await this.read("assetInfo");
    return assetInfo[1];
  }
}
