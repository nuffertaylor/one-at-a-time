import http.server

def getCurrentUser():
  return "johnny"

class Handler(http.server.SimpleHTTPRequestHandler) :
  def do_GET(s):
    if s.path == "/inUse":
      msg = getCurrentUser()
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