import React, { Component, useEffect, useRef, useState } from "react";

const Input = ({
  type,
  name,
  label,
  placeholder,
  value,
  onChange,
  autoFocus,
  error,
  additionalInfo,
  disabled,
  select,
  selectName,
  selectOptions,
  selectOnChange,
  selectValue,
}) => {
  const [cursor, setCursor] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (type === "number") return;

    const input = ref.current;
    if (input) input.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  const handleChange = (e) => {
    if (type === "number") return onChange && onChange(e);

    setCursor(e.target.selectionStart);
    onChange && onChange(e);
  };

  return (
    <>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="input-box">
        <input
          disabled={disabled}
          type={type || "text"}
          name={name}
          placeholder={placeholder || ""}
          id={name}
          value={value}
          onChange={handleChange}
          autoFocus={autoFocus}
          ref={ref}
        />
        {select && (
          <select name={selectName} onChange={selectOnChange} value={selectValue} id="">
            {selectOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {additionalInfo && <small>{additionalInfo}</small>}
    </>
  );
};

export default Input;
