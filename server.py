#!/usr/bin/env python3
import http.server
import time
import json
import urllib
from tinydb import TinyDB, Query
db = TinyDB('db.json')

def getCurrentUser():
  user = Query()
  res = db.search(user.using == True)
  if len(res) == 1:
    return res[0]
  elif len(res) > 1:
    mostRecent = res[0]
    for r in res:
      if r["timestamp"] > mostRecent["timestamp"]:
        mostRecent = r
    return mostRecent
  else:
    return {}

class Handler(http.server.SimpleHTTPRequestHandler) :
  def do_GET(s):
    if s.path == "/inUse":
      msg = json.dumps(getCurrentUser())
      s.protocol_version = "HTTP/1.1"
      s.send_response(200)
      s.send_header("Content-Length", len(msg))
      s.end_headers()
      s.wfile.write(bytes(msg, "utf8"))

    if "/startUsing" in s.path:
      db.update({"using" : False}) #just make everyone else not use it
      q = urllib.parse.urlparse(s.path).query
      z = urllib.parse.parse_qsl(q)
      name = ""
      cookie = ""
      for x in z:
        if(x[0] == "name"):
          name = x[1]
        elif(x[0] == "cookie"):
          cookie = x[1]
      db.insert({"name" : name, "using" : True, "timestamp" : int(time.time()), "cookie" : cookie})
      msg = json.dumps(getCurrentUser())
      s.protocol_version = "HTTP/1.1"
      s.send_response(200)
      s.send_header("Content-Length", len(msg))
      s.end_headers()
      s.wfile.write(bytes(msg, "utf8"))

    if s.path == "/stopUsing":
      db.update({"using" : False})
      msg = json.dumps(getCurrentUser())
      s.protocol_version = "HTTP/1.1"
      s.send_response(200)
      s.send_header("Content-Length", len(msg))
      s.end_headers()
      s.wfile.write(bytes(msg, "utf8"))

    else:
      print('-----------------------')
      print('GET %s (from client %s)' % (s.path, s.client_address))
      print(s.headers)
      super(Handler, s).do_GET() #inherited do_GET serves dirs&files.
      

s = http.server.HTTPServer( ('', 8080), Handler )
s.serve_forever()