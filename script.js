/**
 * Called when the document is ready, it is a sort of main
 */
$(document).ready(function($) {
    initTable("superior", "sup");
    initTable("inferior", "inf");
});

function initTable(parent, table_class){
    var size = table_class === "sup" ? 10 : 12;
    console.log(size);

    var d = window.document;
    var table = d.createElement("table");

    for(var i = 0; i < size; ++i){
        var tr = d.createElement("tr");
        table.appendChild(tr);

        var td = d.createElement("td");

        if(i === 0) td.innerHTML = "Jeu 1";

        tr.appendChild(td);
    }

    table.classList.add(table_class);
    d.getElementById(parent).appendChild(table);
}