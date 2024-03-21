const express = require("express")
const mongoose = require('mongoose');

const app = express()

const PORT = process.env.PORT || 3000

mongoose.connect(
	/*@mongo -> mongo is just like a domain name for the ip of the service (thats set by the use of express_default network that docker-composer sets up)*/
	'mongodb://root:root@mongo:27017/?authSource=admin'
).then(()=>{
	console.log("Connected to MongoDB")
}).catch((err)=>{
	console.log("Error: ", err)
});

app.get("/", (req, res)=>{
	res.send("<h1>Hello World!!!</h1>")
})

app.listen(PORT, ()=>{
	console.log(`http://localhost:${PORT}`)
})
