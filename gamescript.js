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
 */
var available_result_ids;

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
    // Initialize the variables
    selected_dices = [];
    rolled_dices = [];
    for(var i = 0 ; i <= NUMBER_OF_FACES ; ++ i) {
        selected_dices.push(0);
        rolled_dices.push(0);
    }

    available_result_ids = [];
    available_result_ids.add("#dice-result-1");
    available_result_ids.add("#dice-result-2");
    available_result_ids.add("#dice-result-3");
    available_result_ids.add("#dice-result-4");
    available_result_ids.add("#dice-result-5");
    available_result_ids.add("#dice-result-6");
    available_result_ids.add("#tree-of-a-kind-result");
    available_result_ids.add("#four-of-a-kind-result");
    available_result_ids.add("#full-house-result");
    available_result_ids.add("#small-straight-result");
    available_result_ids.add("#large-straight-result");
    available_result_ids.add("#chance-result");
    available_result_ids.add("#yahtzee-result");

    // Add the clicks event

    $("#roll").click(function () {
        onRollClick();
    });

    $("#rolled-dices").on("click", "img", function () {
       onRolledDiceClick($(this));
    });

    $("#selected-dices").on("click", "img", function () {
        onSelectedDiceClick($(this));
    });
}

/**
 * Used to show the images of the selected and rolled dices
 */
function showDices(){
    $("#selected-dices").empty();
    $("#rolled-dices").empty();
    for(var i = 1 ; i <= NUMBER_OF_FACES ; ++ i) {
        var j;
        if(selected_dices[i] !== 0){
            // It may have multiple dices of the same value, so we need to display all of them
            for(j = 0 ; j < selected_dices[i] ; j ++){
                var image = '<img src="images/dice' + i + '.png"/>';
                $("#selected-dices").append(image);
            }
        }

        if(rolled_dices[i] !== 0){
            for(j = 0 ; j < rolled_dices[i] ; j ++){
                var image = '<img src="images/dice' + i + '.png"/>';
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

/**
 * Used to handle the roll click
 */
function onRollClick(){
    rollDices();
    showDices();
}

/**
 * Used to handle a click on a rolled dice
 * @param sender JQuery element sender
 */
function onRolledDiceClick(sender){
    var value = sender.attr("src").split(".png")[0].split("dice")[1];
    rolled_dices[value] -= 1;
    selected_dices[value] += 1;
    updateResults();
    showDices();
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
 * Used to update all the results in the result table
 */
function updateResults(){
    for(var i = 0 ; i < available_result_ids.length ; ++ i){
        var id = available_result_ids[i];
        // TODO: IMPLEMENTATION
        switch (id){
            case "#dice-result-1":
                break;
            case "#dice-result-2":
                break;
            case "#dice-result-3":
                break;
            case "#dice-result-4":
                break;
            case "#dice-result-5":
                break;
            case "#dice-result-6":
                break;
            case "#tree-of-a-kind-result":
                break;
            case "#four-of-a-kind-result":
                break;
            case "#full-house-result":
                break;
            case "#small-straight-result":
                break;
            case "#large-straight-result":
                break;
            case "#chance-result":
                break;
            case "#yahtzee-result":
                break;
            default:
                break;
        }
    }
}