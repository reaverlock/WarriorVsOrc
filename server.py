#!/usr/bin/python

import tornado.web
import tornado.websocket
import tornado.ioloop
# import ast # data = ast.literal_eval(message)

from tornado.escape import json_decode, json_encode
from random import randint


class WebSocketHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print "New client connected"
        self.write_message("You are connected")

    def on_close(self):
        print "Client disconnected"

    def on_message(self, message):
        print 'mensaje recibido: '
        print message
        objeto = json_decode(message)
        print objeto
        buenos = objeto.get("party")
        malos = objeto.get("enemies")
        for index, personaje in enumerate(buenos):
            try:
                if personaje.get('profession') == "Warrior":
                    attack = int(buenos[index].get('attack'))
                    defense = int(malos[0].get('defense'))
                    evade = int(malos[0].get('evade'))
                    health = int(malos[0].get('health'))
                    if randint(1, 100) <= evade:
                        message = 'El objetivo esquivo'
                        self.write_message(message)
                    elif attack > defense:
                        newHealth = health - (attack - defense)
                        malos[0]['health'] = newHealth
                        message = json_encode(objeto)
                        print 'mensaje enviado: '
                        print message
                        self.write_message(message)

            except ValueError:
                message = 'No funciono el ataque'
                self.write_message(message)


application = tornado.web.Application([
    (r"/", WebSocketHandler),

])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
