"use client";
import { ICart } from "@/types/subscription";
import "./cosNavbarModal.scss";
import MenuModal from "../menuModal/MenuModal";
import { useAddToCart } from "@/context/addToCart/AddToCartContext";
import { useRouter } from "next/navigation";

interface ICosNavbarProps {
  menu: { link: string };
}

export default function CosNavbar({ menu }: ICosNavbarProps) {
  const { addToCart, addToCartHandler, removeHandler, deleteHandler } = useAddToCart();
  const router = useRouter();

  const total = addToCart.reduce((sum: number, item: ICart) => sum + item.price * (item.quantity ?? 1), 0);
  const itemCount = addToCart.reduce((sum: number, item: ICart) => sum + (item.quantity ?? 1), 0);

  const moveToHandler = () => {
    router.push("/cos");
  };

  return (
    <MenuModal className={menu.link}>
      <div className="cart-dropdown">
        <div className="cart-dropdown-header">
          <span className="cart-dropdown-title">Coșul tău</span>
          <span className="cart-dropdown-count">
            {itemCount} {itemCount === 1 ? "articol" : "articole"}
          </span>
        </div>

        <ul className="cart-dropdown-list">
          {addToCart.map((item: ICart) => (
            <li key={item.id} className="cart-item">
              <div className="cart-item-body">
                <div className="cart-item-info">
                  <span className="cart-item-category">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  <span className="cart-item-pass">
                    {item.planType === 'entries'
                      ? `${item.pass} ${(item.pass ?? 0) < 2 ? 'ședință' : 'ședințe'}`
                      : `${item.durationMonths} ${item.durationMonths === 1 ? 'lună' : 'luni'}`}
                  </span>
                </div>
                <div className="cart-item-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => removeHandler(item)}
                    aria-label="Scade"
                  >
                    <i className="bi bi-dash" />
                  </button>
                  <span className="stepper-qty">{item.quantity ?? 1}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => addToCartHandler(item)}
                    aria-label="Crește"
                  >
                    <i className="bi bi-plus" />
                  </button>
                </div>
                <span className="cart-item-price">
                  {item.price * (item.quantity ?? 1)} RON
                </span>
                <button
                  className="cart-item-delete"
                  onClick={() => deleteHandler(item)}
                  aria-label="Șterge"
                  type="button"
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="cart-dropdown-footer">
          <div className="cart-total">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-amount">{total} RON</span>
          </div>
          <button className="cart-checkout-btn" onClick={moveToHandler} type="button">
            Finalizează comanda
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </MenuModal>
  );
}
