import "../styles/TokenInput.css";

const TokenInput = ({
  label,
  inputToken,
  inputTokens,
  selectedToken,
  handleTokenChange,
  selectName,
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
      {label && (
        <label className="label" htmlFor="">
          {label}
        </label>
      )}
      <div className="token-input">
        <div className="token">
          {inputTokens ? (
            <select
              value={selectedToken.symbol}
              onChange={handleTokenChange}
              name={selectName}
              id=""
            >
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
            value={value}
            onChange={onChange}
            type="number"
            placeholder={placeholder}
          />

          {altValue && <div style={{ fontSize: "12px" }}>~{altValue}</div>}
        </div>
      </div>
      <span className="token-input__error">{error ? error : <p></p>}</span>
    </div>
  );
};

export default TokenInput;
