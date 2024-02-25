import React from "react";
import "./FieldInput.scss";

export default function FieldInput(props) {
  return (
    <input
      className={props.className}
      value={props.value}
      name={props.name}
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  );
}
