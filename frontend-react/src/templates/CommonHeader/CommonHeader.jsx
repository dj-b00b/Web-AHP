import React from "react";
import "./CommonHeader.scss";

export default function CommonHeader(props) {
  return <div className="header">{props.children}</div>;
}
