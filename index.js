const express = require("express")
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config");

const app = express()

const PORT = process.env.PORT || 3000

const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
	mongoose.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}).then(() => {
		console.log("Connected to MongoDB")
	}).catch((e) => {
		console.log(e)
		setTimeout(connectWithRetry, 5000)
	})
}

// ensure mongo is up before connecting
connectWithRetry()

// mongoose.connect(
// 	/*@mongo -> mongo is just like a domain name for the ip of the service (thats set by the use of express_default network that docker-composer sets up)*/
// 	MONGO_URL,
// 	{
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true
// 	}
// ).then(() => {
// 	console.log("Connected to MongoDB")
// }).catch((err) => {
// 	console.log("Error: ", err)
// });

app.get("/", (req, res) => {
	res.send("<h1>Hello World!!!</h1>")
})

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`)
})
