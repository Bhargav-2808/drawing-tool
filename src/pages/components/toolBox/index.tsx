import React from "react";
import styles from "./index.module.css";
import cx from "classnames";
import { COLORS } from "@/constant";
import { useDispatch, useSelector } from "react-redux";
import { changeBrushSize, changeColor } from "@/slice/toolBoxSlice";
import { MENU_ITEMS } from "@/constant";

interface RootState {
  menu: {
    activeMenuItem: string;
    actionMenuItem: object | null;
  };
  toolbox: {
    [key: string]: {
      color: string;
      size: number;
    };
  };
}
const ToolBox = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector(
    (state: RootState) => state.menu.activeMenuItem
  );
  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrushToolOption =
    activeMenuItem === MENU_ITEMS.PENCIL ||
    activeMenuItem === MENU_ITEMS.ERASER;
  const { color, size } = useSelector(
    (state: RootState) => state.toolbox[activeMenuItem]
  );

  const updateBrushSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeBrushSize({ item: activeMenuItem, size: e.target.value }));
  };

  const updateColor = (newColor: string) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
  };

  return (
    <div className={styles.toolboxContainer}>
      {showStrokeToolOption && (
        <div className={styles.toolItem}>
          <h4 className={styles.toolText}>Stroke Color</h4>
          <div className={styles.itemContainer}>
            {Object.entries(COLORS).map(([colorName, colorValue]) => (
              <div
                key={colorName}
                className={cx(styles.colorBox, {
                  [styles.active]: color === colorValue,
                })}
                style={{ backgroundColor: colorValue }}
                onClick={() => updateColor(colorValue)}
              />
            ))}
          </div>
        </div>
      )}
      {showBrushToolOption && (
        <div className={styles.toolItem}>
          <h4 className={styles.toolText}>Brush Size</h4>
          <div className={styles.itemContainer}>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              onChange={updateBrushSize}
              value={size}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolBox;
