const express = require("express")
require("dotenv").config()
const payRouter = require("./routes/pay")
const checkPay = require("./routes/checkPay")
const bot = require("./bot/index")
const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/pay", payRouter)
app.use("/webhooks/cloudpayments/pay", checkPay)

const start = () => {
  try {
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

bot.botStart()
start()
