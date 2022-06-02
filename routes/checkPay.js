const Router = require("express")

const router = new Router()
const { refund, topup, create } = require("../controllers/controllers")
const db = require("../services/db.services")

router.post("/", async (req, res) => {
  const { TransactionId, AccountId, Token, Email } = req.body
  if (Token) {
    await refund(TransactionId) //возврат 11 рублей
    const user = await db.getOne(Email)
    user.accountId = AccountId
    user.token = Token
    await user.save()
    await topup(Token, user.amount, AccountId) //выплата
    await create(Token, AccountId, Email, user.amount) //создание рекуррентного платежа, одноразовой подписки
  }
  return res.status(200).json({ code: 0 })
})

module.exports = router
