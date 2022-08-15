import React from "react";
import AppContext from "../../context";

import Card from "../../components/Card/Card";
import Sort from "../../components/Sort/Sort";

function Home({
  categories,
  selectedCategory,
  selectCategory,
  sortValue,
  setSortValue,
  sortItems
}) {
  const { isMobile, loading, items } = React.useContext(AppContext);

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
              className={
                selectedCategory === category ? "categoryActive" : "category"
              }
            >
              {category}
            </div>
          ))}
        </div>
        {!isMobile && (
          <Sort sortItems={sortItems} sortValue={sortValue} setSortValue={setSortValue} />
        )}
      </div>
      {isMobile && <Sort sortItems={sortItems} sortValue={sortValue} setSortValue={setSortValue} />}

      <h2 className="title">{selectedCategory}</h2>
      {loading && <img src="./img/loading.svg" alt="loading" />}
      <div className="products">
        {items
          .filter((item) =>
            item.category.some((category) => category === selectedCategory)
          )
          .map((item) => (
            <Card key={item.id} item={item}/>
          ))}
      </div>
    </div>
  );
}

export default Home;
