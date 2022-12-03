const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 4000
const dotenv = require('dotenv');
const cors = require("cors");
const authRoute = require('./routes/auth/index');
const authDashboard = require('./routes/auth/authDashboard')


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
    res.send("maa ki choot");
});

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
)
    .then(() => console.log('db connected'))
    .catch((err) => console.log(err))

app.use("/api/users", authRoute);
app.use("/api/dashboard", authDashboard);

