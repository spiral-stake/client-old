import "../styles/TokenInput.css";

const TokenInput = ({
  inputToken,
  inputTokens,
  selectedToken,
  handleSelectedTokenChange,
  name,
  value,
  altValue,
  onChange,
  disabled,
  error,
  placeholder,
}) => {
  return (
    <div className="token-input__container">
      <div className="token-input">
        <div className="token">
          {inputTokens ? (
            <select value={selectedToken.symbol} onChange={handleSelectedTokenChange} name="" id="">
              {inputTokens.map((token, index) => {
                return (
                  <option key={index} value={token.symbol}>
                    {token.symbol}
                  </option>
                );
              })}
            </select>
          ) : (
            inputToken.symbol
          )}
        </div>
        <div className="input">
          <input
            name={name}
            disabled={disabled}
            value={value && value.toFixed(6)}
            onChange={onChange}
            type="number"
            placeholder={placeholder}
          />

          <div style={{ fontSize: "12px" }}>~{altValue}</div>
        </div>
      </div>
      <span className="token-input__error">{error ? error : <p></p>}</span>
    </div>
  );
};

export default TokenInput;
