module.exports = function(){
    return {
        name: "",
        experience: 0,
        country: "",
        style: "Breaking",
        styleVotes: 0,
        powerVotes: 0,
        abstractVotes: 0,
        foundationVotes: 0
    }

}

var addStats = function(judge, competitor){
    console.log("current judge is " + judge.name + "with competitor" + competitor.name)
    if(competitor == "TIE") {
        return;
    }

    if(competitor.styleRanking < competitor.powerRanking
    && competitor.styleRanking < competitor.abstractRanking ) {
        //style more important than power
        judge.styleVotes++;     
    }
    if(competitor.powerRanking < competitor.styleRanking
    && competitor.powerRankingg < competitor.abstractRanking ) {
        //style more important than power
        judge.powerVotes++;     
    }

    if(competitor.abstractRanking < competitor.powerRanking
    && competitor.abstractRanking < competitor.styleRanking) {
        //style more important than power
        judge.abstractVotes++;     
    }
}
var calcStats = function(Judge){
    var results= [3];
    var totalVotes = judge.styleVotes + judge.powerVotes + judge.abstractVotes ;
    results[0] = "Voted Style: " + judge.styleVotes/totalVotes + "% of the time\n";
    results[1] = result + "Voted Power: " + judge.powerVotes/totalVotes + "% of the time\n";
    results[2] = result + "Voted Abstract: " + judge.abstractVotes/totalVotes + "% of the time\n";
    return result;
}


module.exports.addStat = addStats;
module.exports.calcStats = calcStats;