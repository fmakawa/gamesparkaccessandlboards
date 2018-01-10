// ====================================================================================================
//
// Cloud Code for userLogin, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

var uPwd = Spark.getData().password;
var uName = Spark.getData().username;

var authenticationResponse = Spark.sendRequest(
    {
     "@class": ".AuthenticationRequest",
     "password": uPwd,
     "userName": uName
    }
)

if (authenticationResponse.error == null) {
    Spark.setScriptData("RESPONSE_RAW", '{"Status":"Success"}');
} else {
    Spark.getLog().error(authenticationResponse)
    Spark.setScriptData("RESPONSE_RAW", '{"Status": ""}');
}
