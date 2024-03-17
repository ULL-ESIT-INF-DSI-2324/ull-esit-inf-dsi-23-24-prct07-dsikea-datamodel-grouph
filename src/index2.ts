import { mainMenu } from "./menus.js";
import { Stock } from "./BaseDeDatos/Stock.js"

const stock = Stock.getInstance();

async function init() {
    mainMenu(stock);
}


init();
