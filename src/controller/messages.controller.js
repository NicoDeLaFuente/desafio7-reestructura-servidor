import { addMessages, getMessages } from "../dao/dbManagers/messageManager.js";

export const addingMessages = async (req, res) => {};

export const gettingMessages = async (req, res) => {
  try {
    const messages = await getMessages();
    console.log(messages);
    res.render("chat", { messages: messages });
  } catch (err) {
    res
      .status(500)
      .json({ message: "No se pudo conectar con la BBDD", error: err });
  }
};
