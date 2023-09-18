import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2'
import usersModel from "../dao/dbManagers/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import * as dotenv from 'dotenv'
import crypto from 'node:crypto'
import Config from '../config.js'

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  /* primera estrategia de autenticacion con passport para el signup */
  passport.use(
    "signup",
    new LocalStrategy(
      {
        //permite que s epueda acceder al req como un callback de cualquier middelware
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, email, password, done) => {
        try {
          const { name, lastname, age, role } = req.body;
          const user = await usersModel.findOne({ email: email });
          if (user) {
            return done(null, false, { message: "Usuario ya existe" });
          }
          const newUser = {
            name,
            lastname,
            age,
            email,
            password: createHash(password),
            cart: "",
            role
          };
          const result = await usersModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /* segunda estrategia de autenticacion  con passport para el login */
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
            //chequea si el usuario es admin
          if (
            email === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const user = {
                _id: "coderAdminId",
                name: "Admin",
                lastname: "Coder",
                age: 22,
                email: "adminCoder@coder.com",
                password: "adminCod3r123"
            }
            return done(null, user)
          } else {
            const user = await usersModel.findOne({ email: email });
            console.log(user)
            if (!user) {
              return done(null, false, { message: "Tu usuario no existe" });
            } else {
              if (!isValidPassword(user.password, password)) {
                return done(null, false, { message: "Contraseña incorrecta" });
              } else {
                return done(null, user);
              }
            }
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );


  /* tercera estrategia de autenticacion. Por terceros para github con githubstrategy */
  passport.use('github', new GitHubStrategy(
    {
        clientID: Config.GITHUB_CLIENT_ID,
        clientSecret: Config.GITHUB_CLIENT_SECRET, 
        callbackURL: Config.GITHUB_CALLBACK_URL
    },
    async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await usersModel.findOne({email: profile?.emails[0]?.value})

            if(!user) {
                const newUser = {
                    name: profile.displayName.split(" ")[0],
                    lastname: profile.displayName.split(" ")[1],
                    age: 22,
                    email: profile?.emails[0]?.value,
                    password: crypto.randomUUID()
                }
                const result = await usersModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        }
        catch (error) {
            done(error, null)
        }
    }
  ))

  // LA SERIALIZACION Y LA DESERIALIZACION SE DEBEN HACER SIEMPRE, SINO NOS TIRA ERROR.
  /* serializo el user */
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  /* desserializo el user. */
  passport.deserializeUser(async (id, done) => {
    //chequea si el id es del admin sino busca en la BBDD
    if (id === "coderAdminId") {
      const adminUser = {
        _id: "adminUserId",
        name: "Admin",
        lastname: "Coder",
        age: 22,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };
      done(null, adminUser);
    } else {
        const user = await usersModel.findById(id);
        done(null, user);
    }
  });
};

export { initializePassport };
