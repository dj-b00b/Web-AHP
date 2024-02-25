import React from "react";
import "./TypicalHeader.scss";
import CommonHeader from "../CommonHeader/CommonHeader";

export default function TypicalHeader(props) {
  return (
    <CommonHeader>
      <div className="left_field">
        <div className="icon_left">{props.icon1}</div>
        <h1 className="title">{props.title}</h1>
      </div>

      <div className="icon_right">{props.icon2}</div>
    </CommonHeader>
  );
}
