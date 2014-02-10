#!/usr/bin/python

import tornado.web
import tornado.websocket
import tornado.ioloop
#import ast

from tornado.escape import json_decode  # , json_encode
from random import randint


class WebSocketHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print "New client connected"
        self.write_message("You are connected")

    def on_message(self, message):
        # data = ast.literal_eval(message)

        objeto = json_decode(message)
        print objeto.get("buenos").get("primero").get("type")
        _type = objeto.get("buenos").get("primero").get("type")

        try:
            if _type == 'warriorAttack':
                attack = int(objeto.get("buenos").get("primero").get('attack'))
                defense = int(objeto.get("malos").get("primero").get('defense'))
                evade = int(objeto.get("malos").get("primero").get('evade'))
                health = int(objeto.get("malos").get("primero").get('health'))
                if randint(1, 100) <= evade:
                    message = 'El objetivo esquivo'
                elif attack > defense:
                    message = str(health - (attack - defense))
            elif _type == 'minionAttack':
                attack = int(objeto.get("malos").get("primero").get('attack'))
                defense = int(objeto.get("buenos").get("primero").get('defense'))
                evade = int(objeto.get("buenos").get("primero").get('evade'))
                health = int(objeto.get("buenos").get("primero").get('health'))
                if randint(1, 100) <= evade:
                    message = 'El objetivo esquivo'
                elif attack > defense:
                    message = str(health - (attack - defense))

            else:
                self.write_message("no iguale el data type")
        except ValueError:
            message = 'No funciono el ataque'
        self.write_message(message)

    def on_close(self):
        print "Client disconnected"


application = tornado.web.Application([
    (r"/", WebSocketHandler),

])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
