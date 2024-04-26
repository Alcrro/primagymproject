"use client";
import React, { Dispatch, SetStateAction } from "react";
import "./button.scss";

interface IButtonPops {
  title?: string;
  className?: string;
  active?: boolean;
  setActive?: Dispatch<SetStateAction<boolean>>;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export default function Button(props: IButtonPops) {
  return (
    <div className={`button-container`}>
      <button className={`btn ${props.className}`} onClick={props.handleClick}>
        {props.title}
      </button>
    </div>
  );
}
