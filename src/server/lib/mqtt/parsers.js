const logger = require('../logger');
const topics = require('./topics');
const db = require('../db');
const {
  updateDeviceOnlineStatus,
  updateDeviceState,
  updateRoomHeating,
  updateDeviceTelemetryData,
  updateReport,
  getSensorReadings,
} = require('../main');
const { turnOnDeskLampIfNeeded } = require('../actions');

const parsers = {
  [topics.heaterPanel.stat]: async (payload) => {
    await updateDeviceState('heaterPanel', payload);
  },

  [topics.heaterPanel.lwt]: async (payload) => {
    await updateDeviceOnlineStatus('heaterPanel', payload);
  },

  [topics.deskLamp.stat]: async (payload) => {
    await updateDeviceState('deskLamp', payload);
  },

  [topics.bathroomHeaterPanel.stat]: async (payload) => {
    await updateDeviceState('bathroomHeaterPanel', payload);
  },

  [topics.mobileHeater.stat]: async (payload) => {
    await updateDeviceState('mobileHeater', payload);
  },

  [topics.mobileHeater.tele]: async (payload) => {
    await updateDeviceTelemetryData('mobileHeater', payload);
  },

  [topics.heaterPanel.sensor]: async (payload) => {
    const data = JSON.parse(payload.toString());
    const SI7021 = getSensorReadings(data, 'SI7021');

    if (!SI7021) {
      return logger.error('Sensor SI7021 not found!');
    }

    const readings = { SI7021 };

    logger.debug('Saving heater sensor readings', readings);

    await db.setSensorData('heaterPanel', readings);
    await updateRoomHeating('smallRoom');
    await updateRoomHeating('bathRoom');
    await updateReport();
  },

  [topics.wemos1.sensor]: async (payload) => {
    const data = JSON.parse(payload.toString());
    const AM2301 = getSensorReadings(data, 'AM2301');
    const BH1750 = getSensorReadings(data, 'BH1750');
    const IAQ = data.IAQ;

    if (!AM2301) {
      logger.error('Sensor AM2301 not found!');
    }
    if (!BH1750) {
      logger.error('Sensor BH1750 not found!');
    }
    if (!IAQ) {
      logger.error('Sensor IAQ not found!');
    }

    const readings = { AM2301, BH1750, IAQ };

    logger.debug('Saving sensor readings', readings);

    await db.setSensorData('wemos1', readings);
    await updateRoomHeating('livingRoom');
    await updateReport();
  },

  [topics.nodemcu1.sensor]: async (payload) => {
    const data = JSON.parse(payload.toString());
    const AM2301 = getSensorReadings(data, 'AM2301');
    const analogReadings = data.ADS1115;

    if (!AM2301) {
      logger.error('Sensor AM2301 not found!');
    }
    if (!analogReadings) {
      logger.error('ADS1115 not found!');
    }

    const volts0 = (analogReadings.A0 * 0.1875) / 1000;
    const volts1 = (analogReadings.A1 * 0.1875) / 1000;
    const readings = {
      AM2301,
      MQ135: {
        volts: volts0,
        airQuality: 100 - Math.round((100 * volts0) / 5),
        lastUpdate: Date.now(),
      },
      SOIL: {
        volts: volts1,
        value: 100 - Math.round((100 * volts1) / 3.3), // resistive value
        lastUpdate: Date.now(),
      },
    };

    logger.debug('Saving sensor readings', readings);

    await db.setSensorData('nodemcu1', readings);
    await updateRoomHeating('bigRoom');
    await updateReport();
  },

  [topics.wemos1.switch1]: async (payload) => {
    await updateDeviceState('wemos1.switch1', payload);
    await turnOnDeskLampIfNeeded();
    await updateReport();
  },

  [topics.wemos1.switch2]: async (payload) => {
    await updateDeviceState('wemos1.switch2', payload);
    await turnOnDeskLampIfNeeded();
    await updateReport();
  },

  [topics.garden.sensor]: async (payload) => {
    const data = JSON.parse(payload.toString());
    const AM2301 = getSensorReadings(data, 'AM2301');
    const APDS9960 = getSensorReadings(data, 'APDS9960');
    const analogValue = data.ANALOG && data.ANALOG.A0;

    if (!AM2301) {
      logger.warn('Sensor AM2301 not found!');
    }
    if (!APDS9960) {
      logger.warn('Sensor APDS9960 not found!');
    }

    const readings = {
      AM2301,
      APDS9960,
      ANALOG: {
        value: analogValue,
        lastUpdate: Date.now(),
      },
    };

    logger.debug('Saving sensor readings', readings);

    await db.setSensorData('garden', readings);
    await updateReport();
  },
};

module.exports = parsers;
