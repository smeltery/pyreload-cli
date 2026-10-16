"""Serve the static export with real 404 status codes."""

import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "website" / "out"


class PreviewHandler(SimpleHTTPRequestHandler):
    """Match static hosting's branded missing-page response."""

    def send_error(self, code, message=None, explain=None):
        page = root / "404.html"
        if code != 404 or not page.exists():
            return super().send_error(code, message, explain)
        content = page.read_bytes()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(content)


handler = partial(PreviewHandler, directory=str(root))
ThreadingHTTPServer(("127.0.0.1", int(os.environ.get("PORT", "3014"))), handler).serve_forever()
