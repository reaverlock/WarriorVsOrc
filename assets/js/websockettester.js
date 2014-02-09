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
    "buenos": [{
            "profession": "warrior",
            "name": "Pedrito",
            "type": "warriorAttack",
            "attack": 100,
            "defense": 80,
            "health": 150,
            "evade": 5,
            "crit": 5,
            "status": "none",
        }, {
            "profession": "mage",
            "name": "esencito",
            "type": "mageAttack",
            "attack": 30,
            "defense": 50,
            "health": 20,
            "evade": 30,
            "crit": 5,
            "status": "none",
        }

    ],
    "malos": [{
        "profession": "rogue",
        "name": "Orquito",
        "type": "minionAttack",
        "attack": 100,
        "defense": 80,
        "health": 150,
        "evade": 5,
        "crit": 5,
        "status": "none",
    }, {
        "profession": "minionazo",
        "name": "Simurito",
        "type": "enemyAttack",
        "attack": 100,
        "defense": 80,
        "health": 150,
        "evade": 5,
        "crit": 5,
        "status": "none",

    }],
}
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
        var name = $("#playerName").text();
        var playerAttack = $("#playerAttack").text();
        var playerCrit = $("#playerCrit").text();
        var minionDefense = $("#minionDefense").text();
        var minionHealth = $("#minionHealth").text();
        var minionEvade = $("#minionEvade").text();
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
            connection.send(party); // JSON.stringify(party) cambio aquí a party para ver que pasa
            console.log(party);
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
                $('#minionHealth').text(server_message);
                $('#output').prepend("<p class='playerText'>El ataque hace " + (minionHealth - server_message) + " puntos de daño</p>");
            }
            //si muere
            if (server_message < '1') {
                $('#minionHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });
    $("#orcAttack").click(function(e) {
        var name = $("#minionName").text();
        var minionAttack = $("#minionAttack").text();
        var minionCrit = $("#minionCrit").text();
        var playerDefense = $("#playerDefense").text();
        var playerHealth = $("#playerHealth").text();
        var playerEvade = $("#playerEvade").text();
        message = {
            'type': 'minionAttack',
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
                $('#playerHealth').text(server_message);
                $('#output').prepend("<p class='minionText'>El ataque hace " + (playerHealth - server_message) + " puntos de daño</p>");
            }
            //si muere
            if (server_message < '1') {
                $('#playerHealth').text("R.I.P");
            }
        }
        e.preventDefault();

    });

});