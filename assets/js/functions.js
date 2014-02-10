/***** 
Carga los valores iniciales de los 
elementos en web dentro del JSON inicial 
********/
function loadStartingArrays(allCharactersArray) {
    //carga array de personajes
    $('.player').each(function() {
        var name = $(this).find('.name').text();
        var characterProfession = $(this).find('.profession').text();
        var characterHealth = $(this).find('.playerHealth').text();
        var characterAttack = $(this).find('.playerAttack').text();
        var characterDefense = $(this).find('.playerDefense').text();
        var characterCrit = $(this).find('.playerCrit').text();
        var characterEvade = $(this).find('.playerEvade').text();
        allCharactersArray.party.push({
            "name": name,
            "profession": characterProfession,
            "health": characterHealth,
            "attack": characterAttack,
            "defense": characterDefense,
            "evade": characterEvade,
            "crit": characterCrit,
            "role": 'None',
            "status": {
                "evade": false,
                "stun": false,
                "crit": false,
                "defended": false,
                "dead": false
            }
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
        allCharactersArray.enemies.push({
            "name": name,
            "profession": characterProfession,
            "health": characterHealth,
            "attack": characterAttack,
            "defense": characterDefense,
            "evade": characterEvade,
            "crit": characterCrit,
            "role": 'None',
            "status": {
                "evade": false,
                "stun": false,
                "crit": false,
                "defended": false,
                "dead": false
            }
        });
    });
}

/***
Evalua datos de los personajes buenos y los actualiza 
además de imprimir su estadoo en la consola 
***/
function characterAttacked(partyArray) {
    for (var i = 0; i < partyArray.length; i++) {
        // chequea todos los players de la web
        $('.player').each(function() {
            // si el nombre coincide con alguno
            if (partyArray[i].name == $(this).find('.name').text()) {
                // chequear cada condición
                // si esquiva da ese mensaje
                if (partyArray[i].status.evade == true) {
                    $('#outputText').prepend('<p class="playerText evadeText">' + partyArray[i].name + ' esquivó el ataque</p>');
                } else if (partyArray[i].status.stun == true) {
                    $('#outputText').prepend('<p class="playerText stunText">' + partyArray[i].name + ' fue aturdido por el ataque</p>');
                } else if (partyArray[i].status.crit == true) {
                    $('#outputText').prepend('<p class="playerText critText">' + partyArray[i].name + ' recibe un critico de daño </p>');
                } else if (partyArray[i].status.defended == true) {
                    $('#outputText').prepend('<p class="playerText defendedText">' + partyArray[i].name + ' se defiende del ataque </p>');
                } else if (partyArray[i].status.dead == true) {
                    $('#outputText').prepend('<p class="playerText stunText">' + partyArray[i].name + ' ha muerto </p>');
                    $(this).find('.playerHealth').text('R.I.P');
                }
            }
        });
    }
}

/***
Evalua datos de los MINIONS y los actualiza 
además de imprimir su estadoo en la consola 
***/
function enemiesAttacked(enemiesArray) {
    for (var i = 0; i < enemiesArray.length; i++) {
        // chequea todos los players de la web
        $('.minion').each(function() {
            // si el nombre coincide con alguno
            if (enemiesArray[i].name == $(this).find('.name').text()) {
                // chequear cada condición
                if (enemiesArray[i].status.evade == true) {
                    $('#outputText').prepend('<p class="minionText evadeText">' + enemiesArray[i].name + ' esquivó el ataque</p>');
                } else if (enemiesArray[i].status.stun == true) {
                    $('#outputText').prepend('<p class="minionText stunText">' + enemiesArray[i].name + ' fue aturdido por el ataque</p>');
                } else if (enemiesArray[i].status.crit == true) {
                    $('#outputText').prepend('<p class="minionText critText">' + enemiesArray[i].name + ' recibe un critico de daño </p>');
                } else if (enemiesArray[i].status.defended == true) {
                    $('#outputText').prepend('<p class="minionText defendedText">' + enemiesArray[i].name + ' se defiende del ataque </p>');
                } else if (enemiesArray[i].status.dead == true) {
                    $('#outputText').prepend('<p class="minionText stunText">' + enemiesArray[i].name + ' ha muerto </p>');
                    $(this).find('.minionHealth').text('R.I.P');
                }
            }
        });
    }
}