# -*- coding: utf-8 -*-

from random import randint

def battleLogic(message):
    '''The idea is to check here what happend in the battle.
    message input is a dictionary that contains:
        1) Dict of lists ('party') and Dict of lists ('enemies')
            - Both contain a list of characters (heroes/minions).
            - Every character having:
            'name'
            'profession':
            'attack':
            'defense':
            'crit':
            'evade':
            'role':
            'health'
            'status' (dict contain:)
                'evade'
                'defended'
                'dead'
                'crit'
                'stun'
    The program sets the functions that will help to develop the
    game logic. Then, it checks in order:
        1) For every minion that is a target
        2) If the enemy it's alive.
        3) If the enemy doesn't evade.
        4) Check who the attacker is
        5) If it's not a mage check the enemy defense
        6) Else, check if it does critical damage
        7) Do the actual damage
        8) reset roles to none
        9) Return the message with the health of the enemy and the
        status values changed. '''
    # Diccionaries:
    party = message.get("party")
    minions = message.get("enemies")

    # Main functions used for battle logic
    def dead(health):
        ''' Checks death conditions'''
        if health <= 0:
            return True
        elif health == 'R.I.P:':
            return True
        else:
            return False

    def evaded(evade):
        ''' Checks if the evade succeeded '''
        if randint(1, 100) <= evade:
            return True
        else:
            return False

    def defended(attack, defense):
        ''' Checks if the minion's defense is larger than the attackers attack
        thus defending himself'''
        if attack <= defense:
            return True
        else:
            return False

    def critic(crit):
        ''' Checks if the ataker got a critical hit'''
        if randint(1, 100) <= crit:
            return True
        else:
            return False

    def melee_attack(health, attack, defense, crit):
        ''' imprime datos en el serverLog sobre la acción de pelea
        Checks if there was a critical and if so multiplies the dmg,
        reducting form it the defenses of the enemy'''
        if crit is False:
            newHealth = health - (attack - defense)
        elif crit is True:
            newHealth = health - (abs((attack * 1.3)) - defense)
        return newHealth

    def mage_attack(attack, health, crit):
        "Chek if there was a critical and if so, multiplies the dmg"
        if crit is False:
            newHealth = health - attack
        elif crit is True:
            newHealth = health - (attack * 1.3)
        return newHealth

    def resetRole(character):
        ''' Resets the characters role so that it
        won't attack or recieve attack the next turn'''

        character['role'] = None

    # Esta funcion no me sirve aqui (la use y no deja que en el
    # jQuery se evaluen las condiciones, le dejo como vestigial
    def resetStatuses(character):
        ''' resetea los statuses de los charcters para que no se
        repitan en el siguiente turno'''
        for item in character['status']:
            character['status'][item] = False

    # Main battle logic goes here:
    def partyAttack(party, minions):
        print "**************"
        print "Players Attack!"
        print "**************"
        for index, minion in enumerate(minions):
            name = minions[index].get('name')
            defense = int(minions[index].get('defense'))
            evade = int(minions[index].get('evade'))
            health = int(minions[index].get('health'))
            if minions[index].get('role') == 'target':
                if dead(health) is True:
                    minions[index]['status']['dead'] = True
                    print "%s ya esta muerto." % (name)
                elif evaded(evade) is True:
                    minions[index]['status']['evade'] = True
                    print "%s ha logrado evadir el ataque." % (name)
                else:
                    for i, hero in enumerate(party):
                        if party[i].get('role') == 'attacker':
                            char = party[i].get('name')
                            print "%s sera quien ataque" % (char)
                            print "%s sera el target" % (name)
                            #print "Su defensa es %s" % (defense)
                            #print "Su probabiliadd de evadir: %s" % (evade)
                            #print "Su vida: %s " % (health)
                            attack = int(party[i].get('attack'))
                            #print "Su ataque es de: %s" % (attack)
                            crit = int(party[i].get('crit'))
                            #print "Su probabilidad de hacer critico es: %s " % (crit)
                            if party[i].get('profession') != 'Mage':
                                if defended(attack, defense) is True:
                                    minions[index]['status']['defended'] = True
                                    print "%s ha logrado bloquear el ataque de %s" % (name, char)
                            else:
                                pass
                            critStatus = critic(crit)
                            party[i]['status']['crit'] = critStatus
                            if critStatus is True:
                                print "Hizo un ataque critico!"
                            if party[i].get('profession') != 'Mage':
                                tempHealth = melee_attack(
                                    health, attack, defense, critStatus)
                            else:
                                tempHealth = mage_attack(
                                    attack, health, critStatus)
                            minions[index]['health'] = tempHealth
                            print "%s tenia %s de vida, ahora solo tiene: %s por culpa de %s" % (name, health, minions[index].get('health'), char)
                            if dead(tempHealth) is True:
                                minions[index]['status']['dead'] = True
                                print "%s  ha muerto." % (name)
            print "*********"
            print ''
    
    def minionAttack(party, minions):
        print "**************"
        print "Minions Attack!"
        print "**************"
        for t, target in enumerate(minions):
            temp = 0
            if minions[t].get('role') == 'target':
                resetRole(minions[t])
                print "%s tiene el role de: %s " % (minions[t].get('name'), minions[t].get('role'))
        print temp
        index = randint(0, 2)
        while party[index].get('dead') is True:
            index = (index + 1) % 3
        name = party[index].get('name')
        defense = int(party[index].get('defense'))
        evade = int(party[index].get('evade'))
        health = int(party[index].get('health'))
        if dead(health) is True:
            party[index]['status']['dead'] = True
            print "%s ya esta muerto." % (name)
        else:
            if evaded(evade) is True:
                party[index]['status']['evade'] = True
                print "%s ha logrado evadir el ataque." % (name)
            else:
                i = randint(0, 2)
                # resetea el rol del enemigo
                #para q no vuelva a ser atacado el sgte turno
                resetRole(minions[i])
                char = minions[i].get('name')
                print "%s sera quien ataque" % (char)
                print "%s sera el target" % (name)
                #print "Su defensa es %s" % (defense)
                #print "Su probabiliadd de evadir: %s" % (evade)
                #print "Su vida: %s " % (health)
                attack = int(minions[i].get('attack'))
                #print "Su ataque es de: %s" % (attack)
                crit = int(minions[i].get('crit'))
                #print "Su probabilidad de hacer critico es: %s " % (crit)
                if minions[i].get('profession') != 'Mage':
                    if defended(attack, defense) is True:
                        party[index]['status']['defended'] = True
                        print "%s ha logrado bloquear el ataque de %s" % (name, char)
                else:
                    pass
                critStatus = critic(crit)
                minions[i]['status']['crit'] = critStatus
                if critStatus is True:
                    print "Hizo un ataque critico!"
                tempHealth = melee_attack(
                    health, attack, defense, critStatus)
                party[index]['health'] = tempHealth
                print "%s tenia %s de vida, ahora solo tiene: %s por culpa de %s" % (name, health, party[index].get('health'), char)
                if dead(tempHealth) is True:
                    party[index]['status']['dead'] = True
                    print "%s  ha muerto." % (name)
                print "*********"
                print ''

    #Llamamos las dos principales funciones:
    partyAttack(party, minions)
    minionAttack(party, minions)
    
    #ResetRole
    for i, hero in enumerate(party):
        resetRole(party[i])
    return message


if __name__ == '__main__':
    battleLogic()
