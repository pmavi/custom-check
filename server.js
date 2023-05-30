"use strict";

require("dotenv").config({
    path: __dirname + "/.env",
});

const https = require("https");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const cookie = require("cookie");
const express = require("express");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const connect = require('connect')
const vhost = require("vhost");

let app = express();
app.use(cors());

// Set Global
global.appRoot = __dirname;
global.server_url = process.env.APP_URL;

// cookieParser middleware
app.use(cookieParser());
app.locals.moment = require('moment');

app.use(
    expressSession({
        secret: "P5&A%R3s1Z3Ea!dN@n!T3R7A",
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
        },
        resave: true,
        saveUninitialized: false,
    })
);



app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
 // Middleware
 app.use((req, res, next) => {
    if (req.originalUrl === '/hooks') {
      next()
    } else {
      express.json()(req, res, next)
    }
  })
// Parsers for POST data
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

//set public folder path
app.use(express.static(__dirname + "/public"));
app.set(express.static(path.join(__dirname, "public/upload")));

// Check Server Cookies For Auth User
app.get("/*", (req, res, next) => {
    let server_cookie = req.cookies;
    let server_session = req?.session;

    if (!server_session?.token && server_cookie?.auth_user) {
        let user = server_cookie?.auth_user;
        // Create token
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_TOKEN);

        // Set User Session
        req.session.user = user;
        req.session.token = token;

        req.session.store_id = server_cookie?.store_id;
    }
    next();
});

app.use(require("./src/Services"));

// set the view engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.set(express.static(path.join(__dirname, "public/upload")));

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
    return res.redirect("/");
    // res.render("404");
});


let http_options = {};
if (process.env.Site_Environmental === "production") {
    http_options = {
        ...http_options,
        key: fs.readFileSync("/var/www/html/ssl/privkey.pem", "utf8"),
        cert: fs.readFileSync("/var/www/html/ssl/fullchain.pem", "utf8"),
    };
}

/*** Get port from environment and store in Express. ***/
const http_port = process.env.http_port || "8000";
const httpServer = require("http").Server(app);

httpServer.listen(http_port, function () {
    console.log(`httpServer App started on port ${http_port}`);
});

app = connect()

  app.use(vhost('*.*.checkout-master.com', function handle (req, res ,next) {
    console.dir(req.vhost.host) 
    console.dir(req.vhost.hostname) 
    console.dir(req.vhost.length) 
 
  }))

/*** Create an HTTPS service identical to the HTTP service. ***/
const https_port = process.env.https_port || "8001";
var httpsServer = https.createServer(http_options, app);

httpsServer.listen(https_port, () => {
    console.log(`httpsServer App started on port ${https_port}`);
});
