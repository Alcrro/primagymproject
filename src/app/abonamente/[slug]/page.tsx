import React from "react";
import "./subscriptionCatCards.scss";
import Button from "../../../components/button/Button";
import { ICart, subscriptions } from "@/app/_core/subscription";
import fitnessCard from "../../../../public/cardsImages/fitnessCards.jpg";
import zumbaCard from "../../../../public/cardsImages/zumbaCard.jpg";
import Image from "next/image";
import SubscriptionCard from "../../../components/abonamente/subscriptionCard/SubscriptionCard";
import SubscriptionTrainers from "../../../components/abonamente/subscriptionCard/SubscriptionTrainsers";
import { trainers } from "../../../app/_core/antrenori";
import "../../../components/abonamente/trainers/trainers.scss";
interface IParams {
  slug: string;
}
// export const dynamic = 'force-dynamic';
export default function page({ params }: { params: IParams }) {
  return (
    <>
      <div className="subscription-category-cards-container">
        <ul className={`subscription-cards ul-${params.slug}`}>
          {subscriptions
            .filter((filter) => filter.category === params.slug)
            .map((category, key) => (
              <li key={key} className={`card ${params.slug} relative`}>
                {category.category === "fitness" ? (
                  <>
                    <SubscriptionCard
                      category={category}
                      imageCard={fitnessCard}
                    />
                  </>
                ) : category.category === "zumba" ? (
                  <>
                    <SubscriptionCard
                      category={category}
                      imageCard={zumbaCard}
                    />
                  </>
                ) : (
                  <>
                    <Image
                      src={zumbaCard}
                      alt="zumba card"
                      height={300}
                      width={500}
                      className="m-auto rounded-lg h-[420px]"
                    />
                    <div className="text-container">
                      <div className="header">
                        Abonament {category.category}{" "}
                      </div>
                      <div className="body">
                        {category.pass < 2 ? (
                          <div className="pass"> {category.pass} intare </div>
                        ) : (
                          <div className="pass"> {category.pass} intrari</div>
                        )}
                        <div className="price">{category.price} RON</div>
                      </div>
                      <div className="footer">
                        <Button
                          title="Doresc abonament"
                          className="add-to-cart"
                        />
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>
      </div>
      <SubscriptionTrainers trainers={trainers} slug={params.slug} />
    </>
  );
}
