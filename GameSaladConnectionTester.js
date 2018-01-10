
// ====================================================================================================
//
// Cloud Code for gamesaladtester, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================
Spark.getLog().debug("Message Recieved.")
var gamesData = Spark.getData().params;
if (gamesData) {
    var jsonObject = JSON.parse(gamesData);
    var tempCollection = Spark.runtimeCollection("gamesaladtester");
    tempCollection.insert(jsonObject);
    Spark.getLog().debug("Data recieved and inserted.")
    Spark.setScriptData("RESPONSE_RAW", '{"Status":"Success"}');
} else {
    Spark.getLog().debug("No data to insert into table.")
    Spark.setScriptData("RESPONSE_RAW", '{"Status":"Success"}');

}
