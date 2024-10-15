import { Base } from "./Base";
import { abi as TOKEN_ABI } from "../../../contracts/out/ERC20.sol/ERC20.json";

export default class ERC20 extends Base {
  constructor(address, ...extendedAbis) {
    super(address, [...TOKEN_ABI, ...extendedAbis]);
  }

  static async createInstance(address) {
    const instance = new ERC20(address);

    const [name, symbol, decimals] = await Promise.all([
      instance.read("name"),
      instance.read("symbol"),
      instance.read("decimals"),
    ]);

    instance.name = name;
    instance.symbol = symbol;
    instance.decimals = decimals;

    return instance;
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async approve(spender, amount) {
    const parsedAmount = this.parseUnits(amount, this.decimals);
    return this.write("approve", [spender, parsedAmount]);
  }

  ///////////////////////////
  // READ FUNCTIONS
  /////////////////////////

  async allowance(owner, spender) {
    const allowance = await this.read("allowance", [owner, spender]);
    return this.formatUnits(allowance, this.decimals);
  }

  async balanceOf(account) {
    const balance = await this.read("balanceOf", [account]);
    return this.formatUnits(balance, this.decimals);
  }
}
