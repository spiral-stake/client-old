import { Base } from "./Base";
import { abi as TOKEN_ABI } from "../../../v1-core/out/ERC20.sol/ERC20.json";

export default class ERC20 extends Base {
  constructor(address, name, symbol, decimals, ...extendedAbis) {
    super(address, [...TOKEN_ABI, ...extendedAbis]);

    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
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
