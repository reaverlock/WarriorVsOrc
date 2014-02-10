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
        2) Dict of statuses ('status')
            - Contains:
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
    status = message.get("status")

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
        if crit is False:
            newHealth = health - (attack - defense)
            return newHealth
        elif crit is True:
            newHealth = health - (attack - defense) * 2

    # Main battle logic goes here:
    for index, minion in enumerate(minions):
        defense = int(minions[index].get('defense'))
        evade = int(minions[index].get('evade'))
        health = int(minions[index].get('health'))
        if minion.get('rol') == 'target':
            if dead(health) is True:
                status['dead'] = True
            elif evaded(evade) is True:
                status['evade'] = True
            else:
                for hero in party:
                    if hero.get('rol') == 'attacker':
                        attack = int(hero.get('attack'))
                        crit = int(hero.get('crit'))
                        if hero.get('profession') != 'Mage':
                            if defended(attack, defense) is True:
                                status['defended'] = True
                        else:
                            pass
                        critStatus = critic(crit)
                        status['crit'] = critStatus
                        minions[index]['health'] = damaged(
                            health, attack, defense, critStatus)
    return message


if __name__ == '__main__':
    battleLogic()
