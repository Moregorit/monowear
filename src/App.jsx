import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.scss";
import port from "./port.json";
import Header from "./components/Header/Header";
import Cart from "./pages/Cart/Cart";
import AppContext from "./context";
import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import ChangeColorModal from "./components/ChangeColorModal/ChangeColorModal";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [loading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("популярность");
  const [isModalActive, setModalActive] = useState(false);

  const isMobile = window.matchMedia("(max-width: 926px)").matches;
  // (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const itemsRes = await axios.get(`http://localhost:${port.port}/items`);
      const cartItemsRes = await axios.get(
        `http://localhost:${port.port}/cart`
      );
      const categoriesRes = await axios.get(
        `http://localhost:${port.port}/categories`
      );
      const favoritesRes = await axios.get(
        `http://localhost:${port.port}/favorites`
      );

      setItems(
        itemsRes.data.sort((a, b) => b.ordersQuantity - a.ordersQuantity)
      );
      setCartItems(cartItemsRes.data);
      setCategories(categoriesRes.data);
      setFavorites(favoritesRes.data);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const timerRef = useRef(null);
  const handleTimeout = () => {
    timerRef.current = setTimeout(() => {
      setModalActive(false);
    }, 2000);
  };
  useEffect(() => {
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
        setCartItems([
          ...cartItems,
          {
            ...item,
            count: 1,
            selectedColor: selectedColor, // add select values
            selectedSize: selectedSize,
          },
        ]);
        await axios.post(`http://localhost:${port.port}/cart`, {
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

    const regex = /cardPlusMinus/; //class name of card -/+ buttons
    regex.test(e.target.className) // if click on card item, not in a cart
      ? await axios.put(`http://localhost:${port.port}/cart/${cartItem.id}`, {
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
      : await axios.put(
          `http://localhost:${port.port}/cart/${e.target.id}`,
          cartItem
        );
    const cartItemsRes = await axios
      .get(`http://localhost:${port.port}/cart`)
      .then((res) => res);
    setCartItems(cartItemsRes.data);
  };

  const onClickRemove = async (item) => {
    setCartItems([...cartItems.filter((cartItem) => cartItem.id !== item.id)]);
    await axios.delete(`http://localhost:${port.port}/cart/${item.id}`);
  };

  const onCartClear = async () => {
    setCartItems([]);
    await cartItems.forEach((item) =>
      axios.delete(`http://localhost:${port.port}/cart/${item.id}`)
    );
  };

  const onAddToFavorite = async (item) => {
    try {
      if (isFavorite(item)) {
        setFavorites([
          ...favorites.filter((favItem) => favItem.id !== item.id),
        ]);
        await axios.delete(
          `http://localhost:${port.port}/favorites/${item.id}`
        );
      } else {
        setFavorites([...favorites, item]);
        await axios.post(`http://localhost:${port.port}/favorites`, item);
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

  const sortItems = (value) => {
    setSortValue(value);
    switch (sortValue) {
      case "популярность":
        setItems([
          ...items.sort((a, b) => b.ordersQuantity - a.ordersQuantity),
        ]);
        break;
      case "сначала дороже":
        setItems([...items.sort((a, b) => b.price - a.price)]);
        break;
      case "сначала дешевле":
        setItems([...items.sort((a, b) => a.price - b.price)]);
        break;
      default:
        setItems([
          ...items.sort((a, b) => b.ordersQuantity - a.ordersQuantity),
        ]);
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

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
        sortValue,
        sortItems,
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
                sortItems={sortItems}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart onClickRemove={onClickRemove} onCartClear={onCartClear} />
            }
          />
          <Route path="/favorites" element={<Favorites />} />
          <Route
            path="/search"
            element={<Favorites searchValue={searchValue} />}
          />
        </Routes>
        <ChangeColorModal
          isModalActive={isModalActive}
          setModalActive={setModalActive}
        />
      </div>
    </AppContext.Provider>
  );
}

export default App;
