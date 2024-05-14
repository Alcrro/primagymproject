"use client";
import React from "react";
import "./shorts.scss";
import ShortBody from "./ShortBody";

export default function Shorts() {
  return (
    <div className="short-container relative">
      <div className="short-inner">
        <div className="title">
          <span className="span-title">Shorts</span>
        </div>
        <div className="short-body">
          <ShortBody shortModal="" />
        </div>
      </div>
    </div>
  );
}
