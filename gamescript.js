/**
 * These two arrays contain the selected dices with this format :
 * index 0 -> nothing
 * index 1 -> number of 1 dice(s) that the user has selected / rolled
 * [...]
 * index 6 -> number of 6 dice(s) that the user has selected / rolled
 */
var selected_dices;
var rolled_dices;

/**
 * It will store all the available result containers. If the user already has selected "Full house", it won't
 * be stored anymore. So the program will loop over it, but won't take care of this one.
 * The unavailable IDs are stored in locked_result_ids
 */
var available_result_ids;
var locked_result_ids;

/**
 * Number of faces of the dices used
 * It is obvious but used for a better code comprehension
 * @type {number}
 */
var NUMBER_OF_FACES = 6;

/**
 * Number of dices used
 * It is obvious, but used for a better code comprehension
 * @type {number}
 */
var NUMBER_OF_DICES = 5;

/**
 * It represents the number of throw in a turn
 */
var number_of_throws;
var INITIAL_NUMBER_OF_THROWS = 3;

/**
 * It contains all the selected scores
 * 0 -> dice 1
 * ....
 * 5 -> dice 6
 * 6 -> 3 of a kind
 * ....
 * 12 -> Yahtzee
 */
var final_scores;

/**
 * Game status indicator
 */
var game_finished;

/**
 * Called when the document is ready, it is a sort of main
 */
$(document).ready(function() {
    init();
    showDices();
});


/**
 * Used to init the game
 */
function init(){
    var i;
    updateInformation("Cliquez sur lancer les dés pour démarrer la partie.");
    number_of_throws = INITIAL_NUMBER_OF_THROWS;

    game_finished = false;

    final_scores = [];
    for(i = 0 ; i < 13 ; ++ i)
        final_scores.push(0);

    resetDices();

    available_result_ids = [];
    available_result_ids.push("#dice-result-1");
    available_result_ids.push("#dice-result-2");
    available_result_ids.push("#dice-result-3");
    available_result_ids.push("#dice-result-4");
    available_result_ids.push("#dice-result-5");
    available_result_ids.push("#dice-result-6");
    available_result_ids.push("#tree-of-a-kind-result");
    available_result_ids.push("#four-of-a-kind-result");
    available_result_ids.push("#full-house-result");
    available_result_ids.push("#small-straight-result");
    available_result_ids.push("#large-straight-result");
    available_result_ids.push("#chance-result");
    available_result_ids.push("#yahtzee-result");
    locked_result_ids = [];

    for(i = 0 ; i < available_result_ids ; ++ i)
        $(available_result_ids[i]).text("");
    $("#sum-result").text("");
    $("#bonus-result").text("");
    $("#total-result").text("");

    for(i = 0 ; i < available_result_ids.length ; ++ i){
        // Add the hover interaction
        $(available_result_ids[i]).hover(function () {
            $(this).css("background-color", "#1abc9c");
        }, function(){
            $(this).css("background-color", "");
        });

        // Add the on click interaction
        $(available_result_ids[i]).click(function () {
            onScoreClick($(this));
        });

        $(available_result_ids[i]).css("background-color", "");
    }

    // Add the clicks event

    $("#roll").click(function () {

        if(game_finished){
            init();
            showDices();
        }else if(number_of_throws !== 0 && !(countDices(rolled_dices) === 0 && number_of_throws !== INITIAL_NUMBER_OF_THROWS)) {
            number_of_throws--;
            onRollClick();
            if(number_of_throws !== 0) {
                updateInformation("Il vous reste " + number_of_throws + " lancers. <br>" +
                    "Vous pouvez finir votre tour à tout moment en sélectionnant un score. <br>" +
                    "Seulement les dés dans \"dés lancés\" seront relancés.");
            }else{
                updateInformation("Vous n'avez plus de lancers. Sélectionnez un score pour finir votre tour.");
            }
        }
    });

    $("#rolled-dices").on("click", "img", function () {
       onRolledDiceClick($(this));
    });

    $("#selected-dices").on("click", "img", function () {
        onSelectedDiceClick($(this));
    });
}

/**
 * Used to reset the dices
 */
function resetDices(){
    selected_dices = [];
    rolled_dices = [];
    for(var i = 0 ; i <= NUMBER_OF_FACES ; ++ i) {
        selected_dices.push(0);
        rolled_dices.push(0);
    }
}

/**
 * Used to show the images of the selected and rolled dices
 */
function showDices(){
    $("#selected-dices").empty();
    $("#rolled-dices").empty();
    var image;
    for(var i = 1 ; i <= NUMBER_OF_FACES ; ++ i) {
        var j;
        if(selected_dices[i] !== 0){
            // It may have multiple dices of the same value, so we need to display all of them
            for(j = 0 ; j < selected_dices[i] ; j ++){
                image = '<img src="images/dice' + i + '.png"/>';
                $("#selected-dices").append(image);
            }
        }

        if(rolled_dices[i] !== 0){
            for(j = 0 ; j < rolled_dices[i] ; j ++){
                image = '<img src="images/dice' + i + '.png"/>';
                $("#rolled-dices").append(image);
            }
        }
    }
}

/**
 * Used to roll the non-selected dices, so the rolled ones
 */
function rollDices(){
    var rolled_dices_number = countDices(rolled_dices);
    var i;

    // We have to test if we asked to roll dices at the initialization. It means that if there isn't any dices in
    // the rolled_dices array neither in the selected one, it means that we are in the initialization
    if(rolled_dices_number === 0){
        var selected_dices_number = countDices(selected_dices);
        if(selected_dices_number === 0){
            // Here we need to init the rolled dices !!
            // Let's gooo
            for(i = 0 ; i < NUMBER_OF_DICES ; ++ i){
                // We add a dice in its corresponding value
                rolled_dices[rollADice()] += 1;
            }
        }
    }else{
        // reset the array
        for(i = 1 ; i <= NUMBER_OF_FACES ; ++ i)
            rolled_dices[i] = 0;

        for(i = 0 ; i < rolled_dices_number ; ++ i){
            // We add a dice in its corresponding value
            rolled_dices[rollADice()] += 1;
        }
    }
}

/**
 * Used to roll a dice
 * @returns {number}
 */
function rollADice(){
    return 1 + Math.floor(Math.random() * NUMBER_OF_FACES);
}

/**
 * Used to calculate the number of dices in an array
 * @param array
 * @returns {number}
 */
function countDices(array){
    var counter = 0;
    for(var i = 1 ; i <= NUMBER_OF_FACES ; ++ i) {
        counter += array[i];
    }
    return counter;
}

//
//  EVENTS
//

/**
 * Used to handle the roll click
 */
function onRollClick(){
    rollDices();
    showDices();
    updateResults();
}

/**
 * Used to handle a click on a rolled dice
 * @param sender JQuery element sender
 */
function onRolledDiceClick(sender){
    var value = sender.attr("src").split(".png")[0].split("dice")[1];
    rolled_dices[value] -= 1;
    selected_dices[value] += 1;
    showDices();
    updateResults();
}

/**
 * Used to handle a click on a selected dice
 * @param sender JQuery element sender
 */
function onSelectedDiceClick(sender){
    var value = sender.attr("src").split(".png")[0].split("dice")[1];
    selected_dices[value] -= 1;
    rolled_dices[value] += 1;
    updateResults();
    showDices();
}

/**
 * Used to handle a click in a score box (means that the player selects this as the score
 * @param sender JQuery element sender
 * @param id id of the sender (#blabla)
 */
function onScoreClick(sender){
    // We grant the user to click only if he rolled the dices
    if(countDices(selected_dices) + countDices(rolled_dices) !== 0) {
        var id = "#" + sender.attr("id");

        // We need to check if the sender is available
        var available = false;
        var index = 0;
        while (!available && index < available_result_ids.length) {
            if (available_result_ids[index] === id)
                available = true;
            else
                index++;
        }

        // We need to handle the fact that if the player made a second yahtzee we need to put 100 extra score
        if (!available && id === "#yahtzee-result" && getYahtzeeScore(getAllDices()) !== 0) {
            // HERE THE USER MADE A SECOND YAHTZEE
            // Last yahtzee = 50 points, new yahtzee = 50 points, bonus of 2 yahtzee = 100 => 200 points total
            $(id).text("200");
            final_scores[12] = 200;
        }

        if (available) {
            // Remove its is from the available IDs
            // So, first get its index
            index = 0;
            var found = false;
            while (!found && index < available_result_ids.length) {
                if (available_result_ids[index] === id)
                    found = true;
                else
                    index++;
            }

            // We remove it from the available list
            available_result_ids.splice(index, 1);
            // add it to the locked list
            locked_result_ids.push(id);
            // and add its score to the score container
            switch (id){
                case "#dice-result-1": final_scores[0] = parseInt(sender.text()); break;
                case "#dice-result-2": final_scores[1] = parseInt(sender.text()); break;
                case "#dice-result-3": final_scores[2] = parseInt(sender.text()); break;
                case "#dice-result-4": final_scores[3] = parseInt(sender.text()); break;
                case "#dice-result-5": final_scores[4] = parseInt(sender.text()); break;
                case "#dice-result-6": final_scores[5] = parseInt(sender.text()); break;
                case "#tree-of-a-kind-result": final_scores[6] = parseInt(sender.text()); break;
                case "#four-of-a-kind-result": final_scores[7] = parseInt(sender.text()); break;
                case "#full-house-result": final_scores[8] = parseInt(sender.text()); break;
                case "#small-straight-result": final_scores[9] = parseInt(sender.text()); break;
                case "#large-straight-result": final_scores[10] = parseInt(sender.text()); break;
                case "#chance-result": final_scores[11] = parseInt(sender.text()); break;
                case "#yahtzee-result": final_scores[12] = parseInt(sender.text()); break;
                default: break;
            }

            // Now we change its style
            $(id).unbind('mouseenter mouseleave'); // it is actually hover
            $(id).css("background-color", "#109177");

        }


        if (available_result_ids.length !== 0) {
            // Now reset the dices if there are remaining boxes
            number_of_throws = INITIAL_NUMBER_OF_THROWS;
            resetDices();
            showDices();
            updateResults();
            updateInformation("Vous pouvez lancer les dés quand vous voulez.");
        } else if(!game_finished){
            game_finished = true;
            resetDices();
            showDices();
            updateInformation("Partie finie, vous pouvez recommencer une partie en appuyant sur \"lancer les dés\".");
            var total = calculateFinalScore();
            $("#history").find("ul").append("Date : " + (new Date()).toLocaleTimeString() + ", score : " + total.toString());
        }
    }
}

/**
 * It calculates all the final scores (sum, bonus and total score)
 * @return the total
 */
function calculateFinalScore(){
    var i;
    // Sum calculation
    var sum = 0;
    var bonus = 0;
    for(i = 0 ; i < 6 ; ++ i)
        sum += final_scores[i];
    if(sum >= 63)
        bonus = 35;
    // Display
    $("#sum-result").text(sum.toString());
    $("#bonus-result").text(bonus.toString());

    // Final score calculation
    var total = sum + bonus;
    for(i = 6 ; i < final_scores.length ; ++i )
        total += final_scores[i];
    // Display
    $("#total-result").text(total.toString());
    return total;
}

/**
 * It updates the information message
 * @param info information message
 */
function updateInformation(info){
    $("#information").empty();
    $("#information").append(info);
}

/**
 * It adds information at the end of the current information
 * @param info information message
 */
function addInformation(info){
    $("#information").append(info);
}

/**
 * Used to update all the results in the result table
 */
function updateResults(){
    var i;
    var score;

    // We put all the dice in the same array
    var all_dices = getAllDices();

    for(i = 0 ; i < available_result_ids.length ; ++ i){
        var id = available_result_ids[i];
        switch (id){
            case "#dice-result-1":
                score = all_dices[1] * 1;
                $(id).text(score.toString());
                break;
            case "#dice-result-2":
                score = all_dices[2] * 2;
                $(id).text(score.toString());
                break;
            case "#dice-result-3":
                score = all_dices[3] * 3;
                $(id).text(score.toString());
                break;
            case "#dice-result-4":
                score = all_dices[4] * 4;
                $(id).text(score.toString());
                break;
            case "#dice-result-5":
                score = all_dices[5] * 5;
                $(id).text(score.toString());
                break;
            case "#dice-result-6":
                score = all_dices[6] * 6;
                $(id).text(score.toString());
                break;
            case "#tree-of-a-kind-result":
                score = getXOfAKindScore(3, all_dices);
                $(id).text(score.toString());
                break;
            case "#four-of-a-kind-result":
                score = getXOfAKindScore(4, all_dices);
                $(id).text(score.toString());
                break;
            case "#full-house-result":
                score = getFullHouseScore(all_dices);
                $(id).text(score.toString());
                break;
            case "#small-straight-result":
                score = getStraightScore(4, all_dices);
                $(id).text(score.toString());
                break;
            case "#large-straight-result":
                score = getStraightScore(5, all_dices);
                $(id).text(score.toString());
                break;
            case "#chance-result":
                score = getChanceScore(all_dices);
                $(id).text(score.toString());
                break;
            case "#yahtzee-result":
                score = getYahtzeeScore(all_dices);
                $(id).text(score.toString());
                break;
            default:
                if(getYahtzeeScore(all_dices) !== 0)
                    addInformation("Vous avez fait un second Yahtzee ! Cliquez sur Yahtzee pour avoir le bonus.");
                break;
        }
    }
}

function getAllDices(){
    var i;
    // We put all the dice in the same array
    var all_dices = [];
    // Init
    for(i = 0 ; i <= NUMBER_OF_FACES; ++ i)
        all_dices.push(0);
    // Set
    for(i = 1 ; i <= NUMBER_OF_FACES ; ++ i){
        all_dices[i] += selected_dices[i] + rolled_dices[i];
    }
    return all_dices;
}

// Score calculation methods

/**
 * Calculates the score of X dices of a kind.
 * If there are x dices of a kind, the score is the sum of all dices
 * @param x the number of similar dices
 * @param dices the dices array
 * @returns {number} the score
 */
function getXOfAKindScore(x, dices){
    var index = 1;
    var score = 0;
    var found = false;
    while(!found && index <= NUMBER_OF_FACES){
        score += dices[index] * index;
        if(dices[index] >= x)
            found = true;
        else
            index ++;
    }
    if(found)
        return score;
    else
        return 0;
}

/**
 * Calculates the score of a full house
 * If there is a pair and three dices of a kind, the score is 25 otherwise, 0
 * @param dices the dices array
 * @returns {number} the score
 */
function getFullHouseScore(dices){
    var index = 1;
    var pair_found = false;
    var three_of_a_kind_found = false;
    while(!(pair_found && three_of_a_kind_found) && index <= NUMBER_OF_FACES){
        if(dices[index] === 2)
            pair_found = true;
        else if(dices[index] === 3)
            three_of_a_kind_found = true;
        index ++;
    }

    if(pair_found && three_of_a_kind_found)
        return 25;
    else
        return 0;
}

/**
 * Calculates a straight score
 * If it detects a straight which its size is aimed_straight_length, then the score
 * is 40 if it has a 5 dices straight, otherwise 30.
 * @param aimed_straight_length aimed straight length
 * @param dices the dices array
 * @returns {number} the score
 */
function getStraightScore(aimed_straight_length, dices){
    var max_straight_length = 0;
    var straight_length = 0;

    for(var index = 1 ; index <= NUMBER_OF_FACES ; ++ index){
        // There is an element, so we start the straight otherwise we reset it
        if(dices[index] !== 0)
            straight_length ++;
        else
            straight_length = 0;

        if(straight_length > max_straight_length){
            max_straight_length = straight_length;
        }
    }

    if(max_straight_length < aimed_straight_length)
        return 0;
    else if(aimed_straight_length === 4)
        return 30;
    else
        return 40;
}

/**
 * It calculates the score of a chance, which is the sum of the dices
 * @param dices the dices array
 * @returns {number} the score
 */
function getChanceScore(dices){
    var score = 0;
    for(var index = 0 ; index <= NUMBER_OF_FACES ; ++ index){
        score += dices[index] * index;
    }
    return score;
}

function getYahtzeeScore(dices) {
    var index = 1;
    var score = 0;
    var found = false;
    while(!found && index <= NUMBER_OF_FACES){
        score += dices[index] * index;
        if(dices[index] === 5)
            found = true;
        else
            index ++;
    }
    if(found)
        return 50;
    else
        return 0;
}