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
            'rol':
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
        8) Return the message with the health of the enemy and the 
        status values changed. '''
    # Diccionaries:
    party = message.get("party")
    minions = message.get("enemies")

    # Main functions used for battle logic
    def dead(health):
        if health == 0:
            return True
        else:
            return False

    def evaded(evade):
        if randint(1, 100) <= evade:
            return True
        else:
            return False

    def defended(attack, defense):
        if attack <= defense:
            return True
        else:
            return False

    def critic(crit):
        if randint(1, 100) <= crit:
            return True
        else:
            return False

    def damaged(health, attack, defense, crit):
        print "La vida : %s, el ataque: %s, la defensa: %s, (critico:%s)" % (health, attack, defense, crit)
        if crit is False:
            newHealth = health - (attack - defense)
        elif crit is True:
            newHealth = health - ((attack * 2) - defense)
        return newHealth

    # Main battle logic goes here:
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
                        print "%s) %s sera quien ataque" % (i, char)
                        print "%s) %s sera el target" % (index, name)
                        print "Su defensa es %s" % (defense)
                        print "Su probabiliadd de evadir: %s" % (evade)
                        print "Su vida: %s " % (health)
                        attack = int(party[i].get('attack'))
                        print "Su ataque es de: %s" % (attack)
                        crit = int(party[i].get('crit'))
                        print "Su probabilidad de hacer critico es: %s " % (crit)
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
                        tempHealth = damaged(
                            health, attack, defense, critStatus)
                        minions[index]['health'] = tempHealth
                        print "%s ha perdido %s puntos de vida a manos de %s" % (name, (health - minions[index].get('health')), char)
    return message

if __name__ == '__main__':
    battleLogic()
