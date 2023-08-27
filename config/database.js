const mongoose = require('mongoose');
// require('dotenv').config();


exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: "true",
        useUnifiedTopology: "true"

    }).then(() => console.log("Connect to Database"))
        .catch((error) => {
            console.log("Db connection error");
            console.error(error.message);
            process.exit(1);
        });
}