import {useContext} from "react";
import AppContext from "../../context";
import { useNavigate } from "react-router-dom";

import Card from "../../components/Card/Card";

function Favorites({ searchValue }) {
  const { items, isFavorite } = useContext(AppContext);
  const navigate = useNavigate();
  const pathIsFavorite = () => window.location.pathname === "/favorites";

  return (
    <div className="content">
      <div onClick={() => navigate(-1)} className="backButton"><img src="./img/back.svg" width={9} alt="goBack" /><h6>Назад</h6></div>
      {!items.some((item) => isFavorite(item)) && pathIsFavorite() ? (<>
                
        <h2>Ваш список желаний пуст</h2></>
      ) : (
        <>
          <h2 style={{ marginBottom: "30px" }}>
            {pathIsFavorite()
              ? "Избранное"
              : `${items
                .filter((item) =>
                  item.name.toLowerCase().includes(searchValue.toLowerCase())
                ).length !== 0 ? `Результаты` : `Нет результатов`}  по запросу "${searchValue}"`}
          </h2>
          <div className="products">
            {pathIsFavorite()
              ? items
                  .filter((item) => isFavorite(item))
                  .map((item) => <Card key={item.id} item={item} />)
              : items
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((item) => <Card key={item.id} item={item} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default Favorites;
