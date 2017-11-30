//express code start
var express = require("express"); //get the express server
var app = express(); //express init server, server is running and grab all functions
var path = require("path");
var router = express.Router();
//express code end

//firebase database code start
var firebase = require('firebase-admin');
var serviceAccount = require("./judgingbreaking-firebase-adminsdk-egkcj-843b81f899.json")

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://judgingbreaking.firebaseio.com"
});

var judgesRef = firebase.database().ref("Judges");
var eventRef = firebase.database().ref("Events");

//firebase database code end
app.set('views','./views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//start of the pages
//main page
app.get("/", function(req, res){
    res.render('mainPage.ejs');
})

//listJudges
app.get("/judges", function(req, res){
    var arr = [];
    console.log("getting all the judges");
    //get all names of judges
    var val;
  
    judgesRef.once('value', function(snapshot) {
            
        snapshot.forEach(function(data) {
            
            val = {
                name : data.val().name,
                experience : data.val().experience,
                style : data.val().style,
                styleVotes : data.val().styleVotes,
                powerVotes : data.val().powerVotes,
                abstractVotes : data.val().abstractVotes, 
                foundationVotes : data.val().foundationVotes, 
            }
            arr.push(val.name);
        });
        console.log(arr.length);
        res.render('lists.ejs', {
            whichList : "Judges",
            arr : arr
        })
        
    })
   
    //sort them alphabetically at first
    //pass array to ejs

})
//listEvents
app.get("/events", function(req, res){
    var arr = [];
    console.log("getting all the events");
    //get all names of judges
    var val;
  
    eventRef.once('value', function(snapshot) {
            
        snapshot.forEach(function(data) {
            
            val = {
                name: data.val().name,
                judges: data.val().judges,
                location: data.val().location,
                style: data.val().style,
                format: data.val().format,
                MC: data.val().MC,
                DJ: data.val().DJ,
                prize: data.val().prize,
                attendence: data.val().attendence
            }
            arr.push(val.name);
        });
        console.log(arr.length);
        res.render('lists.ejs', {
            whichList : "Events",
            arr : arr
        })
        
    })
   
    //sort them alphabetically at first
    //pass array to ejs

})
//add Event
app.get("/newEvent/:name", function(req, res) {

    //upload to the database
    var eventPath = eventRef.child(req.params.name);
    
    eventPath.update({
        name: req.params.name, 
        judges: ["TBA", "TBA", "TBA"],
        location: "West Lafyatte",
        style: "Breaking",
        format: "2v2",
        MC: "ME",
        DJ: "ME",
        prize: 300,
        attendence: ["none at the moment"]
    }, function(error) {
        if (error) {
          res.render('addEvents.ejs', {
            eventName : req.params.name,
            status: "Failed"});
        } else {
          
          res.render('addEvents.ejs', {
            eventName : req.params.name,
            status: "Success"});
        }
    });

});

//lookup event
app.get("/eventPage/:name", function(req, res){
    
    var ref = firebase.database().ref().child("Events/" + req.params.name);
    ref.once('value', (snapshot) => {
        if(!snapshot || !snapshot.val()) {
            res.render('events.ejs', {
                eventName: "ERROR",
                judges: [],
                location: "ERROR",
                style: "ERROR",
                battleFormat: "ERROR",
                MC: "ERROR",
                DJ: "ERROR",
                prize: 0,
                attendence: ["dammit1","dammit2", "dammit3"]
            })
        } else {
            console.log("page found");
            res.render('events.ejs', {
                
                eventName: snapshot.val().name,
                judges: snapshot.val().judges,
                location: snapshot.val().location,
                style: snapshot.val().style,
                battleFormat: snapshot.val().format,
                MC: snapshot.val().MC,
                DJ: snapshot.val().DJ,
                prize: 100,
                attendence: ["dammit1","dammit2", "dammit3"]
            })
        }
    });
    //not found upload error page
    
});
//
//EVENT FUNCTIONS FINISH
//lookup judge
app.get("/judgePage/:name", function(req, res){
    var judgePage = require("./judgePage");
    console.log("looking up judge" + req.params.name)
    
    var ref = firebase.database().ref().child("Judges/" + req.params.name);
    ref.once('value', (snapshot) => {
        if(!snapshot || !snapshot.val()) {
            res.render('judge.ejs', {
                judgeName : "ERROR",
                experience : 0,
                style: 0,
                stats : 0  /*do this fucking later*/
            })
        } else {
            res.render('judge.ejs', {
                judgeName : snapshot.val().name,
                experience : snapshot.val().experience,
                style: snapshot.val().style,
                stats : 0  /*do this fucking later*/
            })
        }
    });
    //not found upload error page
    
});

//add judge
app.get("/judgePage/newJudge/:name", function(req, res) {
    var judgePage = require("./judgePage");
    
    //upload to the database
    var judgeChildPath = judgesRef.child(req.params.name);
    
    judgeChildPath.update({
        "name" : req.params.name,
        "experience" : 0,
        "style" : "breaking",
        "styleVotes": 0,
        "powerVotes": 0,
        "abstractVotes": 0,
        "foundationVotes": 0,
    }, function(error) {
        if (error) {
          res.render('addJudge.ejs', {
            judgeName : req.params.name,
            status: "Failed"});
        } else {
          
          res.render('addJudge.ejs', {
            judgeName : req.params.name,
            status: "Success"});
        }
    });

});


//module.exports = router;
var port = process.env.PORT || 3000;
app.listen(port);
