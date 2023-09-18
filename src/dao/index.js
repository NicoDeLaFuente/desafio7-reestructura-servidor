import ProductManagerMongo from "./dbManagers/productManager.js";
import ProductManagerMemory  from "./fsManagers/productManager.js";

import CartManagerMongo from "./dbManagers/cartManager.js";
import CartManagerMemory from "./fsManagers/cartManager.js";

import Config from "../config.js";

export const PRODUCTMANAGER = Config.PERSISTENCE === 'MONGO' ? new ProductManagerMongo() : new ProductManagerMemory();
export const CARTMANAGER = Config.PERSISTENCE === 'MONGO' ? new CartManagerMongo() : new CartManagerMemory()