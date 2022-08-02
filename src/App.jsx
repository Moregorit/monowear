import axios from "axios";
import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.scss";
import Header from "./components/Header/Header";
import Cart from "./pages/Cart/Cart";
import AppContext from "./context";
import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import ModalSizeColor from "./components/ModalSizeColor/ModalSizeColor";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("Все");
  const [loading, setIsLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [sortValue, setSortValue] = React.useState("популярность");
  const [modalActive, setModalActive] = React.useState(false);

  const isMobile = window.matchMedia("(max-width: 926px)").matches;
  // (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))

  React.useEffect(() => {
    async function fetchData() {
      await setIsLoading(true);
      const itemsRes = await axios
        .get("http://localhost:3003/items")
        .then((res) => res);
      const cartItemsRes = await axios
        .get("http://localhost:3003/cart")
        .then((res) => res);
      const categoriesRes = await axios
        .get("http://localhost:3003/categories")
        .then((res) => res);
      const favoritesRes = await axios
        .get("http://localhost:3003/favorites")
        .then((res) => res);

      await setItems(
        itemsRes.data.sort((a, b) => b.ordersQuantity - a.ordersQuantity)
      );
      await setCartItems(cartItemsRes.data);
      await setCategories(categoriesRes.data);
      await setFavorites(favoritesRes.data);
      await setIsLoading(false);
    }

    fetchData();
  }, []);

  const timerRef = React.useRef(null);
  const handleTimeout = () => {
    timerRef.current = setTimeout(() => {
      setModalActive(false);
    }, 2000);
  };
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current); // очистка таймера
  }, []);

  const onAddToCart = async (item, selectedColor, selectedSize) => {
    try {
      if (
        // if selected => index === number, else => ''
        (selectedColor || selectedColor === 0) &&
        (selectedSize || selectedSize === 0) &&
        !isAdded(item)
      ) {
        await setCartItems((prev) => [
          ...prev,
          {
            ...item,
            count: 1,
            selectedColor: selectedColor, // add select values
            selectedSize: selectedSize,
          },
        ]);
        await axios.post("http://localhost:3003/cart", {
          ...item,
          count: 1,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
        });
      } else {
        setModalActive(true);
        handleTimeout();
      }
    } catch (error) {
      alert(error);
    }
  };

  const onCountChange = async (e, selectedColor, selectedSize) => {
    const cartItem = cartItems.find(
      (cartItem) => Number(cartItem.id) === Number(e.target.id)
    );

    await (function () {
      if (/plus/.test(e.target.className)) {
        //classname of every plus btn
        cartItem.count = cartItem.count + 1;
      } else if (/minus/.test(e.target.className)) {
        //classname of every plus btn
        cartItem.count <= 1
          ? onClickRemove(cartItem)
          : (cartItem.count = cartItem.count - 1);
      }
    })();

    const regex = /pisos/; //class name of card  -/+ buttons
    regex.test(e.target.className) // if click on card item, not in a cart
      ? await axios.put(`http://localhost:3003/cart/${cartItem.id}`, {
          category: cartItem.category,
          colors: cartItem.colors,
          sizes: cartItem.sizes,
          id: cartItem.id,
          img: cartItem.img,
          price: cartItem.price,
          name: cartItem.name,
          count: cartItem.count,
          selectedColor:
            selectedColor === "" ? cartItem.selectedColor : selectedColor,
          selectedSize:
            selectedSize === "" ? cartItem.selectedSize : selectedSize,
        })
      : await axios.put(`http://localhost:3003/cart/${e.target.id}`, cartItem);
    const cartItemsRes = await axios
      .get("http://localhost:3003/cart")
      .then((res) => res);
    await setCartItems(cartItemsRes.data);
  };

  const onClickRemove = async (item) => {
    await setCartItems((prev) =>
      prev.filter((cartItem) => cartItem.id !== item.id)
    );
    await axios.delete(`http://localhost:3003/cart/${item.id}`);
  };

  const onCartClear = async () => {
    await cartItems.forEach((item) =>
      axios.delete(`http://localhost:3003/cart/${item.id}`)
    );
    await setCartItems([]);
  };

  const onAddToFavorite = async (item) => {
    try {
      if (isFavorite(item)) {
        await setFavorites((prev) =>
          prev.filter((favItem) => favItem.id !== item.id)
        );
        await axios.delete(`http://localhost:3003/favorites/${item.id}`);
      } else {
        await setFavorites((prev) => [...prev, item]);
        await axios.post("http://localhost:3003/favorites", item);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isAdded = (item) => {
    return cartItems.some((cartItem) => cartItem.id === item.id);
  };

  const isFavorite = (item) => {
    return favorites.some((cartItem) => cartItem.id === item.id);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  React.useEffect(() => {
    setSelectedCategory(selectedCategory);
    setSortValue(sortValue);
  }, [selectedCategory, sortValue]);

  function divideNumber(x, delimiter) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ");
  }

  return (
    <AppContext.Provider
      value={{
        cartItems,
        onCountChange,
        divideNumber,
        isMobile,
        loading,
        items,
        isAdded,
        onAddToCart,
        isFavorite,
        onAddToFavorite,
      }}
    >
      <Header setSearchValue={setSearchValue} />
      <div
        style={{ paddingTop: "130px" }}
        className={`wrapper ${isMobile ? "wrapperMobile" : ""}`}
      >
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Home
                categories={categories}
                selectedCategory={selectedCategory}
                selectCategory={selectCategory}
                sortValue={sortValue}
                setSortValue={setSortValue}
                setItems={setItems}
              />
            }
          ></Route>
          <Route
            path="/cart"
            element={
              <Cart onClickRemove={onClickRemove} onCartClear={onCartClear} />
            }
          ></Route>
          <Route path="/favorites" element={<Favorites />}></Route>
          <Route
            path="/search"
            element={<Favorites searchValue={searchValue} />}
          ></Route>
        </Routes>
        <ModalSizeColor
          modalActive={modalActive}
          setModalActive={setModalActive}
        />
      </div>
    </AppContext.Provider>
  );
}

export default App;
