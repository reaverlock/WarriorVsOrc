#!/usr/bin/python

import tornado.web
import tornado.websocket
import tornado.ioloop

from tornado.escape import json_decode  # , json_encode
from random import randint


class WebSocketHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print "New client connected"
        self.write_message("You are connected")

    def on_message(self, message):
        data = message
        json_decode(data)
        print data

        if data == str(data):
            print 'data es un string nada mas '
        
        # print data.get('buenos')
        try:
            if data == 'warriorAttack':
                attack = int(data.get('attack'))
                defense = int(data.get('defense'))
                evade = int(data.get('evade'))
                health = int(data.get('health'))
                if randint(1, 100) <= evade:
                    message = 'El objetivo esquivo'
                elif attack > defense:
                    message = str(health - (attack - defense))
            elif data.get('type') == 'minionAttack':
                attack = int(data.get('attack'))
                defense = int(data.get('defense'))
                evade = int(data.get('evade'))
                health = int(data.get('health'))
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
