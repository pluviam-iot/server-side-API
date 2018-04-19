const MAXIMUM_MS = 5 * 60 * 1000;

class StatusService {
  constructor(weather) {
    this.weather = weather;
  }

  getStatus() {
    let status = 'OFFLINE';

    if (this.weather) {
      const lastDate = new Date(this.weather.date).getTime(); 
      const differenceMs = Date.now() - lastDate;
      console.log(`Última atualização da estação foi a ${differenceMs / 1000 / 60} minutos`);
      if (differenceMs < MAXIMUM_MS) {
        status = 'ONLINE';
      }
    }

    return status;
  }
}

module.exports = StatusService;
