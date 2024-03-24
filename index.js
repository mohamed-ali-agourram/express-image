const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors")
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

    app.enable("trust proxy");
    app.use(cors({}))

    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 3000000
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

    app.get("/api/v1", (req, res) => {
        res.send("<h1>Hello World!!!<br>TESTING WORKFLOW<br>TESTING THE containrrr/watchtower</h1>");
        console.log("Yeah! It's working!");
    });

    app.use("/api/v1/posts", postRouter);
    app.use("/api/v1/users", userRouter);

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to Redis", err);
});
