import { mainMenu } from "./index.js";
import { Stock } from "./BaseDeDatos/Stock.js"

const stock = Stock.getInstance();

async function init() {
    mainMenu(stock);
}


init();
