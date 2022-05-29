const axios = require("axios")

const refund = async (TransactionId) => {
  await axios.post(
    "https://api.cloudpayments.ru/payments/refund",
    {
      TransactionId,
      Amount: 11,
    },
    {
      auth: {
        Username: "public_api",
        Password: "secret_api",
      },
    }
  )
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
        Username: "public_api",
        Password: "secret_api",
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
        Username: "public_api",
        Password: "secret_api",
      },
    }
  )
}

module.exports = { refund, topup, create }
