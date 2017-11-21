var express = require("express"); //get the express server
var app = express(); //express init server, server is running and grab all functions
//app has all functions
app.get("/judge/:id", function(req, res) {
    console.log(req.params.id);
    res.send("Hi");
});

app.post("/judge/:id/:name/:email", function(req, res) {
    console.log(req.params.id);
    
});

app.listen(3000);