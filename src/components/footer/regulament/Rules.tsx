"use client";
import { rules } from "../../../app/_core/rules";
import Link from "next/link";
import React from "react";
import "./rules.scss";
export default function Rules() {
  return (
    <div className="footer-rules-container">
      <div className="title">Regulament</div>
      <div className="footer-rules">
        <ul>
          {rules.map((rule, key) => (
            <li key={key}>
              <Link href={`/regulament/${rule.link}`}>
                <div className="name">{rule.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
