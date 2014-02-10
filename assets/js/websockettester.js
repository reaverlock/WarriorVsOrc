// assets/js/websockettester.js

// initialize global variables

var KEY_SERVER_URI = "ws://localhost:8888";
var connection;
//party completa que se enviará
var allCharacters = {
    "party": [],
    "enemies": [],
    "status": {
        "evade": false,
        "stun": false,
        "crit": false,
        "defended": false,
        "dead": false
    }
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

    //carga array de personajes
    $('.player').each(function() {
        var name = $(this).find('.name').text();
        var characterProfession = $(this).find('.profession').text();
        var characterHealth = $(this).find('.playerHealth').text();
        var characterAttack = $(this).find('.playerAttack').text();
        var characterDefense = $(this).find('.playerDefense').text();
        var characterCrit = $(this).find('.playerCrit').text();
        var characterEvade = $(this).find('.playerEvade').text();
        allCharacters.party.push({
            "name": name,
            "profession": characterProfession,
            "health": characterHealth,
            "attack": characterAttack,
            "defense": characterDefense,
            "evade": characterEvade,
            "crit": characterCrit,
            "role": 'None'
        });
    });

    // carga array de malos
    $('.minion').each(function() {
        var name = $(this).find('.name').text();
        var characterProfession = $(this).find('.race').text();
        var characterHealth = $(this).find('.minionHealth').text();
        var characterAttack = $(this).find('.minionAttack').text();
        var characterDefense = $(this).find('.minionDefense').text();
        var characterCrit = $(this).find('.minionCrit').text();
        var characterEvade = $(this).find('.minionEvade').text();
        allCharacters.enemies.push({
            "name": name,
            "profession": characterProfession,
            "health": characterHealth,
            "attack": characterAttack,
            "defense": characterDefense,
            "evade": characterEvade,
            "crit": characterCrit,
            "role": 'None'
        });
    });

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

    // funcion de boton genérica para todos
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


    });

});