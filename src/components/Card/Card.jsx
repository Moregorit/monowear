import { useState, useContext } from "react";

import AppContext from "../../context";
import "./Card.scss";

function Card({ item }) {
  const {
    divideNumber,
    onCountChange,
    cartItems,
    onAddToCart,
    onAddToFavorite,
    isAdded,
    isFavorite,
  } = useContext(AppContext);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [changedOnce, setChangedOnce] = useState([
    false,
    Math.round(Math.random()),
  ]);

  function selectColor(e) {
    setSelectedColor(item.colors.indexOf(e.target.textContent));
  }

  function selectSize(e) {
    setSelectedSize(item.sizes.indexOf(e.target.textContent));
  }

  function onHandleRandom() {
    changedOnce[0] !== false &&
      setChangedOnce([true, Math.round(Math.random())]);
  }

  return (
    <div className="card" key={item.id}>
      <img
        src={
          selectedColor === ""
            ? (onHandleRandom(), `./img/items/${item.img[changedOnce[1]]}`)
            : `./img/items/${item.img[selectedColor]}`
        }
        alt="product"
      />
      <h3 style={{ minHeight: "44px", maxHeight: "44px", overflowY: "auto" }}>
        {item.name}
      </h3>
      <div className="changeButtons">
        <div className="cardColors">
          {item.colors.map((color, index) => (
            <div
              onClick={(e) => selectColor(e)}
              className={`changeButton color ${
                index === selectedColor ? "changeActive" : ""
              }`}
            >
              {color}
            </div>
          ))}
        </div>
        <div className="cardSizes">
          {item.sizes.map((size, index) => (
            <div
              onClick={(e) => selectSize(e)}
              className={`changeButton size ${
                index === selectedSize ? "changeActive" : ""
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>
      <div className="cardBottom">
        <h3>{divideNumber(item.price)} ₽</h3>
        <div className="cardBottomButtons">
          <img
            onClick={() => onAddToFavorite(item)}
            className="favoriteButton"
            src={isFavorite(item) ? "./img/heartActive.svg" : "./img/heart.svg"}
            width={24}
            alt="wishBtn"
          />

          {isAdded(item) === false ? (
            <div
              id={item.id}
              onClick={() => onAddToCart(item, selectedColor, selectedSize)}
              className="addButton"
            >
              <img id={item.id} src="./img/plus.svg" width={12} alt="plus" />
              <h6 id={item.id}>Добавить</h6>
            </div>
          ) : (
            <div className="cardBottomButtons">
              <div
                onClick={(e) => onCountChange(e, selectedColor, selectedSize)}
                id={item.id}
                className="cardQuantityButton minus cardPlusMinus"
              >
                <img
                  id={item.id}
                  src="./img/minus.svg"
                  width={12}
                  alt="minus"
                  className="minus cardPlusMinus"
                />
              </div>
              <h3 className="cardCount">
                {cartItems.find((cartItem) => cartItem.id === item.id).count}
              </h3>
              <div
                id={item.id}
                onClick={(e) => onCountChange(e, selectedColor, selectedSize)}
                className="cardQuantityButton plus cardPlusMinus"
              >
                <img
                  id={item.id}
                  src="./img/plus.svg"
                  width={12}
                  alt="plus"
                  className="plus cardPlusMinus"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
