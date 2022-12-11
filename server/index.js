const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000
const cors = require("cors");
const authRoute = require('./routes/auth/index');
const authUser = require('./routes/user/index');
const userRouter =  require('./routes/user/search')


const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());

app.get("/", (req, res) => {
    res.send("App running");
});

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})



mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
)
    .then(() => console.log('db connected'))
    .catch((err) => console.log(err))

app.use('/api', userRouter);
app.use("/api/auth", authRoute);
app.use("/api/user", authUser);

