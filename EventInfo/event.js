var index = require("../index.js");

module.exports = function(){
    return {
        name: "",
        judges: [3],
        location: "",
        style: "Breaking",
        format: "",
        MC: "",
        DJ: "",
        prize: 0,
        attendence: [],
        date: "TBA"

    }

}
var eventRef = firebase.database().ref("Events");

