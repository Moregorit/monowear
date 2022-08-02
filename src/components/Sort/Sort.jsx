import React from "react";

import styles from "./Sort.module.scss";

function Sort({sortValue, setSortValue, sortItems}) {
  const [sortActive, setSortActive] = React.useState(false);

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
            <div onClick={() => {setSortValue("популярность"); setSortActive(false); sortItems()}} className={styles.sortElem}>
              <h6>Популярное</h6>
              <div className={styles.sortDivider}></div>
            </div>
            <div onClick={() => {setSortValue("сначала дешевле"); setSortActive(false); sortItems()}} className={styles.sortElem}>
              <h6>Дешевое</h6>
              <div className={styles.sortDivider}></div>
            </div>
            <div onClick={() => {setSortValue("сначала дороже"); setSortActive(false); sortItems()}} className={styles.sortElem}>
              <h6>Дорогое</h6>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sort;
