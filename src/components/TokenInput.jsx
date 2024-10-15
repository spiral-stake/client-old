const TokenInput = ({
  tokenSymbol,
  name,
  label,
  value,
  onChange,
  disabled,
  error,
  additionalInfo,
  placeholder,
}) => {
  return (
    <div className="token-input__container">
      <div className="token-input">
        <div className="token">{tokenSymbol}</div>
        {/* <label htmlFor={name}>{label}</label> */}
        <input
          name={name}
          disabled={disabled}
          value={value}
          onChange={onChange}
          type="number"
          placeholder={placeholder}
        />
      </div>
      <span className="token-input__error">{error ? error : <p></p>}</span>
    </div>
  );
};

export default TokenInput;
