var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

let userAgents = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Slurp",
  "Baiduspider",
  "DuckDuckBot",
  "APIs-Google",
  "Mediapartners-Google",
  "AdsBot-Google-Mobile",
  "AdsBot-Google",
  "Googlebot-News",
  "Googlebot-Video",
  "Mediapartners-Google",
  "AdsBot-Google-Mobile-Apps",
  "FeedFetcher-Google",
  "Google-Read-Aloud",
  "DuplexWeb-Google",
  "Google Favicon",
  "googleweblight",
  "Storebot-Google",
  "MetaInspector"
];

let pageRoutes=["/","/pricing","/contactus","/blog", "blog/The-benefits-of-customer-journey-mapping-explained-in-detail"];

let checkUserAgent=(reqUserAgent)=>{
  let flag=false
  userAgents.forEach((agents,index) => {
      if(reqUserAgent.toLowerCase().includes(agents.toLowerCase())){
        console.log("Matched agent",agents)
        flag=true;
        return false;
      }
  });
  return flag;
}

//Route to access all static files like js and css files which are stored under build/static folder
app.use("/static", express.static(path.join(__dirname, "build/static")));

app.get("/*", function (req, res) {
  console.log("User Agent", req.get("User-Agent"));
  console.log("url", req.url);
  let agentFlag=checkUserAgent(req.get("User-Agent"));
  console.log("Agent Flag",agentFlag)
  if (agentFlag) {
    console.log("Agent of seo")
    if (pageRoutes.includes(req.url)) {
      console.log("Here", path.join(__dirname, "seopages"+req.url, "index.html"));
      res.sendFile(path.join(__dirname, "seopages"+req.url, "index.html"));
    } else {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    }
  } else {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  }
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
  res.render("error");
});

module.exports = app;
