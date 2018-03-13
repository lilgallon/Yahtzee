var $;

/**
 * It is formatted this way :
 * i = 1 -> number of dice 1
 * i = 2 -> number of dice 2
 * and so on
 */
var dices;

/**
 * Called when the document is ready, it is a sort of main
 */
$(document).ready(function($) {
    dices = [];
    resetDicesArray();

    $("#information").text("Cliquez dans la case d'en dessous pour lancer un dé.")

    /**
     * Called when the user wants to re-roll a dice
     */

    // TODO: DICE INDEX
    for(var dice_index = 1 ; dice_index < dices.length ; dice_index ++) {
        $("#dice" + dice_index).on("click", function () {

            // Launch the dice (random)
            var rand_dice = rollADice();

            // Add the dice to the array

            dices[rand_dice] += 1;

            // Put the image according to the dice
            var image = '<img style="width: 50px; margin: 5px;" src="images/dice' + rand_dice + '.png"/>';
            $(this).append(image);

            // Update the dices results
            updateDicesResults();
            updateComboResults();

        });
    }

    $("#dice-launch").on("click", function(){

        if(countLaunchedDices() !== 5) {
            for (var i = 1; i <= 5; ++i) {
                // Launch the dice (random)
                var rand_dice = rollADice();

                // Add the dice to the array
                dices[rand_dice] += 1;

                // Put the image according to the dice
                var image = '<img id="dice' + rand_dice +'" style="width: 50px; margin: 5px;" src="images/dice' + rand_dice + '.png"/>';
                $(this).append(image);
            }

            // Update the dices results
            updateDicesResults();
            updateComboResults();
        }

    });

});

function rollADice(){
    return 1 + Math.floor(Math.random() * 6);
}

function countLaunchedDices(){
    var cpt = 0;
    for(var i = 1 ; i < dices.length ; ++ i)
        cpt += dices[i];
    return cpt;
}

function updateDicesResults(){
    for(var i = 1 ; i < dices.length ; ++ i){
        var score = dices[i] * i;

        if(dices[i] !== 0)
            $("#diceres" + i).text(score.toString());
        else
            $("#diceres" + i).text("-");
    }
}

function updateComboResults(){

    var brelan = getBrelanScore();
    var carre = getCarreScore();
    var full = getFullScore();
    var yahtzee = getYahtzeeScore();
    var petite_suite = getStraightScore(4);
    var grande_suite = getStraightScore(5);

    $("#brelan").text(brelan.toString());
    $("#carre").text(carre.toString());
    $("#full").text(full.toString());
    $("#yahtzee").text(yahtzee.toString());

    $("#petite-suite").text(petite_suite.toString());
    $("#grande-suite").text(grande_suite.toString());

    if(brelan === 0 && carre === 0 && full === 0 && yahtzee === 0 && petite_suite === 0 && grande_suite === 0)
        $("#chance").text(getChanceScore());
    else
        $("#chance").text("0");
}

function numberOfSameDices(except, number){
    var dice = -1;
    for (var i = 1; i < dices.length; ++i) {
        if (dices[i] === number && i !== except)
            dice = i;
    }
    return dice;
}

function getBrelanScore(){
    var dice = numberOfSameDices(-1, 3);
    if(dice === -1) return 0;
    return dices[dice] * dice;
}

function getCarreScore(){
    var dice = numberOfSameDices(-1, 4);
    if(dice === -1) return 0;
    return dices[dice] * dice;
}

function getFullScore(){
    var dice1 = numberOfSameDices(-1, 3);
    if(dice1 === -1) return 0;

    // Now we know that we have at least 3 dices with of the same number
    // we will check if there are 2 dices of the same color
    var dice2 = numberOfSameDices(dice1, 2);
    if(dice2 === -1) return 0;

    return 25;
}

function getYahtzeeScore(){
    var dice = numberOfSameDices(-1, 5);
    if(dice === -1) return 0;
    return 50;
}


function getStraightScore(aimed_straight_lenght){

    var index = 1;
    var max_straight_length = 0;
    var straight_length = 0;

    for(var index = 1 ; index < dices.length ; ++ index){
        // There is an element, so we start the straight otherwise we reset it
        if(dices[index] !== 0){
            straight_length ++;
        }else{
            straight_length = 0;
        }

        if(straight_length > max_straight_length){
            max_straight_length = straight_length;
        }
    }
    console.log(max_straight_length);
    if(max_straight_length !== aimed_straight_lenght) return 0;
    return 40;
}

function resetDicesArray(){
    for(var i = 0 ; i <= 6 ; ++ i)
        dices.push(0);
}

function getChanceScore(){
    var score = 0;
    for(var i = 1 ; i < dices.length ; ++ i){
        score += dices[i] * i;
    }
    return score;
}
