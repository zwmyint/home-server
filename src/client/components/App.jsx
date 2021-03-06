import React from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { store, Provider } from '../lib/store';
import { devices } from '../lib/devices';
import { initMqttClient } from '../lib/mqtt';
import { getDevicePowerStateFromPayload } from '../lib/util';

import Home from './Home';
import Config from './Config';
import RoomConfig from './RoomConfig';
import Loader from './Loader';
import Log from './Log';

export default class App extends React.Component {
  static getDerivedStateFromError(error) {
    return { error };
  }

  constructor(props) {
    super(props);

    this.state = {
      ...store,
      sendCommand: (topic, value) => {
        console.debug('command', topic, value);
        this.state.mqttClient.publish(topic, String(value));
      },
      setRoomConfig: async (room, newConfigValues) => {
        const currentRoomConfig = this.state.config.rooms[room];
        console.debug('setRoomConfig', room, newConfigValues);
        const body = JSON.stringify({
          ...this.state.config,
          rooms: {
            ...this.state.config.rooms,
            [room]: { ...currentRoomConfig, ...newConfigValues },
          },
        });
        await fetch('/config', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
      },
      setConfig: async (newConfigValues) => {
        console.debug('setConfig', newConfigValues);
        const body = JSON.stringify({
          ...this.state.config,
          ...newConfigValues,
        });
        await fetch('/config', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
      },
    };
  }

  async componentDidMount() {
    const res = await fetch('/init', { credentials: 'include' });
    const { config, auth } = await res.json();

    localStorage.apiKey = auth.apiKey;
    localStorage.mqttUrl = auth.mqttUrl;

    const parsers = {
      'stat/_report': (payload) => {
        const report = JSON.parse(payload);
        this.setState({ report, config: report.config });
      },
      'stat/_config': (payload) => {
        const config = JSON.parse(payload);
        this.setState({ config });
      },
      'stat/_logs': (payload) => {
        const data = JSON.parse(String(payload));
        this.setState((prevState) => {
          const logs = [...prevState.logs, data].slice(-500);
          return { logs };
        });
      },
    };

    Object.keys(devices).forEach((name) => {
      const device = devices[name];
      parsers[device.topics.status] = this.buildPowerStatusParser(name);
      parsers[device.topics.lwt] = this.buildOnlineStatusParser(name);
      if (device.topics.sensor) {
        parsers[device.topics.sensor] = this.buildSensorStatusParser(name);
      }
      if (device.topics.tele) {
        parsers[device.topics.tele] = this.buildTelemetryStatusParser(name);
      }
    });

    const mqttClient = initMqttClient(parsers);

    mqttClient.on('connect', () => {
      this.setState({ loaded: true });
    });

    mqttClient.on('close', () => {
      this.setState({ loaded: false });
    });

    this.setState({ mqttClient, config, auth });
  }

  render() {
    if (!this.state.loaded) {
      return <Loader />;
    }

    if (this.state.error) {
      return (
        <div className="error">
          An error occurred <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }

    return (
      <BrowserRouter>
        <Provider value={this.state}>
          <Route exact path="/" render={() => <Home />} />
          <Route
            path="/config-view"
            render={() => (
              <Config
                value={this.state.config}
                onSave={(config) => this.state.setConfig(config)}
              />
            )}
          />
          <Route
            path="/room-config/:room"
            render={(routeProps) => (
              <RoomConfig
                value={this.state.config.rooms[routeProps.match.params.room]}
                onSave={(config) =>
                  this.state.setRoomConfig(routeProps.match.params.room, config)
                }
              />
            )}
          />
          <Route path="/logs" render={() => <Log />} />
        </Provider>
      </BrowserRouter>
    );
  }

  buildPowerStatusParser(deviceName) {
    return (payload) => {
      const power = getDevicePowerStateFromPayload(payload);

      this.setState((state) => {
        const { devices } = state;
        return {
          devices: {
            ...devices,
            [deviceName]: {
              ...devices[deviceName],
              power,
            },
          },
        };
      });
    };
  }

  buildOnlineStatusParser(deviceName) {
    return (payload) => {
      const value = String(payload).toLowerCase();
      const online = value === 'online' || value === 'true';

      this.setState((state) => {
        const { devices } = state;
        return {
          devices: {
            ...devices,
            [deviceName]: {
              ...devices[deviceName],
              online,
            },
          },
        };
      });
    };
  }

  buildSensorStatusParser(deviceName) {
    return (payload) => {
      const sensorData = JSON.parse(String(payload));

      let energy = {};

      // parse payload for Tasmota & Shelly devices
      if (typeof sensorData === 'object') {
        energy.power = sensorData.ENERGY.Power;
      } else {
        energy.power = sensorData;
      }

      this.setState((state) => {
        const { devices } = state;
        return {
          devices: {
            ...devices,
            [deviceName]: {
              ...devices[deviceName],
              sensor: { energy },
            },
          },
        };
      });
    };
  }

  buildTelemetryStatusParser(deviceName) {
    return (payload) => {
      const data = JSON.parse(String(payload));

      this.setState((state) => {
        const { devices } = state;
        return {
          devices: {
            ...devices,
            [deviceName]: {
              ...devices[deviceName],
              tele: data,
            },
          },
        };
      });
    };
  }
}
