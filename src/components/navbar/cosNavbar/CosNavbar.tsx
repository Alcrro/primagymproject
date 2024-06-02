"use client";
import { ICart } from "../../../app/_core/subscription";
import "./cosNavbarModal.scss";
import Button from "../../../components/button/Button";
import MenuModal from "../menuModal/MenuModal";
import {
  IAddToCart,
  useAddToCart,
} from "../../../context/addToCart/AddToCartContext";
import { useRouter } from "next/navigation";

export default function CosNavbar({ menu }: { menu: any }) {
  const { addToCart, setAddToCart, removeHandler } = useAddToCart();
  const router = useRouter();
  const moveToHandler = () => {
    router.push("/cos");
  };
  const array = ["abonament", "sedinda", "qty", "pret"];

  return (
    <MenuModal className={menu.link}>
      {/* <div className="cos-modal-header">Cos</div> */}
      <div className="cos-modal-body">
        <div className="title py-2 border-b-2 border-gray-500">Cosul tau: </div>

        <ul className="ul-cos my-2">
          {addToCart.map((sub: IAddToCart, key) => (
            <li key={key} className="li-cos">
              <div className="subscription-description">
                <div>Abonament:</div>
                <span>
                  {sub.category}/{sub.title.split(" ").splice(1)}
                </span>
              </div>
              <div className="pass">
                <div>Sedinta:</div>
                {sub.pass}
              </div>
              <div className="quantity">
                <div>Cantitate:</div>
                {sub.count}
              </div>
              <div className="price">
                <div>Pret: </div>
                {sub.price}
              </div>
              <div className="delete" onClick={() => removeHandler(sub)}>
                <span>X</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="cos-modal-footer">
        <div className="total text-xl">
          <span>Total: </span>
          {addToCart.reduce(
            (total: any, curr: any) => (total += curr.price * curr.count),
            0
          )}
          <span> RON</span>
        </div>
        <Button
          title="Cumpara"
          className="checkout text-white cursor-pointer"
          handleClick={moveToHandler}
        />
      </div>
    </MenuModal>
  );
}
