import ERC20 from "./ERC20"; // Importing the ERC20 class
import { abi as ABI_SY } from "../../../contracts/out/SYBase.sol/SYBase.json";

export default class SY extends ERC20 {
  constructor(address) {
    super(address, ...ABI_SY);
  }

  static async createInstance(address) {
    const instance = new SY(address);

    const { name, symbol, decimals } = await ERC20.createInstance(address);

    instance.name = name;
    instance.symbol = symbol;
    instance.decimals = decimals;

    return instance;
  }

  ///////////////////////////
  // SPECIFIC SY FUNCTIONS
  /////////////////////////

  async getYbt() {
    return this.read("yieldToken");
  }

  async getYbtUnderlying() {
    const assetInfo = await this.read("assetInfo");
    return assetInfo[1];
  }
}
