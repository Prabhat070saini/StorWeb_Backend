const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const database = require('./config/database');
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const UserRouter = require('./routes/User');
const HostelRouter = require('./routes/Hostel');
database.connect();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v/auth", UserRouter);
app.use("/api/v/Hostel", HostelRouter);
app.get("/", (req, res) => {

    return res.json({
        success: true,
        message: "Success running...Prabhatsaini"
    })
});


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});