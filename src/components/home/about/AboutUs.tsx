import React from "react";
import AboutModel from "./aboutModel/AboutModel";
import "./aboutUs.scss";
export default function AboutUs() {
  return (
    <div className="about-us-container">
      <div className="about-us">
        <AboutModel
          photo=""
          title="Povestea noastra"
          description=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
          quidem asperiores illum facilis similique aperiam esse dignissimos,
          cupiditate odit ullam!"
        />
        <AboutModel
          photo=""
          title="Misiunea noastra"
          description=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
          quidem asperiores illum facilis similique aperiam esse dignissimos,
          cupiditate odit ullam!"
        />
        <AboutModel
          photo=""
          title="Comunitatea Gym"
          description=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
          quidem asperiores illum facilis similique aperiam esse dignissimos,
          cupiditate odit ullam!"
        />
      </div>
    </div>
  );
}
