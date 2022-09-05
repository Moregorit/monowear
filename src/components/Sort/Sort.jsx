import {useState, useContext} from "react";
import AppContext from "../../context";

import styles from "./Sort.module.scss";

function Sort() {
  const [sortActive, setSortActive] = useState(false);
  const {sortValue, sortItems} = useContext(AppContext)

  return (
    <div className={styles.sort}>
      {sortActive && (
        <div
          onClick={() => setSortActive(false)}
          className={styles.sortWrapper}
        ></div>
      )}

      <h6>Сортировка:</h6>
      <div>
        <h6
          onClick={() => setSortActive((prev) => !prev)}
          className={`${styles.sortValue} ${styles.dashedUnderline}`}
        >
          {sortValue}
        </h6>
        {sortActive && (
          <div className={styles.sortModal}>
            <div onClick={() => {setSortActive(false); sortItems("популярность")}} className={styles.sortElem}>
              <h6>Популярное</h6>
              <div className={styles.sortDivider}></div>
            </div>
            <div onClick={() => {setSortActive(false); sortItems("сначала дешевле")}} className={styles.sortElem}>
              <h6>Дешевое</h6>
              <div className={styles.sortDivider}></div>
            </div>
            <div onClick={() => {setSortActive(false); sortItems("сначала дороже")}} className={styles.sortElem}>
              <h6>Дорогое</h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sort;
