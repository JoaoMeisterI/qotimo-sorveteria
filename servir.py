"""Servidor de preview do site.

Igual ao `python -m http.server`, mas manda `Cache-Control: no-store` em
tudo. Durante a revisao isso evita o caso em que o navegador continua
mostrando o CSS antigo depois de uma alteracao.

Uso:  python servir.py [porta]
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class SemCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 5510
    handler = partial(SemCache, directory="site")
    with ThreadingHTTPServer(("127.0.0.1", porta), handler) as s:
        print(f"Qotimo em http://127.0.0.1:{porta}  (sem cache)")
        try:
            s.serve_forever()
        except KeyboardInterrupt:
            print("\nencerrado")


if __name__ == "__main__":
    main()
