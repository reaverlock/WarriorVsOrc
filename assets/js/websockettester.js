// assets/js/websockettester.js

// initialize global variables

var KEY_SERVER_URI = "ws://localhost:8888";
var connection;
/**
 * set up the actions and global variables on the page
 */


$(document).ready(function() {

    // load the saved serverURI into the serveruri input
    var server = localStorage.getItem(KEY_SERVER_URI);
    $("#serveruri").val(server);




    // assign event handler to the connect button
    $("#connect").click(function(e) {
        var server = $("#serveruri").val();
        // crear conexion
        connection = new WebSocket(server);
        console.log("clicked connect");
        // save the current serveruri so we don't have to type it all the time
        localStorage.setItem(KEY_SERVER_URI, server);
        window.connection;
        connection.onopen = function() {
            /*Send a small message to the console once the connection is established */
            console.log('Connection open!');
        }
        e.preventDefault();
    });

    // function for the buttons
    function buttons(e, type, name, attack, crit, enemyName, defense, health, evade ){
        message = {
            'type': type,
            'name': name,
            'attack': attack,
            'enemyName': enemyName,
            'defense': defense,
            'health': health,
            'evade': evade,
        }
        if (message.health == 'R.I.P') {
            $( "<p class='deadText'>El oponente ya está muerto</p>" ).prependTo( "#output" );
        } else {
            connection.send(JSON.stringify(message));
            console.log(message);
        }
        // mensaje regresado x el server
        connection.onmessage = function(e) {
        var server_message = e.data;
        console.log(server_message);

        if (server_message == 'El objetivo esquivo') {
            $('#output').prepend("<p class='evadeText'>" + server_message + "</p>");
        } else if (server_message == 'No funciono el ataque') {
            $('#output').prepend("<p>Hubo un error de calculo y no funcionó el ataque</p>");
        } else {
            health.text(server_message);  // NO ESTOY SEGURO DE SI ESTO SIRVE. CHEKEAR. 
            $('#output').prepend("<p class='playerText'>" +name+ " ataca a " +enemyName+" por " + (minionHealth - server_message) + " puntos de daño</p>");
         }
        //si muere
        if (server_message < '1') {
            health.text("R.I.P");   // NO ESTOY SEGURO DE SI ESTO SIRVE. CHEKEAR. 
            }
        }
        e.preventDefault();

    }


    // assign event handler to different buttons
    $("#warriorAttackButton").click(buttons(e, 'warriorAttack', $("#player1Name").text(), $("#warriorAttack").text(), $("#warriorCrit").text(), $("orcName").text(), $("#orcDefense").text(), $("#orcHealth").text(), $("#orcEvade").text() ));
    
    $("#mageAttackButton").click(buttons(e, 'mageAttack', $("#player2Name").text(), $("#mageAttack").text(), $("#mageCrit").text(), $("#trollName").text(), $("#trollDefense").text(), $("#trollHealth").text(), $("#trollEvade").text() ));
        
    $("#orcAttackButton").click(buttons(e, 'orcAttack', $("#orcName").text(), $("#minionAttack").text(), $("#minionCrit").text(), $("player1Name").text(), $("#warriorDefense").text(), $("#warriorHealth").text(), $("#warriorEvade").text() ));
        
    $("#trollAttackButton").click(buttons(e, 'trollAttack', $("#trollName").text(), $("#trollAttack").text(), $("#trollCrit").text(), $("player2Name").text(), $("#mageDefense").text(), $("#mageHealth").text(), $("#mageEvade").text() ));
        
});