import React from 'react';
import { Link } from 'react-router-dom';

import TemperatureMeter from './TemperatureMeter';
import HumidityMeter from './HumidityMeter';
import Switcher from './Switcher';
// import SmartBulbControl from './SmartBulbControl';
import AutoSwitcher from './AutoSwitcher';
import Group from './Group';
import SensorMeter from './SensorMeter';
import IlluminanceMeter from './IlluminanceMeter';
import Sun from './Sun';
import StoreProvider from '../lib/store';

import styles from './Home.css';

export default class Home extends React.Component {
  render() {
    const state = this.context;

    return (
      <section className={styles.root}>
        {state.report && (
          <section className={styles.dashboard}>
            <Group place="bedroom">
              <TemperatureMeter
                title="Temp"
                value={state.report.room.AM2301.temperature}
                lastUpdate={state.report.room.AM2301.lastUpdate}
              />
              <HumidityMeter
                title="Hum"
                value={state.report.room.AM2301.humidity}
                lastUpdate={state.report.room.AM2301.lastUpdate}
              />
              {state.report.room.MQ135 && (
                <SensorMeter
                  title="Air Quality"
                  icon="images/air-quality.svg"
                  suffix="%"
                  value={state.report.room.MQ135.airQuality}
                  lastUpdate={state.report.room.MQ135.lastUpdate}
                />
              )}
            </Group>

            <Group place="bedroom">
              <TemperatureMeter
                title="Temp"
                value={state.report.smallRoom.SI7021.temperature}
                lastUpdate={state.report.smallRoom.SI7021.lastUpdate}
              />
              <HumidityMeter
                title="Hum"
                value={state.report.smallRoom.SI7021.humidity}
                lastUpdate={state.report.smallRoom.SI7021.lastUpdate}
              />
              <AutoSwitcher
                label={`~${state.report.config.setPoint} ˚C`}
                value={state.config.autoMode}
                onChange={(value) => state.setConfig({ autoMode: !!value })}
              />
              <Switcher
                device={state.devices.heaterPanel}
                icon="heater.svg"
                onChange={(value) => state.manualHeaterSwitch(value)}
              />
            </Group>

            <Group place="lounge">
              <TemperatureMeter
                title="Temp"
                value={state.report.lounge.AM2301.temperature}
                lastUpdate={state.report.lounge.AM2301.lastUpdate}
              />
              <HumidityMeter
                title="Hum"
                value={state.report.lounge.AM2301.humidity}
                lastUpdate={state.report.lounge.AM2301.lastUpdate}
              />
              <Switcher
                device={state.devices.flameLamp}
                icon="lantern.svg"
                onChange={(value) => state.sendCommand(state.devices.flameLamp.topics.power, value)}
              />
              <Switcher
                device={state.devices.saltLamp}
                icon="room-lamp.svg"
                onChange={(value) => state.sendCommand(state.devices.saltLamp.topics.power, value)}
              />
              <Switcher
                device={state.devices.heaterLight}
                icon="chimney.svg"
                onChange={(value) => state.sendCommand(state.devices.heaterLight.topics.power, value)}
              />
              {state.report.motionSensor && (
                <SensorMeter
                  title="Motion"
                  icon="/images/motion-sensor.svg"
                  value={state.report.motionSensor.on ? 'ON' : 'OFF'}
                  lastUpdate={state.report.motionSensor.lastChange}
                />
              )}
              {state.report.lounge.BMP280 && (
                <SensorMeter
                  title="Pressure"
                  icon="images/gauge.svg"
                  suffix="hPa"
                  value={state.report.lounge.BMP280.pressure}
                  lastUpdate={state.report.lounge.BMP280.lastUpdate}
                />
              )}
              {state.report.lounge.BH1750 && (
                <IlluminanceMeter
                  value={state.report.lounge.BH1750.illuminance}
                  lastUpdate={state.report.lounge.BH1750.lastUpdate}
                />
              )}
            </Group>

            <Group place="laundry">
              <Switcher
                device={state.devices.laundryLamp}
                icon="desk-lamp.svg"
                onChange={(value) =>
                  state.sendCommand('shellies/shelly-laundry-lamp/relay/0/command', value ? 'on' : 'off')
                }
              />
              <TemperatureMeter
                title="Temp"
                value={state.report.laundry.DS18B20.temperature}
                lastUpdate={state.report.laundry.DS18B20.lastUpdate}
              />
            </Group>

            <Group place="bathroom">
              <Switcher
                device={state.devices.bathroom}
                icon="towel-rail.svg"
                onChange={(value) => state.sendCommand(state.devices.bathroom.topics.power, value)}
              />
            </Group>

            <Group place="outside">
              <Switcher
                device={state.devices.poolPump}
                icon="valve.svg"
                onChange={(value) => state.sendCommand(state.devices.poolPump.topics.power, value)}
              />
              <SensorMeter icon="/images/wind.svg" value={state.report.weather.windSpeedKmh} suffix="km/h" />
              {/* {state.report.room.SOIL && (
                <SensorMeter
                  title="Soil Hum"
                  icon="images/soil.svg"
                  suffix="%"
                  value={state.report.room.SOIL.value}
                  lastUpdate={state.report.room.SOIL.lastUpdate}
                />
              )} */}
              <Sun data={state.report.data} />
            </Group>
          </section>
        )}
        <div className={styles.footer}>
          <Link to="/config-view">Config</Link>
          <Link to="/logs">Logs</Link>
        </div>
      </section>
    );
  }
}

Home.contextType = StoreProvider;
