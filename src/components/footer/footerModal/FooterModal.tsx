"use client";
import Link from "next/link";
import React from "react";
import "./footerModal.scss";
export default function FooterModal({
  props,
  title,
  className,
}: {
  props: [];
  title: string;
  className: string;
}) {
  return (
    <div className="footer-col footer-rules-container">
      <div className="title">{title}</div>
      <div className={`footer-${className}`}>
        <ul>
          {props.map((rule: any, key: number) => (
            <li key={key}>
              <Link href={`/${className}/${rule.link}`}>
                <span className="name">{rule.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
