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





    // assign event handler to the send button
    $("#warriorAttack").click(function(e) {
        var playerAttack = $("#playerAttack").text();
        var playerCrit = $("#playerCrit").text();
        var minionDefense = $("#minionDefense").text();
        var minionHealth = $("#minionHealth").text();
        var minionEvade = $("#minionEvade").text();
        message = {
            'type': 'warriorAttack',
            'attack': playerAttack,
            'defense': minionDefense,
            'health': minionHealth,
            'evade': minionEvade,
        }
        if (message.health == 'R.I.P') {
            $('#outputText').text('El oponente ya está muerto');
        } else {
            connection.send(JSON.stringify(message));
            console.log(message);
        }

        // mensaje regresado x el server
        connection.onmessage = function(e) {
            var server_message = e.data;
            console.log(server_message);

            if (server_message == 'El objetivo esquivo') {
                $('#outputText').text(server_message);
            } else if (server_message == 'No funciono el ataque') {
                $('#outputText').text("Hubo un error de calculo y no funcionó el ataque");
            } else {
                $('#minionHealth').text(server_message);
                $('#outputText').text("El ataque hace " + (minionHealth - server_message) + " puntos de daño");
            }
            //si muere
            if (server_message < '1') {
                $('#minionHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });
    $("#orcAttack").click(function(e) {
        var minionAttack = $("#minionAttack").text();
        var minionCrit = $("#minionCrit").text();
        var playerDefense = $("#playerDefense").text();
        var playerHealth = $("#playerHealth").text();
        var playerEvade = $("#playerEvade").text();
        message = {
            'type': 'minionAttack',
            'attack': minionAttack,
            'defense': playerDefense,
            'health': playerHealth,
            'evade': playerEvade,
        }
        if (message.health == 'R.I.P') {
            $('#outputText').text('El oponente ya está muerto');
        } else {
            connection.send(JSON.stringify(message));
            console.log(message);
        }

        // mensaje regresado x el server
        connection.onmessage = function(e) {
            var server_message = e.data;
            console.log(server_message);

            if (server_message == 'El objetivo esquivo') {
                $('#outputText').text(server_message);
            } else if (server_message == 'No funciono el ataque') {
                $('#outputText').text("Hubo un error de calculo y no funcionó el ataque");
            } else {
                $('#playerHealth').text(server_message);
                $('#outputText').text("El ataque hace " + (playerHealth - server_message) + " puntos de daño");
            }
            //si muere
            if (server_message < '1') {
                $('#playerHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });

});