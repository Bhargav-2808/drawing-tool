import { MENU_ITEMS } from "@/constant";
import { actionItemClick } from "@/slice/menuSlice";
import React, { useRef, useLayoutEffect, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

interface menuState {
  menu: {
    activeMenuItem: string;
    actionMenuItem: string | null;
  };
}

interface toolboxState {
  toolbox: {
    [key: string]: {
      color: string;
      size: number;
    };
  };
}
const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector(
    (state: menuState) => state.menu
  );
  const { color, size } = useSelector(
    (state: toolboxState) => state.toolbox[activeMenuItem]
  );
  const drawHistory = useRef<ImageData[]>([]);
  const shouldDraw = useRef<boolean>(false);
  const historyPointer = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    if (actionMenuItem && actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.href = url;
      a.download = "canvas.png";
      a.click();
      return;
    }

    if (actionMenuItem === MENU_ITEMS.CLEAR) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      localStorage.removeItem('canvasData');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current = [imageData];
      historyPointer.current = 0;
    }

    if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    ) {
      if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO)
        historyPointer.current -= 1;
      if (
        historyPointer.current < drawHistory.current.length - 1 &&
        actionMenuItem === MENU_ITEMS.REDO
      )
        historyPointer.current += 1;
      const imageData = drawHistory.current[historyPointer.current];
      context.putImageData(imageData, 0, 0);
    }
    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const changeConfig = (color: string, size: number) => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };

    // const handleChangeConfig = (config: {
    //     color: string,
    //     size: number
    // }) => {
    //     changeConfig(config.color, config.size)
    // }

    changeConfig(color, size);
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load saved canvas data if it exists
    const savedCanvasData = localStorage.getItem('canvasData');
    if (savedCanvasData) {
      const img = new Image();
      img.src = savedCanvasData;
      img.onload = () => {
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        drawHistory.current = [imageData];
        historyPointer.current = 0;
      };
    } else {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current = [imageData];
      historyPointer.current = 0;
    }

    const beginPath = (x: number, y: number) => {
      context?.beginPath();
      context?.moveTo(x, y);
    };

    const drawLine = (x: number, y: number) => {
      context?.lineTo(x, y);
      context?.stroke();
    };
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      shouldDraw.current = true;
      const { x, y } =
        "touches" in e
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
          : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
      beginPath(x, y);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!shouldDraw.current) return;
      const { x, y } =
        "touches" in e
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
          : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
      drawLine(x, y);
    };

    const handleMouseUp = () => {
      shouldDraw.current = false;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
      
      localStorage.setItem('canvasData', canvas.toDataURL());
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchend", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);

      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
