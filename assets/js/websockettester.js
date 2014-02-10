// assets/js/websockettester.js

// initialize global variables

var KEY_SERVER_URI = "ws://localhost:8888";
var connection;
//party completa que se enviará
var allCharacters = {
    "party": [],
    "enemies": [],
}

//esta es solo para probar, debe ser borrada

var party = {
    "buenos": {
        "primero": {
            "profession": "warrior",
            "name": "Pedrito",
            "type": "warriorAttack",
            "attack": 100,
            "defense": 80,
            "health": 150,
            "evade": 5,
            "crit": 5,
            "status": "none"
        },
        "segundo": {
            "profession": "mage",
            "name": "esencito",
            "type": "mageAttack",
            "attack": 30,
            "defense": 50,
            "health": 20,
            "evade": 30,
            "crit": 5,
            "status": "none"
        }
    },
    "malos": {
        "primero": {
            "profession": "rogue",
            "name": "Orquito",
            "type": "minionAttack",
            "attack": 100,
            "defense": 80,
            "health": 150,
            "evade": 5,
            "crit": 5,
            "status": "none"
        },
        "segundo": {
            "profession": "minionazo",
            "name": "Simurito",
            "type": "enemyAttack",
            "attack": 100,
            "defense": 80,
            "health": 150,
            "evade": 5,
            "crit": 5,
            "status": "none"
        }
    }
}
/**
 * set up the actions and global variables on the page
 */


$(document).ready(function() {

    // load the saved serverURI into the serveruri input
    var server = localStorage.getItem(KEY_SERVER_URI);
    $("#serveruri").val(server);




    // assign event handler to the connect button
    $("#connect").on("click", function(e) {
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
    $("#warriorAttackButton").on("click", function(e) {
        var name = $("#playerName").text();
        var playerAttack = $("#playerAttack").text();
        var playerCrit = $("#playerCrit").text();
        var minionDefense = $("#orcDefense").text();
        var minionHealth = $("#orcHealth").text();
        var minionEvade = $("#orcEvade").text();
        message = {
            'type': 'warriorAttack',
            'name': name,
            'attack': playerAttack,
            'defense': minionDefense,
            'health': minionHealth,
            'evade': minionEvade,
        }
        if (message.health == 'R.I.P') {
            $("<p class='deadText'>El oponente ya está muerto</p>").prependTo("#output");
        } else {
            connection.send(JSON.stringify(party)); // JSON.stringify(party) cambio aquí a party para ver que pasa
            console.log(JSON.stringify(party));
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
                $('#orcHealth').text(server_message);
                $('#output').prepend("<p class='playerText'>Pedrito ataca a Esen por " + (minionHealth - server_message) + " puntos de daño</p>");
            }
            //si muere
            if (server_message < '1') {
                $('#orcHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });
    $("#mageAttackButton").on("click", function(e) {
        var playerAttack = $("#mageAttack").text();
        var playerCrit = $("#mageCrit").text();
        var minionDefense = $("#trollDefense").text();
        var minionHealth = $("#trollHealth").text();
        var minionEvade = $("#trollEvade").text();
        message = {
            'type': 'mageAttack',
            'name': name,
            'attack': playerAttack,
            'defense': minionDefense,
            'health': minionHealth,
            'evade': minionEvade,
        }
        if (message.health == 'R.I.P') {
            $("<p class='deadText'>El oponente ya está muerto</p>").prependTo("#output");
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
                $('#trollHealth').text(server_message);
                $('#output').prepend("<p class='playerText'>Carlitos ataca a Esen II por " + (minionHealth - server_message) + " puntos de daño</p>");
            }
            //si muere
            if (server_message < '1') {
                $('#trollHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });
    $("#orcAttackButton").on("click", function(e) {
        var name = $("#minionName").text();
        var minionAttack = $("#minionAttack").text();
        var minionCrit = $("#minionCrit").text();
        var playerDefense = $("#warriorDefense").text();
        var playerHealth = $("#warriorHealth").text();
        var playerEvade = $("#warriorEvade").text();
        message = {
            'type': 'orcAttack',
            'name': name,
            'attack': minionAttack,
            'defense': playerDefense,
            'health': playerHealth,
            'evade': playerEvade,
        }
        if (message.health == 'R.I.P') {
            $("<p class='deadText'>El oponente ya está muerto</p>").prependTo("#output");
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
                $('#warriorHealth').text(server_message);
                $('#output').prepend("<p class='minionText'>Esen ataca a Pedrito por " + (playerHealth - server_message) + " puntos de daño</p>");
            }
            //si muere
            if (server_message < '1') {
                $('#warriorHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });
    $("#trollAttackButton").on("click", function(e) {
        var minionAttack = $("#trollAttack").text();
        var minionCrit = $("#trollCrit").text();
        var playerDefense = $("#mageDefense").text();
        var playerHealth = $("#mageHealth").text();
        var playerEvade = $("#mageEvade").text();
        message = {
            'type': 'trollAttack',
            'attack': minionAttack,
            'defense': playerDefense,
            'health': playerHealth,
            'evade': playerEvade,
        }
        if (message.health == 'R.I.P') {
            $("<p class='deadText'>El oponente ya está muerto</p>").prependTo("#output");
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
                $('#mageHealth').text(server_message);
                $('#output').prepend("<p class='minionText'>Esen II ataca a Carlitos por " + (playerHealth - server_message) + " puntos de daño</p>");
            }
            //si muere
            if (server_message < '1') {
                $('#mageHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });
});