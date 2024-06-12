import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import IInputText from "./IInputText";

export default function Input({
  placeholder = "Digite ou fale o que deseja!",
  type = "text",
  onChange,
  required,
  label,
  icon,
  secondaryIcon,
  onSecondaryIconClick,
  value,
}: IInputText) {
  // const [valorInput, setValorInput] = useState(value ? String(value) : '');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // const novoValor = e.target.value;
    // setValorInput(novoValor);

    // if (onChange) {
    //   onChange(e);
    // }
  };

  const inputId = `input-${uuidv4()}`;

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="font-bold text-center" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="flex flex-row justify-between space-x-2 px-2 rounded-lg">
        <div className="flex w-full">
          <input
            type={type}
            onChange={handleInputChange}
            value={value}
            id={inputId}
            placeholder={placeholder}
            className="w-full p-1 ring-1 rounded ring-gray-200"
            required={required}
          />
        </div>
        <div className="flex flex-row">
          {secondaryIcon && (
            <span className="min-w-8 ml-auto bg-white flex items-center justify-center cursor-pointer" onClick={() => onSecondaryIconClick()}>
              {secondaryIcon}
            </span>
          )}
          {icon && (
            <span className="min-w-8 ml-auto rounded bg-yellow-300 flex items-center justify-center cursor-pointer">
              {icon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
