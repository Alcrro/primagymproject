"use client";
import { IAntrenorProfile } from "@/app/_core/antrenori";
import Image from "next/image";
import React from "react";

interface ITrainerModal {
  trainers: IAntrenorProfile[];
  slug: string;
}

export default function TrainersModal({ trainers, slug }: ITrainerModal) {
  const filterFind = trainers.filter((filter) => filter.category === slug)!;

  return (
    <>
      {slug === "" ? (
        <div className="trainers-container py-5">
          <h2 className="title">Antrenori</h2>
          <div className="trainers-inner">
            <ul className={`ul-trainers`}>
              {trainers.map((trainer) => (
                <li className={`li-profile-trainer`} key={trainer.id}>
                  <div className="profile-image">
                    {trainer.thumbnail !== "" ? (
                      <Image
                        src={`/profileTrainers/${trainer.thumbnail}.png`}
                        alt="profile-image"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <div className="icon-profile-image" />
                    )}
                  </div>
                  <div className="description-container">
                    <div className="profile-name">
                      <span className="span-describe">numele meu: </span>
                      <span className="profile-name-value">{trainer.name}</span>
                    </div>
                    <div className="profile-age">
                      <span className="span-describe">ani: </span>
                      <span className="profile-name-value">
                        {trainer.age} ani
                      </span>
                    </div>
                    <div className="profile-category">
                      <span className="span-describe">
                        antrenor specializat in:{" "}
                      </span>
                      <span className="profile-name-value">
                        {trainer.category}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="trainers-container py-5">
          <h2 className="title">Antrenori {slug}</h2>
          <div className="trainers-inner">
            <ul
              className={`ul-trainers ${filterFind.length < 2 ? "single" : ""}`}
            >
              {trainers
                .filter((filter) => filter.category === slug)
                .map((trainer) => (
                  <li className={`li-profile-trainer`} key={trainer.id}>
                    <div className="profile-image">
                      {trainer.thumbnail !== "" ? (
                        <Image
                          src={`/profileTrainers/${trainer.thumbnail}.png`}
                          alt="profile-image"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className="icon-profile-image" />
                      )}
                    </div>
                    <div className="description-container">
                      <div className="profile-name">
                        <span className="span-describe">numele meu: </span>
                        <span className="profile-name-value">
                          {trainer.name}
                        </span>
                      </div>
                      <div className="profile-age">
                        <span className="span-describe">ani: </span>
                        <span className="profile-name-value">
                          {trainer.age} ani
                        </span>
                      </div>
                      <div className="profile-category">
                        <span className="span-describe">
                          antrenor specializat in:{" "}
                        </span>
                        <span className="profile-name-value">
                          {trainer.category}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
