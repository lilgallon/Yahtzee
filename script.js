/**
 * Called when the document is ready, it is a sort of main
 */
$(document).ready(function($) {
    initDiceTable();
    initResultTable();
});

/**
 * Creates the dice table
 */
function initDiceTable(){

    var d = window.document;
    var table = d.createElement("table");

    for(var i = 0; i < 7; ++i){
        var tr = d.createElement("tr");
        table.appendChild(tr);
        for(var j = 0; j < 2; ++j) {
            var td = d.createElement("td");
            if(j === 0 && i !== 0){
                td.innerHTML = "Dé " + (i);
            }else if(j === 1 && i === 0){
                td.innerHTML = "Points";
            }

            tr.appendChild(td);
        }
    }

    table.id = "dice-table";
    d.getElementById("game").appendChild(table);
}

/**
 * Creates the result table
 */
function initResultTable(){

    var d = window.document;
    var table = d.createElement("table");

    for(var i = 0; i < 7; ++i){
        var tr = d.createElement("tr");
        table.appendChild(tr);
        for(var j = 0; j < 3; ++j) {
            var td = d.createElement("td");

            if(j === 0 ){
                switch (i){
                    case 0:
                        td.innerHTML = "Combinaison";
                        break;
                    case 1:
                        td.innerHTML = "Brelan";
                        break;
                    case 2:
                        td.innerHTML = "Petite suite";
                        break;
                    case 3:
                        td.innerHTML = "Grande suite";
                        break;
                    case 4:
                        td.innerHTML = "Full";
                        break;
                    case 5:
                        td.innerHTML = "Carré";
                        break;
                    case 6:
                        td.innerHTML = "Yahtzee";
                        break;
                    case 7:
                        td.innerHTML = "Chance";
                        break;
                    default:
                        td.innerHTML = "wtf";
                        break;
                }

            }else if(j === 1 ){
                switch (i) {
                    case 0:
                        td.innerHTML = "Points";
                        break;
                    case 1:
                        td.innerHTML = "Somme";
                        break;
                    case 2:
                        td.innerHTML = "30";
                        break;
                    case 3:
                        td.innerHTML = "40";
                        break;
                    case 4:
                        td.innerHTML = "25";
                        break;
                    case 5:
                        td.innerHTML = "Somme";
                        break;
                    case 6:
                        td.innerHTML = "50";
                        break;
                    case 7:
                        td.innerHTML = "Somme";
                        break;
                    default:
                        td.innerHTML = "wtf";
                        break;
                }
            }else if(j === 2){
                if(i === 0) td.innerHTML = "Points"
            }

            tr.appendChild(td);
        }
    }

    table.id = "result-table";
    d.getElementById("game").appendChild(table);
}