export const devices = {
  heaterPanel: {
    topics: {
      power: 'cmnd/sonoff-heater-panel/power',
      status: 'stat/sonoff-heater-panel/POWER',
      tele: 'tele/sonoff-heater-panel/STATE',
      lwt: 'tele/sonoff-heater-panel/LWT',
    },
    ipAddress: '192.168.0.30',
    power: null,
    online: null,
  },
  saltLamp: {
    topics: {
      power: 'cmnd/sonoff-salt-lamp/power',
      status: 'stat/sonoff-salt-lamp/POWER',
      tele: 'tele/sonoff-salt-lamp/STATE',
      lwt: 'tele/sonoff-salt-lamp/LWT',
    },
    ipAddress: '192.168.0.14',
    power: null,
    online: null,
  },
  flameLamp: {
    topics: {
      power: 'cmnd/sonoff-flame-lamp/power',
      status: 'stat/sonoff-flame-lamp/POWER',
      tele: 'tele/sonoff-flame-lamp/STATE',
      lwt: 'tele/sonoff-flame-lamp/LWT',
    },
    ipAddress: '192.168.0.17',
    power: null,
    online: null,
  },
  heaterLight: {
    topics: {
      power: 'cmnd/sonoff-heater-light/power',
      status: 'stat/sonoff-heater-light/POWER',
      tele: 'tele/sonoff-heater-light/STATE',
      lwt: 'tele/sonoff-heater-light/LWT',
    },
    ipAddress: '192.168.0.24',
    power: null,
    online: null,
  },
  mosquitoTrap1: {
    topics: {
      power: 'cmnd/sonoff-mosquito-trap/power',
      status: 'stat/sonoff-mosquito-trap/POWER',
      tele: 'tele/sonoff-mosquito-trap/STATE',
      lwt: 'tele/sonoff-mosquito-trap/LWT',
    },
    ipAddress: '192.168.0.15',
    power: null,
    online: null,
  },
  laundryLamp: {
    topics: {
      power: 'shellies/shelly-laundry-lamp/relay/0/command',
      status: 'shellies/shelly-laundry-lamp/relay/0',
      lwt: 'shellies/shelly-laundry-lamp/online',
      sensor: 'shellies/shelly-laundry-lamp/relay/0/power',
    },
    ipAddress: '192.168.0.13',
    power: null,
    online: null,
  },
  garageLamp: {
    topics: {
      power: 'shellies/shelly-garage-lamp/relay/1/command',
      status: 'shellies/shelly-garage-lamp/relay/1',
      sensor: 'shellies/shelly-garage-lamp/relay/1/power',
      lwt: 'shellies/shelly-garage-lamp/online',
    },
    ipAddress: '192.168.0.22',
    power: null,
    online: null,
  },
  poolPump: {
    topics: {
      power: 'cmnd/sonoff-pool-pump/power',
      status: 'stat/sonoff-pool-pump/POWER',
      sensor: 'tele/sonoff-pool-pump/SENSOR',
      tele: 'tele/sonoff-pool-pump/STATE',
      lwt: 'tele/sonoff-pool-pump/LWT',
    },
    ipAddress: '192.168.0.31',
    power: null,
    online: null,
  },
  mobileHeater: {
    topics: {
      power: 'cmnd/sonoff-mobile-heater/power',
      status: 'stat/sonoff-mobile-heater/POWER',
      sensor: 'tele/sonoff-mobile-heater/SENSOR',
      tele: 'tele/sonoff-mobile-heater/STATE',
      lwt: 'tele/sonoff-mobile-heater/LWT',
    },
    ipAddress: '192.168.0.34',
    power: null,
    online: null,
  },
  bathroom: {
    topics: {
      power: 'cmnd/sonoff-bathroom-heater/power',
      status: 'stat/sonoff-bathroom-heater/POWER',
      tele: 'tele/sonoff-bathroom-heater/STATE',
      lwt: 'tele/sonoff-bathroom-heater/LWT',
    },
    ipAddress: '192.168.0.33',
    power: null,
    online: null,
  },
  treeLight: {
    topics: {
      power: 'cmnd/wemos-garden/power',
      status: 'stat/wemos-garden/POWER',
      tele: 'tele/wemos-garden/STATE',
      lwt: 'tele/wemos-garden/LWT',
    },
    ipAddress: '192.168.0.29',
    power: null,
    online: null,
  },
  wellWaterPump: {
    topics: {
      power: 'shellies/shelly-water-pumps/relay/1/command',
      status: 'shellies/shelly-water-pumps/relay/1',
      sensor: 'shellies/shelly-water-pumps/relay/1/power',
      lwt: 'shellies/shelly-water-pumps/online',
    },
    ipAddress: '192.168.0.34',
    power: null,
    online: null,
  },
};
