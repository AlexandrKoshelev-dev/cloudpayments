const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize("CP-work", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
})

const User = sequelize.define(
  "User",
  {
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    amount: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  }
)

;(async () => {
  try {
    await User.sync({ force: true })
    console.log("db init")
  } catch (e) {
    console.log(e)
  }
})()

module.exports = { User }
