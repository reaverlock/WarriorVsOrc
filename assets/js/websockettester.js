// assets/js/websockettester.js

// initialize global variables

var KEY_SERVER_URI = "ws://localhost:8888";
var connection;
//party completa que se enviará
var allCharacters = {
    "party": [],
    "enemies": []
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
            var minionName = $('#minions').find('.selected').closest('.minion').children('.name').text();
            if (allCharacters.party.indexOf(name) == -1) {
                // agregamos variables al array de buenos
                allCharacters.party.push({
                    "name": name,
                    "profession": characterProfession,
                    "attack": characterAttack
                });
            }
            if (allCharacters.enemies.indexOf(minionName) == -1) {
                // agregamos variables alarray de malos
                allCharacters.enemies.push({
                    "name": minionName,
                    "defense": minionDefense,
                    "health": minionHealth,
                    "evade": minionEvade
                });
            }



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
                    $('#minions').find('.selected').find('.minionHealth').text(server_message.enemies[0].health);;
                    $('#output').prepend("<p class='playerText'>Pedrito ataca a Esen por " + (minionHealth - parseInt(server_message.enemies[0].health)) + " puntos de daño</p>");
                }
                server_message.enemies.splice(0, server_message.enemies.length);
                server_message.party.splice(0, server_message.party.length);
                //si muere
                if (server_message < '1') {
                    $('#orcHealth').text("R.I.P");
                }
            }
            e.preventDefault();
        }

    });

});