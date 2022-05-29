const Router = require("express")
const router = new Router()
const path = require("path")

router.get("/", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "../", "views", "pay.html"))
})

module.exports = router
