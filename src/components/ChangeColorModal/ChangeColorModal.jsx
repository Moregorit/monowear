import styles from "./ChangeColorModal.module.scss"

export default function ChangeColorModal({isModalActive}) {

  return (
    <div className={`${styles.modalWrapper} ${isModalActive && styles.modalWrapperShow}`}>
        <img src="./img/info.svg" alt="info" />
      <div className={styles.modalMessage}>Выберите цвет и размер</div>
    </div>
  );
}
