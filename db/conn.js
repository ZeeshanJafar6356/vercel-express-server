const mongoose = require("mongoose");
const { DATABASE_URL } = require("../config");

mongoose
    .connect(DATABASE_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("database connected"))
    .catch((err) => console.log("errr", err));
