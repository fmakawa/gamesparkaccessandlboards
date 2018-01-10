// ====================================================================================================
//
// Cloud Code for postScore, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
var score = Spark.getData().score;
var uPwd = Spark.getData().password;
var uName = Spark.getData().username;
var eventname = Spark.getData().eventname;

var authenticationResponse = Spark.sendRequest(
    {
     "@class": ".AuthenticationRequest",
     "password": uPwd,
     "userName": uName
    }
);


if (authenticationResponse.error == null) {
    var logEventRequest = new SparkRequests.LogEventRequest();
    logEventRequest.eventKey = eventname;
    logEventRequest.score = score;

    var logEventResponse = logEventRequest.ExecuteAs(authenticationResponse.userId);

    if (logEventResponse.error == null) {
        Spark.setScriptData("RESPONSE_RAW", '{"Status":"Success"}');
    } else {
        Spark.getLog().error(logEventResponse)
        Spark.setScriptData("RESPONSE_RAW", '{"Status": ""}');
    }
} else {
    Spark.getLog().error(authenticationResponse)
    Spark.setScriptData("RESPONSE_RAW", '{"Status": ""}');
}
