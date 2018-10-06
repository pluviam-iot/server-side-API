const PORT = 3501;

const net = require('net');
const database = require('../models/database.js');

class SocketServer {
  constructor() {
    this.socket = net.createServer((socket) => this.init(socket));
  }

  init(socket) {
    socket.on('data', (data) => this.data(data));
    this.socket = socket;
  }

  data(data) {
    const value = data.toString();
    this.log(`Receive new message: ${value}`);
    const weather = value.split('\n');
    const stationId = weather[0];
    weather.splice(0, 1);
    database.addBulkWeather(stationId, null, {
      headers: 'temperature;humidity;pressure;precipitation;windDirection;windSpeed;battery',
      data: weather
    }, (error) => {
      if (error) {
        this.socket.write('NACK');
      } else {
        this.socket.write('ACK');
      }
    });
  }

  start() {
    this.socket.listen(PORT, '0.0.0.0');
    this.log(`Listening on 0.0.0.0:${PORT}`)
  }

  log(message) {
    console.log(`[SocketServer ${new Date()}] ${message}`)
  }

}

module.exports = {
	SocketServer
};
