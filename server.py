#!/usr/bin/python

import tornado.web
import tornado.websocket
import tornado.ioloop
# import ast # data = ast.literal_eval(message)
from tornado.escape import json_decode, json_encode

from battleLogic import battleLogic


class WebSocketHandler(tornado.websocket.WebSocketHandler):

    def open(self):
        print "New client connected"
        self.write_message("You are connected")

    def on_close(self):
        print "Client disconnected"

    def on_message(self, message):
        #print 'mensaje recibido: '
        #print message
        temp = json_decode(message)
        message = json_encode(battleLogic(temp))
        self.write_message(message)

application = tornado.web.Application([
    (r"/", WebSocketHandler),

])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
