const TelegramBot = require("node-telegram-bot-api")
require("dotenv").config()
const validator = require("email-validator")
const db = require("../services/db.services")
const messages = require("./messages")
const { User } = require("../db")
const { findSub } = require("../controllers/controllers")

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

const startMessage = async (msg) => {
  await bot.sendMessage(msg.chat.id, messages.startMes, {
    reply_markup: {
      keyboard: [["Получить деньги💰"], ["Погасить долг"], ["Техподдержка⚙️"]],
      resize_keyboard: true,
    },
  })
}

const getMoney = async (msg) => {
  bot.sendMessage(msg.chat.id, "💸Выберите сумму зачисления:", {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `💰500 рублей`,
            callback_data: "500",
          },
        ],
        [
          {
            text: `💰1000 рублей`,
            callback_data: "1000",
          },
        ],
        [
          {
            text: `💰1500 рублей`,
            callback_data: "1500",
          },
        ],
      ],
    },
  })
}

const registration = async (msg) => {
  await bot.sendMessage(msg.chat.id, "Отправьте мне свою почту для регистрации")
  bot.on("message", async function getEmail(msg) {
    if (validator.validate(msg.text)) {
      bot.removeListener("message", getEmail)
      await db.createUser(msg.from.id, msg.text)
      getMoney(msg)
    } else {
      await bot.sendMessage(msg.chat.id, "Такой почты не существует!❌")
      await bot.sendMessage(
        msg.chat.id,
        "Отправьте мне свою почту для регистрации"
      )
    }
  })
}

const botStart = () => {
  bot.onText(/\/start/, async (msg) => {
    startMessage(msg)
  })

  bot.on("callback_query", async (query) => {
    await db.addAmount(query.message.chat.id, +query.data)
    bot.sendMessage(
      query.message.chat.id,
      "💳Перейди по ссылке для заполнения формы",
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `💸Получить ${query.data} рублей`,
                url: `${BASE_URL}`,
              },
            ],
          ],
        },
      }
    )
  })

  bot.on("message", async (msg) => {
    const user = await User.findOne({ where: { userId: msg.chat.id } })
    switch (msg.text) {
      case "Получить деньги💰":
        await bot.sendMessage(msg.chat.id, messages.rule)
        if (!user) {
          await registration(msg)
        } else {
          getMoney(msg)
        }
        break
      case "Техподдержка⚙️":
        await bot.sendMessage(msg.chat.id, messages.support)
        break
      case "Погасить долг":
        if (!user) {
          await registration(msg)
        } else {
          const sub = await findSub(user.accountId)
          if (!sub) {
            await bot.sendMessage(msg.chat.id, "У вас нет долгов✅")
          } else {
            console.log(sub)
          }
        }

        break
      default:
        await bot.sendMessage(msg.chat.id, "Выбери что-то из клавиатуры")
        break
    }
  })
}

module.exports = { botStart }
