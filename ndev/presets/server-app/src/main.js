import { createServer } from 'http'

const HOSTNAME = 'localhost'
const PORT = 3000

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(HOSTNAME, PORT, () => {
  console.log(`🌎 Server running at http://${HOSTNAME}:${PORT}`);
});
