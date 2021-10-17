const path = require('path');
const express = require('express');
const chalk = require("chalk");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require("compression");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {pingInterval: 10000, pingTimeout: 5000,});

module.exports = {io, server};

const {endpoints} = require("./data/http.js");
const {lauchWebsocketServer} = require("./data/ws.js");

const publicPath = path.join(__dirname, '..', 'build');
const port = process.env.PORT || 3001;

app.use(compression());
app.use(express.static(publicPath));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet())

lauchWebsocketServer();

app.use(endpoints);

server.listen(port, () => {
  console.log(chalk.green(`>>>> Server is live on port ${port}`));
  require("./data/utils/dbconnect.js")();
});

app.get(['/sitemap.xml', '/sitemap'], (req, res) => {
  const file = path.join(publicPath, 'sitemap.xml');
  res.sendFile(file);
});

app.get(['/robots.txt', '/robots'], (req, res) => {
  const file = path.join(publicPath, 'robots.txt');
  res.sendFile(file);
});

app.get('/*', (req, res) => {
  const file = path.join(publicPath, 'index.html');
  res.sendFile(file);
});