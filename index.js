const express = require("express")
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

const postRouter = require("./routes/postRoute")
const userRouter = require("./routes/userRoute")

const app = express()

app.use(express.json());

const PORT = process.env.PORT || 3000

const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`


const connectWithRetry = () => {
	mongoose.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log("Connected to MongoDB")
	}).catch((e) => {
		console.log(e)
		setTimeout(connectWithRetry, 5000)
	})
}
connectWithRetry()

app.get("/", (req, res) => {
	res.send("<h1>Hello World!!!</h1>")
})

app.use("/api/posts", postRouter)
app.use("/api/auth", userRouter)

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})
