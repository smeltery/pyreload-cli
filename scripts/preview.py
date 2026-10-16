"""Serve the static export with real 404 status codes."""

import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "website" / "out"
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("PORT", "3014"))), handler).serve_forever()
