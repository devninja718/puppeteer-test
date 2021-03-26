const cron = require('./cron');
var express = require("express");
var cors = require("cors");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
const fs = require('fs');
var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(cors());

app.get('/airbnb', (req, res) => {
    try {
        const json = JSON.parse(fs.readFileSync('./data.json'));
        res.json(json);
    } catch (error) {
        res.json({
            status: false,
            error: error.message
        })
    }
})

app.get('/booking', (req, res) => {
    try {
        const json = JSON.parse(fs.readFileSync('./data-book.json'));
        res.json(json);
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        })
    }
})



app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send("error");
});

cron.init();

module.exports = app
