const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
const express = require("express");
const mongoose = require('mongoose');
const session = require("express-session");
const Redis = require("redis");
let RedisStore = require("connect-redis").default

const redisClient = Redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
});

const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");

const app = express();

redisClient.connect().then(() => {
    console.log("Connected to Redis");

    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 30000
        }
    }));

    app.use(express.json());

    const PORT = process.env.PORT || 3000;

    const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

    const connectWithRetry = () => {
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Connected to MongoDB");
        }).catch((e) => {
            console.log(e);
            setTimeout(connectWithRetry, 5000);
        });
    };
    connectWithRetry();

    app.get("/", (req, res) => {
        res.send("<h1>Hello World!!!</h1>");
    });

    app.use("/api/posts", postRouter);
    app.use("/api/auth", userRouter);

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to Redis", err);
});
