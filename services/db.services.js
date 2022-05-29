const { User } = require("../db")

const createUser = async (userId, email) => {
  await User.create({ userId, email })
}

const getOne = async (email) => {
  return await User.findOne({ where: { email } })
}

const addAmount = async (userId, amount) => {
  await User.update({ amount }, { where: { userId } })
}
module.exports = { createUser, getOne, addAmount }
