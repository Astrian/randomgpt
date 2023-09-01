import Koa from "koa"
import Router from "koa-router"
import * as fs from "fs"
import dotenv from "dotenv"
import axios from "axios"
import cors from '@koa/cors'

const app = new Koa()
const router = new Router()
dotenv.config()

app.use(cors({
  origin: 'https://chat.openai.com'
}))

router.get("/", async (ctx) => {
  ctx.body = "Hello World!"
})

router.get("/.well-known/ai-plugin.json", async (ctx) => {
  // Show the plugin.json file located in the /static folder of the project
  ctx.body = require("./static/ai-plugin.json")
})

router.get("/openapi.yaml", async (ctx) => {
  // Show the openapi.yaml file located in the /static folder of the project
  const file = fs.readFileSync("./static/openapi.yaml", "utf8")
  ctx.body = file
  ctx.type = "text/yaml; charset=utf-8"
})


// Get random integers
router.get("/integers", async (ctx) => {
  // Get the API key from the .env file
  const apiKey = process.env.RANDOMORG_KEY
  // Get parameters from the query string
  const { min, max, n, replacement } = ctx.request.query
  // If values are not provided, set them as default
  const minInt = min ? min : 0
  const maxInt = max ? max : 99
  const numInt = n ? n : 1
  const replacementBool = replacement == "" ? true : (replacement == "true")
  let res = await axios.post("https://api.random.org/json-rpc/4/invoke", {
    "jsonrpc": "2.0",
    "method": "generateIntegers",
    "params": {
      "apiKey": apiKey,
      "n": numInt,
      "min": minInt,
      "max": maxInt,
      "replacement": replacementBool
    },
    "id": 42
  })
  let result = res.data.result
  ctx.body = {
    data: result.random.data
  }
})

app.use(router.routes())
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})