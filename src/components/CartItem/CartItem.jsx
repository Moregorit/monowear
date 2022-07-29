import React from "react";

import AppContext from "../../context";
import "./CartItem.scss";

function CartItem({ cartItem, onClickRemove }) {
  const { divideNumber, onCountChange } = React.useContext(AppContext);
  return (
    <div className="cartItem">
      <div className="divider"></div>
      <div className="cartItemContent">
        <div className="cartItemInfo">
          <img
            src={`./img/items/${cartItem.img[cartItem.selectedColor]}`}
            width={120}
            height={120}
            alt="item"
          />
          <div className="cartItemInfoText"><h3>{cartItem.name}</h3>
          <h4>
            {cartItem.colors[cartItem.selectedColor]},{" "}
            {cartItem.sizes[cartItem.selectedSize]}
          </h4></div>
        </div>
        <div className="cartItemControl">
          <div className="cartItemQuantity">
            <div
              disabled={true}
              onClick={(e) => onCountChange(e, cartItem.selectedColor, cartItem.selectedSize)}
              id={cartItem.id}
              className="cartItemQuantityButton minus"
            >
              <img
                id={cartItem.id}
                src="./img/minus.svg"
                width={10}
                alt="minus"
                className="minus"
              />
            </div>
            <h3>{cartItem.count}</h3>
            <div
              id={cartItem.id}
              onClick={(e) => onCountChange(e)}
              className="cartItemQuantityButton plus"
            >
              <img
                id={cartItem.id}
                src="./img/plus.svg"
                width={10}
                alt="plus"
                className="plus"
              />
            </div>
          </div>
          <h3>{`${divideNumber(cartItem.price)} ₽`}</h3>
          <div className="cartItemRemoveButton">
            <img onClick={() => onClickRemove(cartItem)} src="./img/plus.svg" width={10} alt="remove" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
