import { createContext, useState,useContext } from "react";
import mqtt from 'mqtt'

export const AppContext = createContext();

const Client = mqtt.connect('wss://a6d1639031f54423beaf0db4a3961767.s2.eu.hivemq.cloud:8884/mqtt', {
  username: 'Dflinois',
  password: 'Dflinois',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  protocolVersion: 4,
  connectTimeout: 4000,
  keepalive: 60,
  clean: true,
  reconnectPeriod: 1000,
  rejectUnauthorized: false,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  transformWsUrl: (url) => {
    return url;
  }
});

export const Context = ({ children }) =>{
    const [client, setClient] = useState(Client)

    return (
        <AppContext.Provider value={{ client, setClient }}>
          {children}
        </AppContext.Provider>
      );
};
        
export function useAppContext() {
    return useContext(AppContext);
  }