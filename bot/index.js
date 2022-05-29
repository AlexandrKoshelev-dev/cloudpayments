const TelegramBot = require("node-telegram-bot-api")
require("dotenv").config()
const validator = require("email-validator")
const db = require("../services/db.services")

const TOKEN = process.env.TOKEN
const BASE_URL = process.env.BASE_URL

const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 100,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
})

const botStart = () => {
  bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      "Отправьте мне свою почту для регистрации"
    )
    bot.on("message", async function getEmail(msg) {
      if (validator.validate(msg.text)) {
        await bot.sendMessage(msg.chat.id, "Валидная почта")
        bot.removeListener("message", getEmail)
        await db.createUser(msg.from.id, msg.text)
        bot.sendMessage(msg.chat.id, "Выберите сумму зачисления:", {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `500 рублей`,
                  callback_data: "500",
                },
              ],
              [
                {
                  text: `1000 рублей`,
                  callback_data: "1000",
                },
              ],
              [
                {
                  text: `1500 рублей`,
                  callback_data: "1500",
                },
              ],
            ],
          },
        })
      } else {
        await bot.sendMessage(msg.chat.id, "Такой почты не существует!")
        await bot.sendMessage(
          msg.chat.id,
          "Отправьте мне свою почту для регистрации"
        )
      }
    })
  })

  bot.on("callback_query", async (query) => {
    await db.addAmount(query.message.chat.id, +query.data)
    bot.sendMessage(
      query.message.chat.id,
      "Перейди по ссылке для заполнения формы",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Получить ${query.data} рублей`,
                url: `${BASE_URL}`,
              },
            ],
          ],
        },
      }
    )
  })
}

module.exports = { botStart }
