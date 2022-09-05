import {useState, useContext, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";

import AppContext from "../../context";
import styles from "./Search.module.scss";
import headerStyles from "./Header.module.scss";

function Header({ setSearchValue }) {
  const { divideNumber, cartItems, isMobile } = useContext(AppContext);
  const [searchActive, setSearchActive] = useState(false);

  const inputRef = useRef();
  const navigate = useNavigate();

  function handleInputClick() {
    setSearchActive(true);
    inputRef.current.focus();
  }

  function handleInputClear() {
    inputRef.current.value = "";
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      setSearchValue(e.target.value);
      navigate('/search');
    }
  }

  return (
    <div>
      <div className={headerStyles.header}>
        <div className={headerStyles.headerLeft}>
          <Link className={headerStyles.headerLeft} to="/">
            <img className={headerStyles.logo} src="./img/logo.svg" width={40} alt="logo" />
            {!isMobile && (
              <div className={headerStyles.headerName}>
                <h1>MONOWEAR</h1>
                <h4 className={headerStyles.status}>твои инь и янь.</h4>
              </div>
            )}
          </Link>
        </div>
        <div className={headerStyles.headerRight}>
          <div
            className={`${styles.search} ${
              searchActive ? styles.searchActive : ""
            }`}
          >
            <img
              onClick={() => handleInputClick()}
              style={{ cursor: "pointer" }}
              src="./img/search.svg"
              width={23}
              alt="search"
              className={searchActive ? styles.searchIcon : ""}
            />

            <input
              onKeyUp={(e) => handleKeyPress(e)}
              ref={inputRef}
              className={headerStyles.searchInput}
              type="text"
              placeholder="Поиск"
            />
            <img
              onClick={() => {
                setSearchActive(false);
                handleInputClear();
              }}
              className={`${styles.searchClear} ${
                searchActive ? styles.searchClearActive : ""
              }`}
              src="./img/plus.svg"
              width={15}
              alt="clear"
            />
          </div>

          <Link to="/favorites">
            <img
              src="./img/heart.svg"
              style={{ transform: "translateY(2px)" }}
              alt="wishList"
            />
          </Link>
          <Link to="/cart">
            <div className={headerStyles.cartRectangle}>
              {!isMobile && (
                <>
                  <h5>
                    {divideNumber(
                      cartItems.reduce(
                        (prev, item) => prev + item.price * item.count,
                        0
                      )
                    )}
                    ₽
                  </h5>
                  <img src="./img/cartSeparator.svg" alt="separator" />
                </>
              )}
              <img src="./img/cart.svg" alt="cart" />
              <h5>{cartItems.reduce((prev, item) => prev + item.count, 0)}</h5>
            </div>
          </Link>
        </div>
        <div className={headerStyles.headerLine}></div>

      </div>
    </div>
  );
}

export default Header;
