import React from "react";
import { useNavigate } from "react-router-dom";

import AppContext from "../../context";
import CartItem from "../../components/CartItem/CartItem";
import "./Cart.scss";

export default function Cart({onClickRemove, onCartClear}) {
  const { cartItems, divideNumber } = React.useContext(AppContext);
  const navigate  = useNavigate();
  return (
    <div className="cartWrapper">
      {cartItems.length === 0 ? (<>
                <div onClick={() => navigate(-1)} className="backButton"><img src="./img/back.svg" width={9} alt="goBack" /><h6>Назад</h6></div>

        <h2>Корзина пуста</h2></>
      ) : (
        <div className="cart">
          <div>
            <h2>Корзина</h2>
            <div onClick={onCartClear} className="trash">
              <img src="./img/trash.svg" alt="" /> <h6>Очистить корзину</h6>
            </div>
          </div>

          <div className="cartItemsList">
            {cartItems.map((cartItem) => (
              <CartItem cartItem={cartItem} onClickRemove={onClickRemove} />
            ))}
          </div>

          <div className="cartBottom">
            <div style={{ display: "flex" }}>
              <h3>Количество товаров:</h3>
              <h3
                style={{ fontWeight: "700", marginLeft: "12px" }}
              >{`${cartItems.reduce(
                (prev, item) => prev + item.count,
                0
              )} шт.`}</h3>
            </div>
            <div style={{ display: "flex", justifySelf: "end" }}>
              <h3>Сумма заказа:</h3>
              <h3 style={{ fontWeight: "700", marginLeft: "12px" }}>
                {divideNumber(
                  cartItems.reduce(
                    (prev, next) => prev + next.price * next.count,
                    0
                  )
                )}
                ₽
              </h3>
            </div>
            <div onClick={() => navigate(-1)} className="cartBackButton">
              <img src="./img/back.svg" alt="back" />
              <h6>Назад</h6>
            </div>
            <div className="orderButton">
              <h6>Заказать</h6>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}