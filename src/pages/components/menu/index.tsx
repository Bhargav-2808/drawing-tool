import React from "react";
import cx from "classnames";
import styles from "./index.module.css";
import Image from "next/image";
import { MENU_LIST } from "@/constant";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick, actionItemClick } from "@/slice/menuSlice";

interface RootState {
  menu: {
    activeMenuItem: string;
    actionMenuItem: object | null;
  };
}

const Menu = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector(
    (state: RootState) => state.menu.activeMenuItem
  );

  const handleMenuClick = (itemName: string) => {
    dispatch(menuItemClick(itemName));
  };

  const handleActionItemClick = (itemName: string) => {
    dispatch(actionItemClick(itemName));
  };

  return (
    <div className={styles.menuContainer}>
      {MENU_LIST.map((item) => (
        <div
          key={item.name}
          className={cx(styles.iconWrapper, {
            [styles.active]: !item.isAction && activeMenuItem === item.name,
          })}
          onClick={() =>
            item.isAction
              ? handleActionItemClick(item.name)
              : handleMenuClick(item.name)
          }
        >
          <Image
            src={item.icon}
            alt="menu item"
            className={styles.icon}
            width={20}
            height={20}
          />
        </div>
      ))}
    </div>
  );
};

export default Menu;
