import express from "express";
import * as dotenv from "dotenv";
import __dirname from "./utils.js";
/* handlebars */
import handlebars from "express-handlebars";
import exphbs from "express-handlebars";
/* importo rutas */
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import realTimeProductsRouter from "./routes/realTimeProducts.routes.js";
import messagesRouter from "./routes/messages.routes.js";
import SessionRouter from "./routes/session.routes.js";
//socket io
import { Server } from "socket.io"; //importo socket server

//managers en MongoDB.
import  ProductManager  from "./dao/dbManagers/productManager.js";
import { addMessages, getMessages } from "./dao/dbManagers/messageManager.js";

/* importo mongoose */
import mongoose from "mongoose";
/* importo mongo connect para trabajar sesiones en mongo */
import MongoStore from "connect-mongo";
/* importo sessions */
import session from "express-session";
/* import cookie parser */
import cookieParser from "cookie-parser";
/* importo passport y la funcion creada en passport config. */
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

import Config from './config.js'


const app = express();

/* conexion a la BBDD de MongoDB */
let dbConnect = mongoose.connect(Config.MONGO_URI);
dbConnect.then(() => {
  console.log("conexion a la base de datos exitosa");
}),
  (error) => {
    console.log("Error en la conexion a la base de datos", error);
  };

/* declaro la cookie */
app.use(cookieParser("C0d3rS3cr3t"));

/* sesiones en mongoDB */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: Config.MONGO_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 3000,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
  })
);

/* inicializo passport y el middleware. */
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

/* Routes */
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/messages", messagesRouter);
app.use("/api/session", SessionRouter);

//comenzamos a trabajar con sockets.
const httpServer = app.listen(Config.PORT, () => {
  console.log(`Escuchando al puerto ${Config.PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente se ha conectado");

  //socket on escucha
  socket.on("message", (data) => {
    console.log(data);
  });

  //socket emit envia
  socket.emit("render", "Me estoy comunicando desde el servidor");

  socket.on("addProduct", (product) => {
    ProductManager.addProduct(product); // fn que agrega el producto creado en el form a la BBDD
  });

  socket.on("delete-product", (productId) => {
    const { id } = productId;
    deleteProduct(id); // fn que deletea el producto de la BBDD
  });

  socket.on("user-message", (obj) => {
    addMessages(obj);
    socketServer.emit("new-message", obj); //enviar el mensaje a todos los usuarios conectados
  });
});
