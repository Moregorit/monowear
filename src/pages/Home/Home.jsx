import React from "react";
import AppContext from "../../context";

import Card from "../../components/Card/Card";

function Home({
  categories,
  selectedCategory,
  selectCategory,
}) {
  const {
    isMobile,
    loading,
    items,
  } = React.useContext(AppContext);
  return (
    <div className="content">
      <div className="filters">
        <div className="categories">
          {categories.map((category) => (
            <div 
              onClick={() => {
                selectCategory(category);
              }}
              id={category}
              className={`category ${
                selectedCategory === category ? "categoryActive" : ""
              }`}
            >
              {category}
            </div>
          ))}
        </div>
        <div className="sort">
          <h6>
            <img src="./img/sortTriangle.svg" alt="triangle" width={12}/>
            Сортировка по:
          </h6>
          <h6 className="sortValue dashedUnderline">популярности</h6>
        </div>
      </div>
      <h2 className="title">{selectedCategory}</h2>
      {loading && <img src="./img/loading.svg" alt="loading" />}

      <div className="products">
        {items
          .filter((item) =>
            item.category.some((category) => category === selectedCategory)
          )
          .map((item) => (
            <Card
              key={item.id}
              item={item}
            />
          ))}
      </div>
    </div>
  );
}

export default Home;
