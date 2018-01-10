// ====================================================================================================
//
// Cloud Code for register, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
var uPwd = Spark.getData().password;
var uName = Spark.getData().username;
var dName = Spark.getData().displayname;

var registrationResponse = Spark.sendRequest(
{
 "@class": ".RegistrationRequest",
 "displayName": uName,
 "password": uPwd,
 "segments": {},
 "userName": uName
}
)

if (registrationResponse.error == null) {
    Spark.setScriptData("RESPONSE_RAW", '{"Status":"Success"}');
} else {
    Spark.getLog().error(registrationResponse)
    Spark.setScriptData("RESPONSE_RAW", '{"Status": ""}');
}
