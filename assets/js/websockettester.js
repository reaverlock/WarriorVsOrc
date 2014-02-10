// assets/js/websockettester.js

// initialize global variables

var KEY_SERVER_URI = "ws://localhost:8888";
var connection;
//party completa que se enviará
var allCharacters = {
    "party": [],
    "enemies": []
}

//esta es solo para probar, debe ser borrada

var pruebaParty = {
    "buenos": [{
        "profession": "warrior",
        "name": "Pedrito",
        "type": "warriorAttack",
        "attack": 120,
        "defense": 80,
        "health": 150,
        "evade": 5,
        "crit": 5,
        "status": "none"
    }, {
        "profession": "mage",
        "name": "esencito",
        "type": "mageAttack",
        "attack": 30,
        "defense": 50,
        "health": 20,
        "evade": 30,
        "crit": 5,
        "status": "none"
    }],
    "malos": [{
        "profession": "rogue",
        "name": "Orquito",
        "type": "minionAttack",
        "attack": 100,
        "defense": 80,
        "health": 120,
        "evade": 5,
        "crit": 5,
        "status": "none"
    }, {
        "profession": "minionazo",
        "name": "Simurito",
        "type": "enemyAttack",
        "attack": 100,
        "defense": 80,
        "health": 150,
        "evade": 5,
        "crit": 5,
        "status": "none"
    }]
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

    function buttonClick(event, attackerName, attackerAttack, attackerCritical, oponentDefense, oponentHealth, oponentEvade, oponentName) {

    }

    // selector de enemigo (solo permite uno)
    $('.minion').on('click', function() {
        if ($('#minions').find('.selected').length == 0) {
            $(this).toggleClass('selected');
        } else if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
    });

    // funcion de boton genérica para todos
    $('button').on('click', function(e) {
        if ($(this).hasClass('btn') != true) {
            // definimos variables a pasar
            var name = $(this).closest('.player').children('.name').text();
            var characterProfession = $(this).next().find('.profession').text();
            var characterAttack = $(this).next().find('.playerAttack').text();
            var minionDefense = $('#minions').find('.selected').find('.minionDefense').text();
            var minionHealth = $('#minions').find('.selected').find('.minionHealth').text();
            var minionEvade = $('#minions').find('.selected').find('.minionEvade').text();
            // agregamos variables al array de buenos
            allCharacters.party.push({
                "name": name,
                "profession": characterProfession,
                "attack": characterAttack
            });
            // agregamos variables alarray de malos
            allCharacters.enemies.push({
                "name": "prueba orco",
                "defense": minionDefense,
                "health": minionHealth,
                "evade": minionEvade
            });
            console.log(allCharacters);
            var message = allCharacters;
            if (message.enemies.health == 'R.I.P') {
                $("<p class='deadText'>El oponente ya está muerto</p>").prependTo("#output");
            } else {
                connection.send(JSON.stringify(message)); // JSON.stringify(party) cambio aquí a party para ver que pasa
                console.log(JSON.stringify(message));
            }

            // mensaje regresado x el server
            connection.onmessage = function(e) {
                var server_message = JSON.parse(e.data);
                console.log("recibí esto del server: ");
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
        }

    });

});