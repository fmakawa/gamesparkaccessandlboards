// ====================================================================================================
//
// Cloud Code for retrieveLeaderboard, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
var leaderboardName = Spark.getData().leaderboardname;
var uPwd = Spark.getData().password;
var uName = Spark.getData().username;
var entryCount = Spark.getData().entrycount;
var aroundMe = Spark.getData().aroundme;


var authenticationResponse = Spark.sendRequest(
    {
     "@class": ".AuthenticationRequest",
     "password": uPwd,
     "userName": uName
    }
);

if (authenticationResponse.error == null) {
    var leaderboardResponse;

    if (aroundMe) {
        var aroundMeLeaderboardRequest = new SparkRequests.AroundMeLeaderboardRequest();
        aroundMeLeaderboardRequest.entryCount = entryCount;
        aroundMeLeaderboardRequest.inverseSocial = false;
        aroundMeLeaderboardRequest.dontErrorOnNotSocial = false;
        aroundMeLeaderboardRequest.leaderboardShortCode = leaderboardName;

        leaderboardResponse = aroundMeLeaderboardRequest.ExecuteAs(authenticationResponse.userId);
        rowCount = entryCount;
    } else {

        var leaderboardDataRequest = new SparkRequests.LeaderboardDataRequest();
        leaderboardDataRequest.entryCount = entryCount;
        leaderboardDataRequest.inverseSocial = false;
        leaderboardDataRequest.dontErrorOnNotSocial = false;
        leaderboardDataRequest.leaderboardShortCode = leaderboardName;

        leaderboardResponse = leaderboardDataRequest.ExecuteAs(authenticationResponse.userId);

    }


    var numberOfChildren = leaderboardResponse.data.length;
    var rowCount = numberOfChildren;
    var tableString = '{ "Properties" : [ ] , "Name" : "" , "Children" : [ { "Properties" : [ { "Name" : "rowCount" , "Value" : '+ rowCount +'} , { "Name" : "columnCount" , "Value" : 3} , { "Name" : "0-1-name" , "Value" : "Rank"} , { "Name" : "0-1-type" , "Value" : 1} , { "Name" : "0-2-name" , "Value" : "Name"} , { "Name" : "0-2-type" , "Value" : 1} , { "Name" : "0-3-name" , "Value" : "Score"} , { "Name" : "0-3-type" , "Value" : 1}] , "Name" : "id191614_headers" , "Children" : [ ]} , { "Properties" : [] , "Name" : "id191614" , "Children" : [ ]}]}';
    var jsonTable = JSON.parse(tableString);


    for(i=0; i < numberOfChildren; i++) {
        var rowString = (i + 1).toString();
        jsonTable.Children[1].Properties[i] = {}
        jsonTable.Children[1].Properties[i].Name = rowString;
        jsonTable.Children[1].Properties[i].Value = "|" + leaderboardResponse.data[i].rank + "|" + leaderboardResponse.data[i].userName + "|" + leaderboardResponse.data[i].score + "|";
    }


    Spark.getLog().debug(jsonTable);
    Spark.setScriptData("RESPONSE_RAW", jsonTable);

}
