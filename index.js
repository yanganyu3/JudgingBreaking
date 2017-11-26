var express = require("express"); //get the express server
var app = express(); //express init server, server is running and grab all functions
var path = require("path");
var router = express.Router();
//app has all functions
app.set('views','./views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get("/judgePage/:name", function(req, res){
    var judgePage = require("./judgePage");
    console.log(" hello" + judgePage.name);
    res.render('judge.ejs', {
        judgeName : req.params.name,
        experience : 0,
        style: "breaking",
        stats : 0    });
});
app.get("/judge/:id", function(req, res) {
    console.log(req.params.id);
    res.send("Hi");
});

app.post("/judge/:id/:name/:email", function(req, res) {
    console.log(req.params.id);    
});
module.exports = router;
app.listen(3000);
