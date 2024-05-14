"use client";
import React, { Dispatch, SetStateAction } from "react";
import "./button.scss";

interface IButtonPops {
  title?: string;
  className?: string;
  active?: boolean;
  setActive?: Dispatch<SetStateAction<boolean>>;
  handleClick?: React.MouseEventHandler<HTMLDivElement>;
}
export default function Button(props: IButtonPops) {
  return (
    <div className={`button-container`}>
      <div className={`btn ${props.className}`} onClick={props.handleClick}>
        {props.title}
      </div>
    </div>
  );
}
