//express code start
var express = require("express"); //get the express server
var app = module.exports = express(); //express init server, server is running and grab all functions
var path = require("path");
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//express code end
//static directory for images
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
app.set('views', './views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));


//start of the pages
//main page
app.get("/", function (req, res) {
    res.render('mainPage.ejs');
})

//listJudges
app.get("/judges", function (req, res) {
    var arr = [];
    console.log("getting all the judges");
    //get all names of judges
    var val;

    judgesRef.once('value', function (snapshot) {

        snapshot.forEach(function (data) {

            val = {
                name: data.val().name,
                experience: data.val().experience,
                style: data.val().style,
                styleVotes: data.val().styleVotes,
                powerVotes: data.val().powerVotes,
                abstractVotes: data.val().abstractVotes,
                foundationVotes: data.val().foundationVotes,
            }
            arr.push(val.name);
        });
        console.log(arr.length);
        res.render('lists.ejs', {
            whichList: "Judges",
            arr: arr
        })

    })

    //sort them alphabetically at first
    //pass array to ejs

})
//listEvents
app.get("/events", function (req, res) {
    var arr = [];
    console.log("getting all the events");
    //get all names of judges
    var val;

    eventRef.once('value', function (snapshot) {

        snapshot.forEach(function (data) {

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
            whichList: "Events",
            arr: arr
        })

    })

    //sort them alphabetically at first
    //pass array to ejs

})
//add Event
app.get("/newEvent", function (req, res) {

    res.render("addEvents.ejs");
});

app.post("/newEvent", urlencodedParser, function (req, res) {


    var judgeArray = req.body.judges.split(/[ ,]+/)
    var eventName = req.body.name;
    if (eventName.includes(" ") >= 0) {
        eventName = eventName.replace(/ /g, "_");

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
        attendence: ["TBA"],
        date: req.body.date
    }, function (error) {
        if (error) {
            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "Event",
                status: "Failed"
            });
        } else {

            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "Event",
                status: "Success"
            });
        }
    });
});

//lookup event
app.get("/eventPage/:name", function (req, res) {

    var ref = firebase.database().ref().child("Events/" + req.params.name);
    ref.once('value', (snapshot) => {
        if (!snapshot || !snapshot.val()) {
            res.render('events.ejs', {
                eventName: "ERROR",
                judges: [],
                location: "ERROR",
                style: "ERROR",
                battleFormat: "ERROR",
                MC: "ERROR",
                DJ: "ERROR",
                prize: 0,
                attendence: ["ERROR"]
            })
        } else {
            console.log("page found");
            var eventName = snapshot.val().name;
            if (eventName.includes(' ') >= 0) {
                eventName.replace(/ /g, '_');
            }
            var attendenceArray = Object.keys(snapshot.val().attendence);
            
            res.render('events.ejs', {

                eventName: snapshot.val().name,
                judges: snapshot.val().judges,
                location: snapshot.val().location,
                style: snapshot.val().style,
                battleFormat: snapshot.val().format,
                MC: snapshot.val().MC,
                DJ: snapshot.val().DJ,
                prize: snapshot.val().prize,
                attendence: attendenceArray,
                date: snapshot.val().date
            })
        }
    });
    //not found upload error page

});
//
//sign up for the event
app.get("/eventPage/:eventName/signUp", function(req, res){
    console.log(req.params.eventName);
    res.render("../views/eventSignUp.ejs", {
        eventName: req.params.eventName
    });
})

app.post("/eventPage/:eventName/signUp",urlencodedParser, function(req, res){
    var eventName = req.params.eventName;
    if (eventName.includes(" ") >= 0) {
        eventName = eventName.replace(/ /g, "_");

    }
    var eventPath = eventRef.child(eventName).child("attendence").child(req.body.name);

    console.log(eventName);
    eventPath.update({
        crew: req.body.crew,
        country: req.body.country
    }, function (error) {
        if (error) {
            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "Event",
                status: "Failed"
            });
        } else {

            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "Event",
                status: "Success"
            });
        }
    });

})

//EVENT FUNCTIONS FINISH
//lookup judge
app.get("/judgePage/:name", function (req, res) {
    var judge = require("./JudgeInfo/Judge");
    console.log("looking up judge" + req.params.name)

    var ref = firebase.database().ref().child("Judges/" + req.params.name);

ref.once('value', (snapshot) => {
    if (!snapshot || !snapshot.val()) {
        res.render('judge.ejs', {
            judgeName: "ERROR, JUDGE NOT REGISTERED/IN DATABASE",
            experience: "N/A",
            style: "N/A",
            paradigms: "N/A",
            judgeInfo: "NULL"
        })
    } else {
        
        res.render('judge.ejs', {

            judgeName: snapshot.val().name,
            experience: snapshot.val().experience,
            style: snapshot.val().style,
            paradigms: snapshot.val().paradigms,
            judgeInfo: snapshot.val()
        })
    }
});
    //not found upload error page

});

//add judge
app.get("/newJudge", function (req, res) {

    //upload to the database
    res.render('addJudge.ejs');


});

app.post("/newJudge", urlencodedParser, function (req, res) {
    //include lookup for judge already existing in the database
    var judgeChildPath = judgesRef.child(req.body.name);
    //change user judge setting to true
    var ref = firebase.database().ref().child("Users/" + req.body.name);
    ref.update({
        "name": req.body.name,
        "style": req.body.style,
        "country": req.body.country,
        "judge": true
    });

    //finish user updating

    judgeChildPath.update({
        "name": req.body.name,
        "experience": req.body.experience,
        "style": req.body.style,
        "styleVotes": 0,
        "powerVotes": 0,
        "abstractVotes": 0,
        "foundationVotes": 0,
        "paradigms": req.body.paradigms
    }, function (error) {
        if (error) {
            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "Judge",
                status: "Failed"
            });
        } else {

            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "Judge",
                status: "Success"
            });
        }
    });
})
//vote judging
//get round
app.get("/judgePage/:name/vote", function (req, res) {

    res.render("../views/votingPage.ejs", {
        dancer1: "Day",
        dancer2: "Ice",
        name: req.params.name
    });
})

app.post("/judgePage/:name/vote", urlencodedParser, function (req, res) {
    console.log("voting done, calculating now!");

    var judge = require("./JudgeInfo/Judge");
    var ref1 = firebase.database().ref().child("Judges/" + req.params.name);

    console.log("Users/" + req.body.winner);
    getJudge(req, res).then(judge1 => {
        getUser(req, res).then(user1 => {
            judge.addStat(judge1, user1);
            console.log(judge1);

            ref1.update({

                "styleVotes": judge1.styleVotes,
                "powerVotes": judge1.powerVotes,
                "abstractVotes": judge1.abstractVotes,
            })
            res.send(200);
        }).catch(err => res.send(400))
    }).catch(err => res.send(400))

})

var getJudge = (req, res) => {
    return new Promise((resolve, reject) => {
        var judge1 = {};
        var ref1 = firebase.database().ref().child("Judges/" + req.params.name);
        console.log("Judges/" + req.params.name);
        ref1.once('value', (snapshot) => {
            if (!snapshot || !snapshot.val()) {
                console.log("there was a fucking error");
                judge1.name = "ERROR",
                    judge1.experience = "ERROR",
                    judge1.style = "ERROR",
                    judge1.styleVotes = 0,
                    judge1.powerVotes = 0,
                    judge1.abstractVotes = 0

            } else {
                judge1.name = snapshot.val().name,
                    judge1.experience = snapshot.val().country,
                    judge1.style = snapshot.val().style,
                    judge1.styleVotes = snapshot.val().styleVotes,
                    judge1.powerVotes = snapshot.val().powerVotes,
                    judge1.abstractVotes = snapshot.val().abstractVotes
                console.log(judge1);

            }
        })
        resolve(judge1);
    })
}

var getUser = (req, res) => {
    return new Promise((resolve, reject) => {
        var user1 = {};
        var ref2 = firebase.database().ref().child("Users/" + req.body.winner);
        ref2.once('value', (snapshot) => {
            console.log("the name of the user is " + snapshot.val().name + "\n\n\n");
            user1.name = snapshot.val().name,
                user1.crew = snapshot.val().crew,
                user1.styles = snapshot.val().styles,
                user1.events = snapshot.val().events,
                user1.country = snapshot.val().country,
                user1.nextEvent = snapshot.val().nextEvent,
                user1.judge = snapshot.val().judge,
                user1.styleRanking = snapshot.val().styleRanking,
                user1.powerRanking = snapshot.val().powerRanking,
                user1.abstractRanking = snapshot.val().abstractRanking
            resolve(user1);
        })
    });
}

//end judge info
//start User code
//list users
app.get("/users", function (req, res) {
    var arr = [];
    console.log("getting all the events");
    //get all names of judges
    var val;

    usersRef.once('value', function (snapshot) {

        snapshot.forEach(function (data) {

            val = {
                name: data.val().name,
                crew: data.val().crew,
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
            whichList: "Users",
            arr: arr
        })

    })

    //sort them alphabetically at first
    //pass array to ejs

})
//lookup User
app.get("/userPage/:name", function (req, res) {
    
    var ref = firebase.database().ref().child("Users/" + req.params.name);
    ref.once('value', (snapshot) => {
        if (!snapshot || !snapshot.val()) {
            res.render('user.ejs', {
                name: "ERROR, USER NOT FOUND",
                crew: "",
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
            var userName = req.params.name;
            if (userName.includes(' ') >= 0) {
                userName.replace(/ /g, '_');
            }
            res.render('user.ejs', {
                name: snapshot.val().name,
                crew: snapshot.val().crew,
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
app.get("/newUser", function (req, res) {

    //upload to the database
    res.render('addUser.ejs');


});

app.post("/newUser", urlencodedParser, function (req, res) {
    
    var userName = req.body.name;
    if (userName.includes(" ") >= 0) {
        userName = userName.replace(/ /g, "_");

    }
    //include lookup for user already existing in the database
    var userChildPath = usersRef.child(req.body.name);

    userChildPath.update({
        "name": userName,
        "crew": req.body.crew,
        "style": req.body.style,
        "events": "None",
        "country": req.body.country,
        "judge": false,
        "styleRanking": req.body.styleRanking,
        "powerRanking": req.body.powerRanking,
        "abstractRanking": req.body.abstractRanking
    }, function (error) {
        if (error) {
            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "User",
                status: "Failed"
            });
        } else {

            res.render('successfulAdd.ejs', {
                name: req.body.name,
                typeOfNew: "User",
                status: "Success"
            });
        }
    });
})
//end user code
module.exports = router;
module.exports = app;
module.exports = urlencodedParser;
var port = process.env.PORT || 3000;
app.listen(port);
