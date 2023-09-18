import { Router } from "express";
import usersModel from "../dao/dbManagers/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

/* LOGIN con session como metodo de autenticacion */
/* router.post("/login", async (req, res) => {
  try {
    const { email, password, name, lastname } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      console.log("Soy admin");
      req.session.name = name;
      req.session.lastname = lastname;
      req.session.email = email;
      req.session.admin = true;
      req.session.role = "admin";
      res.status(200).json({
        respuesta: "ok",
        redirectUrl: "/products",
      });
    } else {
      const result = await usersModel.findOne({ email: email });

      if (result === null) {
        res.status(401).json({
          respuesta: "error",
          message: "El email no esta registrado. Por favor dirijase al signup",
        });
      }

      //chequea si la contraseña ingresada es igual a la guardad en la BBDD.
      if (!isValidPassword(result.password, password)) {
        res.status(401).json({
          respuesta: "Error",
          message: "La contraseña ingresada es incorrecta",
        });
      } else {
        req.session.name = result.name;
        req.session.lastname = result.lastname;
        req.session.email = email;
        req.session.admin = false;
        req.session.role = "user";
        res.status(200).json({
          respuesta: "ok",
          //la uso para redirigir a /products
          redirectUrl: "/products",
        });
      }
    }
  } catch (err) {
    res.status(401).json({
      error: err,
      message: "Algo salio mal al hacer login",
    });
  }
}); */

/* LOGIN con passport como metodo de autentiacion */
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/failLogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "Error", message: "Error de autenticación" });
    } else {
      if (req.user.email === "adminCoder@coder.com") {
        req.session.name = req.user.name;
        req.session.lastname = req.user.lastname;
        req.session.admin = true;
        req.session.email = req.user.email;
        req.session.password = req.user.password;
        req.session.role = "admin";
        return res.json({
          status: "OK",
          redirectUrl: "/products",
        });
      } else {
        req.session.name = req.user.name;
        req.session.lastname = req.user.lastname;
        req.session.admin = false;
        req.session.email = req.user.email;
        req.session.password = req.user.password;
        req.session.role = "user";
        return res.json({
          status: "OK",
          redirectUrl: "/products",
        });
      }
    }
  }
);

//Ruta si falla el login
router.get("/failLogin", (req, res) => {
  res.send({ error: "Error login" });
});

/* SIGN UP CON SESSION. */
/* router.post("/signup", async (req, res) => {
  try {
    const { name, lastname, age, email, password } = req.body;

    const exist = await usersModel.findOne({ email: email });

    if (exist) {
      return res
        .status(401)
        .json(
          "El email ya se encuentra registrado. Por favor, vaya a sign in y coloque la contraseña"
        );
    }

    const result = await usersModel.create({
      name,
      lastname,
      age,
      email,
      password: createHash(password),
    });

    if (result === null) {
      return res.status(401).json({
        respuesta: "Error al crear usuario.",
      });
    } else { */
/* req.session.user = email;
            req.session.admin = true; */
/* res.status(200).json({
        respuesta: "ok. Usuario creado existosamente.",
      });
    }
  } catch (err) {
    res.json({
      error: err,
      message: "Algo salio mal al hacer signup",
    });
  }
}); */

/* sign up con autenticacion con passport. */
router.post(
  "/signup",
  passport.authenticate("signup", { failureRedirect: "/signupError" }),
  async (req, res) => {
    res.send({ status: "success", message: "User register" });
  }
);

router.get("/signupError", async (req, res) => {
  console.log("Failed strategy");
  res.send({ error: "failed" });
});

/* Ruta para cerrar la session */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      return res.json({
        message: "Sesión cerrada con éxito",
      });
    } else {
      return res.json({
        message: "Error al cerrar sesión",
      });
    }
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.name = req.user.name,
    req.session.lastname = req.user.lastname,
    req.session.admin = false, 
    req.session.email = req.user.email,
    req.session.role = "user"

    res.redirect("/products")
  }
);

router.get("/current", (req, res) => {
  if (!req.isAuthenticated()) {
    // El usuario no está autenticado
    res.status(401).json({ message: "No estás autenticado" });
  } else {
    res.status(200).json(req.user)
  }
})


export default router;
