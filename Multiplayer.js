// ====================================================================================================
//
// Cloud Code for multiplayer, write your code here to customize the GameSparks platform.
//
// For details of the GameSparks Cloud Code API see https://docs.gamesparks.com/
//
// ====================================================================================================

//Only part to modify:
var maxNumberOfPlayers = 4;
var minNumberOfPlayers = 2;
//End of modify portion.

//This is the data that comes from GaneSalad.
var gamesData = Spark.getData().params;

//This is the requestId or the gameMatchId. You should really not send both.
var requestId = Spark.getData().requestId;
var gsMatchId = Spark.getData().gsMatchId;
var gsUserId = Spark.getData().gsUserId;
var gsMatchStatus = Spark.getData().gsMatchStatus;

//You can send updated attributes.
var at1 = Spark.getData().at1;
var at2 = Spark.getData().at2;
var at3 = Spark.getData().at3;


function updateMatchStatus(st, theGame)
{
    var numberOfChildren = theGame.Children[1].Properties.length;

    for(i=0; i < numberOfChildren; i++) {

        var playerRecord = theGame.Children[1].Properties[i].Value;
        var playerRecordArray = playerRecord.split("|");

        if (playerRecordArray[1]) {

            var playerRecordUpdate = "|" + playerRecordArray[1] +
            "|" + playerRecordArray[2] + "|" + st + "|" + playerRecordArray[4] + "|" + playerRecordArray[5] + "|"  + playerRecordArray[6] + "|" +
            playerRecordArray[7] + "|";


            theGame.Children[1].Properties[i].Value = playerRecordUpdate;
        }
    }

}

//If post data save the data.
if (gamesData && requestId) {

    var recordMatchId = 0;
    var numberOfPlayers = 1;
    var gsMatchStatus = 1;

    //Multiplayer object that was sent in.
    var newMultiPlayerRequest = JSON.parse(gamesData);
    var userNameValue = newMultiPlayerRequest.Children[1].Properties[0].Value;
    var newMPRPlayer = userNameValue.split("|");

    //Setting defaults for most of these. If there is a match they will be over written.
    gsMatchId = newMPRPlayer[7];

    newMultiPlayerRequest.Name = requestId;

    var gsAt1 = newMPRPlayer[4];

    if (!gsAt1){
        gsAt1 = "";
    }

    var gsAt2 = newMPRPlayer[5];

    if (!gsAt2){
        gsAt2 = "";
    }

    var gsAt3 = newMPRPlayer[6];

    if (!gsAt3){
        gsAt3 = "";
    }

    //Start of looking for another game.
    var allMultiPlayerObjects = Spark.runtimeCollection("multiplayerGames");
    var multiPlayerGame = allMultiPlayerObjects.findOne({"matchStatus" : 1});

    if (multiPlayerGame) {

        numberOfPlayers = multiPlayerGame.numberOfPlayers + 1;

        if (!multiPlayerGame.numberOfPlayers < minNumberOfPlayers) {
            gsMatchStatus = 2;
        }

        var matchPlayer1Values = multiPlayerGame.Children[1].Properties[0].Value;
        var matchPlayer1Array = matchPlayer1Values.split("|");

        //Update all the values that need to be updated.
        gsMatchId = multiPlayerGame.gsMatchId;
        multiPlayerGame.numberOfPlayers = numberOfPlayers;
        multiPlayerGame.matchStatus = gsMatchStatus;


        //Create new player record to insert.
        var newPlayerRow = "|" + newMPRPlayer[1] +
        "|" + newMPRPlayer[2] + "|" + gsMatchStatus + "|" + newMPRPlayer[4] + "|" + newMPRPlayer[5] + "|"  + newMPRPlayer[6] + "|" +
        matchPlayer1Array[7] + "|";

        //Insert new player record.
        multiPlayerGame.Children[1].Properties[(numberOfPlayers - 1)].Value = newPlayerRow;

        //Update all the other records with the correct status.
        updateMatchStatus(gsMatchStatus, multiPlayerGame);

        //And finally replace the record in the database.
        allMultiPlayerObjects.update({"gsMatchId" : matchPlayer1Array[7] }, multiPlayerGame);

    }

    newMultiPlayerRequest.numberOfPlayers = numberOfPlayers;
    newMultiPlayerRequest.matchStatus = gsMatchStatus;
    newMultiPlayerRequest.gsMatchId = gsMatchId;


    newMultiPlayerRequest.Children[1].Properties[0].Value = "|" + newMPRPlayer[1] +
    "|" + newMPRPlayer[2] + "|" + gsMatchStatus + "|" + gsAt1 + "|" + gsAt2 + "|"  + gsAt3 + "|" + gsMatchId + "|";


    allMultiPlayerObjects.insert(newMultiPlayerRequest)
    Spark.setScriptData("RESPONSE_RAW", '{"Status":"Success"}');

}else{

     //Check we got a userId
    if (requestId) {

        //Pull collection
        var collection = Spark.runtimeCollection("multiplayerGames");

        //Make sure we got a collection
        if (collection) {

            //Find one with the correctId
            var foundRequest = collection.findOne({"Name":requestId});

            //Check to make sure we found request.
            if (foundRequest) {
                //Send response.
                Spark.setScriptData("RESPONSE_RAW", foundRequest);

            } else {
                Spark.setScriptData("RESPONSE_RAW", "");
                Spark.getLog().error("Error: couldn't find match request.");
            }

        } else {
           Spark.setScriptData("RESPONSE_RAW", "");
           Spark.getLog().error("Error: couldn't find match collection.");
        }

    } else {


        if (gsMatchId) {

             //Pull collection
            var collection = Spark.runtimeCollection("multiplayerGames");

            //Make sure we got a collection
            if (collection) {

                //Find one with the correctId

                var foundMatch = collection.findOne({"gsMatchId":gsMatchId});

                //Check to make sure we found request.
                if (foundMatch) {

                    //Was a match status update sent in.
                    if (gsMatchStatus) {
                        //Update the status.
                        foundMatch.matchStatus = gsMatchStatus;
                    }

                    if (gsUserId) {

                        if (at1 || at2 || at3 || gsMatchStatus) {

                            for (i = 0; i < foundMatch.numberOfPlayers; i++){
                                var currentPlayer = foundMatch.Children[1].Properties[i].Value;
                                var currentPlayerArray = currentPlayer.split("|");

                                if (currentPlayerArray[1] == gsUserId) {

                                    var gsUserName = currentPlayerArray[2]

                                    if (!at1) {
                                        at1 = currentPlayerArray[4];
                                    }

                                    if (!at2) {
                                        at2 = currentPlayerArray[5];
                                    }

                                    if (!at3) {
                                        at3 = currentPlayerArray[6];
                                    }

                                    if (!gsMatchStatus){
                                        gsMatchStatus = currentPlayerArray[3];
                                    }

                                    Spark.getLog().debug("Debug: UserId: " + currentPlayerArray[1]);
                                    var updatedValue = "|" + currentPlayerArray[1] +
                                    "|" + currentPlayerArray[2]  + "|" + gsMatchStatus + "|" + at1 + "|" + at2 + "|"  + at3 + "|" +
                                    currentPlayerArray[7] + "|";


                                    foundMatch.Children[1].Properties[i].Value = updatedValue


                                }
                            }

                        }
                    } else {
                        Spark.getLog().warn("Warning: No user Id in request.");
                    }

                    //If updating larger documents. It is less costly to update individual
                    //Sub documents rather than the entire document.
                    //
                    //var updatePath = "Children.1.Properties." + i + ".Value";
                    //var obj3 = {};
                    //obj3[updatePath] = updatedValue;
                    //collection.update({"gsMatchId" : gsMatchId}, {"$set" : obj3 });

                    collection.update({"gsMatchId" : gsMatchId }, foundMatch);
                    Spark.setScriptData("RESPONSE_RAW", foundMatch);

                } else {
                    Spark.setScriptData("RESPONSE_RAW", "");
                    Spark.getLog().error("Error: couldn't find match: " + gsMatchId);
                }

            } else {
               Spark.setScriptData("RESPONSE_RAW", "");
               Spark.getLog().error("Error: couldn't find match collection.");
            }

        }
    }
}
