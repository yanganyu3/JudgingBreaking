module.exports = function(Judge){
    var totalVotes = judge.styleVotes + judge.powerVotes + judge.abstractVotes + judge.foundationVotes;
    var results = "Voted Style: " + judge.styleVotes/totalVotes + "% of the time\n";
    results = result + "Voted Power: " + judge.powerVotes/totalVotes + "% of the time\n";
    results = result + "Voted Abstract: " + judge.abstractVotes/totalVotes + "% of the time\n";
    results = result + "Voted Foundation: " + judge.foundationVotes/totalVotes + "% of the time\n";
    
}
