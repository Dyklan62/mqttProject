import { useState } from 'react'
import '../App.css'
import { useEffect } from 'react'
import {Chat} from './Chat'
import { useAppContext} from "../AppContext.jsx"

const HomePage = () => {
    const { client, setClient } = useAppContext();
    const [connectStatus, setConnectStatus] = useState("not connected");
    const [username, setUsername] = useState("");
    const [isconnected, setIsconnected] = useState(false);
    const [topic, setTopic] = useState("Main");
  
    const handleConnect = (e) => {
      e.preventDefault() ;
      setUsername(e.target.elements.username.value)
      client.subscribe(`${topic}`, { qos: 0 });
      setIsconnected(true);
    };
  
  useEffect(() => {
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
    }, []);

return (
    <>
        {!isconnected ? (
            <>
            <form onSubmit={(e) => handleConnect(e)}>
            <input type="text" placeholder="username" name="username" required="required"/>
            <input type="submit"></input>
            </form>
            <p>{connectStatus}</p>
            </>
        ) : (
            <Chat username={username}/>
        )}
    </>
    );
}

export default HomePage;    
