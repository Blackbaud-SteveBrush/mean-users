var dotenv,
    fs;

fs = require('fs');
dotenv = require('dotenv');

try {
    if (fs.statSync('config.env').isFile()) {
        dotenv.config({
            path: 'config.env'
        });
    }
} catch (e) {
    console.log("Configuration file not found.");
}

module.exports = process.env;
