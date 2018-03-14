/**
 * It is formatted this way :
 * i = 1 -> number of dice 1
 * i = 2 -> number of dice 2
 * and so on
 */
var dices;
var reroll_number;
var yahtzee_counter;
var game_number;
var total_score;

/**
 * Called when the document is ready, it is a sort of main
 */
$(document).ready(function($) {
    dices = [];
    resetDicesArray();
    reroll_number = 5;
    yahtzee_counter = 0;
    game_number = 0;
    total_score = 0;

    $("#information").text("Démarrez la partie dès que vous êtes prêts.")

    /**
     * Called when the user wants to re-roll a dice
     */
    $("#dice-launch").on("click", "span", function () {

        if(reroll_number !== 0) {
            var dice_index = parseInt($(this).attr('id').split("e")[1]);

            // Launch the dice (random)
            var rand_dice = rollADice();

            // Add the new dice to the array
            dices[rand_dice] += 1;

            // Remove the dice that was re-rolled
            var alt = parseInt($("#dice" + dice_index).find("img").attr("alt"));
            dices[alt] -= 1;

            // Remove the image of the re-rolled dice
            $("#dice" + dice_index).empty();

            // Put the new image according to the new dice
            var image = '<img alt="' + rand_dice + '" style="width: 50px; margin: 5px;" src="images/dice' + rand_dice + '.png"/>';
            $("#dice" + dice_index).append(image);

            // Update the dices results
            updateDicesResults();
            updateComboResults();

            reroll_number --;
            if(reroll_number === 0){
                $("#information").text("Vous avez relancé autant de fois que possible, cliquez sur \"finir le tour\" pour finir votre tour.");
            }else{
                $("#information").text("Vous pouvez encore relancer certains dés en cliquant dessus. (" + reroll_number +" restants)");
            }

        }
    });


    /**
     * Rolls the 5 dices, and put it in an image container where :
     * - id is the number of the dice (#1, #2, ... #5)
     * - alt is the value of the dice (1, 2 , ... 6)
     */
    $("#start-stop").click(function(){

        if(game_number < 2) {

            $("#dice-launch").empty();
            for (var i = 1; i <= 5; ++i) {
                // Launch the dice (random)
                var rand_dice = rollADice();

                // Add the dice to the array
                dices[rand_dice] += 1;

                // Put the image according to the dice
                var image = '<span id="dice' + i +'" ><img  alt="' + rand_dice + '" style="width: 50px; margin: 5px;" src="images/dice' + rand_dice + '.png"/></span>';
                $("#dice-launch").append(image);
            }

            game_number ++;
            if(game_number === 1){
                if($("#yahtzee").text() !== "0")
                    yahtzee_counter ++;
                $(this).attr("value", "Finir le tour");
            }else {
                total_score += getScore();
                $(this).attr("value", "Finir la partie");
            }

            $("#information").text("Vous pouvez désormais relancer certains dés en cliquant dessus. (" + reroll_number +" restants)");

            $("#score-total").text(total_score.toString());
            // Update the results displayed
            updateDicesResults();
            updateComboResults();
        }else if(game_number === 2){
            if($("#yahtzee").text() !== "0")
                yahtzee_counter ++;

            total_score += getScore();
            // Last turn finished
            $("#history").find("table").append("<tr><td>" + "Date : " + (new Date()).toLocaleTimeString() + ", score : " + total_score.toString() + "</td></tr>");

            // Reset
            dices = [];
            resetDicesArray();
            reroll_number = 5;
            total_score = 0;
            yahtzee_counter = 0;
            game_number = 0;

            $("#brelan").text("0");
            $("#carre").text("0");
            $("#full").text("0");
            $("#yahtzee").text("0");
            $("#petite-suite").text("0");
            $("#grande-suite").text("0");
            $("#chance").text("0");
            $("#total").text("0");
            for(var i = 1 ; i < dices.length ; ++ i){
                $("#diceres" + i).text("0");
            }

            $("#dice-launch").empty();
            $(this).attr("value", "Démarrer la partie");
            $("#information").text("Démarrez la partie dès que vous êtes prêts.")
        }
    });
});

function rollADice(){
    return 1 + Math.floor(Math.random() * 6);
}

function updateDicesResults(){
    var total = 0;
    for(var i = 1 ; i < dices.length ; ++ i){
        var score = dices[i] * i;
        total += score

        if(dices[i] !== 0)
            $("#diceres" + i).text(score.toString());
        else
            $("#diceres" + i).text("0");
    }
    $("#total").text(total);
}

function getScore(){
    var bonus = parseInt($("#total")) > 63 ? 35 : 0;
    bonus += yahtzee_counter === 2 ? 100 : 0;
    if($("#full").text() !== "0") return parseInt($("#full").text()) + bonus;
    if($("#brelan").text() !== "0") return parseInt($("#brelan").text()) + bonus;
    if($("#carre").text() !== "0") return parseInt($("#carre").text()) + bonus;
    if($("#yahtzee").text() !== "0") return parseInt($("#yahtzee").text()) + bonus;
    if($("#petite-suite").text() !== "0") return parseInt($("#petite-suite").text()) + bonus;
    if($("#grande-suite").text() !== "0") return parseInt($("#grande-suite").text()) + bonus;
    if($("#chance").text() !== "0") return parseInt($("#chance").text()) + bonus;
    return -1;
}

function updateComboResults(){

    var brelan = getBrelanScore();
    var carre = getCarreScore();
    var full = getFullScore();
    var yahtzee = getYahtzeeScore();
    var petite_suite = getStraightScore(4);
    var grande_suite = getStraightScore(5);

    if(full === 0)
        $("#brelan").text(brelan.toString());
    else
        $("#brelan").text("0");

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


function getStraightScore(aimed_straight_length){

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
    if(max_straight_length !== aimed_straight_length) return 0;
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
