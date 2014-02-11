// assets/js/websockettester.js

// initialize global variables

var KEY_SERVER_URI = "ws://localhost:8888";
var connection;
//party completa que se enviará
var allCharacters = {
    "party": [],
    "enemies": [],

}


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

    //carga arrays
    loadStartingArrays(allCharacters);

    // selector de enemigo (solo permite uno)
    $('.minion').on('click', function() {
        if ($('#minions').find('.selected').length == 0) {
            $(this).toggleClass('selected');
        } else if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
    });

    // selector de player (solo permite uno)
    $('.player').on('click', function() {
        if ($('#party').find('.selected').length == 0) {
            $(this).toggleClass('selected');
        } else if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
    });

    // funcion de boton Ataque
    $('#attack').on('click', function(e) {
        var attacker;
        var target;

        // busca quienes hay seleccionados en ambas columnas y determina su posición en el array
        if ($('#party').find('.selected')) {
            attacker = $('#party').find('.selected').index() - 1; //'-1' x q index tira numeros ordinales
        }
        if ($('#minions').find('.selected')) {
            target = $('#minions').find('.selected').index() - 1; //'-1' x q index tira numeros ordinales
        }
        //Modifica los valores de roles
        allCharacters.party[attacker].role = 'attacker';
        if (allCharacters.party[attacker].profession == 'Mage') {
            for (var i = 0; i < allCharacters.enemies.length; i++) {
                allCharacters.enemies[i].role = 'target';
            }
        } else {
            allCharacters.enemies[target].role = 'target';
        }

        var message = allCharacters;
        connection.send(JSON.stringify(message)); // JSON.stringify(party) cambio aquí a party para ver que pasa
        console.log(JSON.stringify(message));

        // corregir esto para que reciba los mensajes adecuados
        // mensaje regresado x el server
        connection.onmessage = function(e) {
            var server_message = JSON.parse(e.data);
            console.log("recibí esto del server: ");
            console.log(server_message);

            var party = server_message.party;
            var enemies = server_message.enemies;
            // actualiza personajes
            characterAttacked(party);
            //actualiza enemigos
            enemiesAttacked(enemies);

        }
        e.preventDefault();

    });

});