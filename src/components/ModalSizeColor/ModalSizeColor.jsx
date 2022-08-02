import React from "react";

import styles from "./ModalSizeColor.module.scss"

export default function ModalSizeColor({modalActive}) {

  return (
    <div className={`${styles.modalWrapper} ${modalActive && styles.modalWrapperShow}`}>
        <img src="./img/info.svg" alt="info" />
      <div className={styles.modalMessage}>Выберите цвет и размер</div>
    </div>
  );
}
