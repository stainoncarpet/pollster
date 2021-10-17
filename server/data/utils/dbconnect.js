const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose.set('useFindAndModify', false);

const dbconnect = async () => {
    try {
        require("../models/pollModel.js");
        require("../models/userModel.js");
        await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log(chalk.green(">>>> Connected to DB"));
    } catch (error) {
        console.log(chalk.red(">>>> Connection failed", error.message));
    }
}

module.exports = dbconnect;