const axios = require("axios")

const Username = "pk_83072be8557ec984878ef058f4f8c"
const Password = "86523da2b71393dd6b4faee0b541ed31"

const refund = async (TransactionId) => {
  await axios.post(
    "https://api.cloudpayments.ru/payments/refund",
    {
      TransactionId,
      Amount: 11,
    },
    {
      auth: {
        Username,
        Password,
      },
    }
  )
}

const findSub = async (AccountId) => {
  try {
    const res = await axios.post(
      "https://api.cloudpayments.ru/subscriptions/find",
      {
        AccountId,
      },
      {
        auth: {
          Username,
          Password,
        },
      }
    )
    return res.data
  } catch (e) {
    console.log(e)
  }
}

const topup = async (Token, Amount, AccountId) => {
  await axios.post(
    "https://api.cloudpayments.ru/payments/token/topup ",
    {
      Token,
      Amount,
      AccountId,
      Currency: "RUB",
    },
    {
      auth: {
        Username,
        Password,
      },
    }
  )
}

const create = async (Token, AccountId, Email, Amount) => {
  const date = new Date(Date.now())
  await axios.post(
    "https://api.cloudpayments.ru/payments/token/topup ",
    {
      Token,
      AccountId,
      Description: "Оформление одноразовой подписки на месяц",
      Email,
      Amount: Amount + 99,
      Currency: "RUB",
      RequireConfirmation: false,
      StartDate: Date(date.setDate(date.getDate() + 3)),
      Interval: "Month",
      Period: 1,
      MaxPeriods: 1,
    },
    {
      auth: {
        Username,
        Password,
      },
    }
  )
}

module.exports = { refund, topup, create, findSub }
