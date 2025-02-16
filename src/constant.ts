const COLORS = {
  BLACK: "black",
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
  ORANGE: "orange",
  YELLOW: "yellow",
  WHITE: "white",
};

const MENU_ITEMS = {
  PENCIL: "PENCIL",
  ERASER: "ERASER",
  UNDO: "UNDO",
  REDO: "REDO",
  DOWNLOAD: "DOWNLOAD",
};

interface MenuItem {
  name: string;
  icon: string;
  isAction?: boolean;
}


const MENU_LIST: MenuItem[] = [
  {
    name: MENU_ITEMS.PENCIL,
    icon: "https://www.svgrepo.com/show/514192/pencil.svg",
  },
  {
    name: MENU_ITEMS.ERASER,
    icon: "https://www.svgrepo.com/show/495275/eraser-1.svg",
  },
  {
    name: MENU_ITEMS.UNDO,
    icon: "https://www.svgrepo.com/show/522684/undo.svg",
    isAction: true,
  },
  {
    name: MENU_ITEMS.REDO,
    icon: "https://www.svgrepo.com/show/522639/redo.svg",
    isAction: true,
  },
  {
    name: MENU_ITEMS.DOWNLOAD,
    icon: "https://www.svgrepo.com/show/511882/download-1453.svg",
    isAction: true,
  },
];

export { COLORS, MENU_ITEMS, MENU_LIST };
