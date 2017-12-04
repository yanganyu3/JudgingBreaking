//express code start
var express = require("express"); //get the express server
var app = express(); //express init server, server is running and grab all functions
var path = require("path");
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});
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
var usersRef = firebase.database().ref("Users");
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
app.get("/newEvent", function(req, res) {

    res.render("addEvents.ejs");    
});

app.post("/newEvent", urlencodedParser, function(req, res){

    
    var judgeArray = req.body.judges.split(',')
    var eventName = req.body.name;
    if(eventName.includes(" ") >=0) {
       eventName =  eventName.replace(/ /g,"_");
        
    }
    var eventPath = eventRef.child(eventName);
    console.log(eventName);
    eventPath.update({
        name: eventName, 
        judges: judgeArray,
        location: req.body.location,
        style: req.body.style,
        format: req.body.format,
        MC: req.body.MC,
        DJ: req.body.DJ,
        prize: req.body.prize,
        attendence: ["none at the moment"]
    }, function(error) {
        if (error) {
            res.render('successfulAdd.ejs', {
              name : req.body.name,
              typeOfNew: "Event",
              status: "Failed"});
          } else {
            
            res.render('successfulAdd.ejs', {
              name : req.body.name,
              typeOfNew: "Event",
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
            var eventName = snapshot.val().name;
            if(eventName.includes(' ') >= 0 ){
                eventName.replace(/ /g, '_');
            }
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
app.get("/newJudge", function(req, res) {
    
    //upload to the database
    res.render('addJudge.ejs');
    

});

app.post("/newJudge",urlencodedParser, function(req ,res){
    //include lookup for judge already existing in the database
    var judgeChildPath = judgesRef.child(req.body.name);
    
    judgeChildPath.update({
        "name" : req.body.name,
        "experience" : req.body.experience,
        "style" : req.body.style,
        "styleVotes": 0,
        "powerVotes": 0,
        "abstractVotes": 0,
        "foundationVotes": 0,
    }, function(error) {
        if (error) {
          res.render('successfulAdd.ejs', {
            name : req.body.name,
            typeOfNew: "Judge",
            status: "Failed"});
        } else {
          
          res.render('successfulAdd.ejs', {
            name : req.body.name,
            typeOfNew: "Judge",
            status: "Success"});
        }
    });
})
//end judge info
//start User code
//list users
app.get("/users", function(req, res){
    var arr = [];
    console.log("getting all the events");
    //get all names of judges
    var val;
  
    usersRef.once('value', function(snapshot) {
            
        snapshot.forEach(function(data) {
            
            val = {
                name : data.val().name,
                crew : data.val().crew,
                style: data.val().style,
                country: data.val().country,
                events: data.val().events,
                nextEvent: data.val().nextEvent,
                styleRanking: data.val().styleRanking,
                powerRanking: data.val().powerRanking,
                abstractRanking: data.val().abstractRanking,
                judge: data.val().judge
            }
            arr.push(val.name);
        });
        console.log(arr.length);
        res.render('lists.ejs', {
            whichList : "Users",
            arr : arr
        })
        
    })
   
    //sort them alphabetically at first
    //pass array to ejs

})
//lookup User
app.get("/userPage/:name", function(req, res){
    
    var ref = firebase.database().ref().child("Users/" + req.params.name);
    ref.once('value', (snapshot) => {
        if(!snapshot || !snapshot.val()) {
            res.render('user.ejs', {
                name : "ERROR, USER NOT FOUND",
                crew : "",
                style: "",
                country: "",
                events: "NA",
                nextEvent: "",
                styleRanking: 0,
                powerRanking: 0,
                abstractRanking: 0,
                judge: false
            })
        } else {
            res.render('user.ejs', {
                name : snapshot.val().name,
                crew : snapshot.val().crew,
                style: snapshot.val().style,
                events: snapshot.val().events,
                country: snapshot.val().country,
                nextEvent: snapshot.val().nextEvent,
                styleRanking: snapshot.val().styleRanking,
                powerRanking: snapshot.val().powerRanking,
                abstractRanking: snapshot.val().abstractRanking,
                judge: snapshot.val().judge
                
            })
        }
    });
    //not found upload error page
    
});

//add user
app.get("/newUser", function(req, res) {
    
    //upload to the database
    res.render('addUser.ejs');
    

});

app.post("/newUser",urlencodedParser, function(req ,res){
    //include lookup for user already existing in the database
    var userChildPath = usersRef.child(req.body.name);
    
    userChildPath.update({
        "name" : req.body.name,
        "crew" : req.body.crew,
        "style" : req.body.style,
        "events": "None",
        "country": req.body.country,
        "judge": false,
        "styleRanking": req.body.styleRanking,
        "powerRanking": req.body.powerRanking,
        "abstractRanking" : req.body.abstractRanking
    }, function(error) {
        if (error) {
          res.render('successfulAdd.ejs', {
            name : req.body.name,
            typeOfNew: "User",
            status: "Failed"});
        } else {
          
          res.render('successfulAdd.ejs', {
            name : req.body.name,
            typeOfNew: "User",
            status: "Success"});
        }
    });
})
//end user code
module.exports = router;
var port = process.env.PORT || 3000;
app.listen(port);
