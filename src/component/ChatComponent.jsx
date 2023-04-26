
import 'reactjs-popup/dist/index.css';
import { useState,useEffect } from 'react';
import { useAppContext } from "../AppContext.jsx"

const usernameRegex = /username:(\w+)/;
const messageRegex = /message:([^]+?)(?=\username:|$)/;

const ChatComponent = ({currentTopic,username}) => {
  const { client, setClient } = useAppContext();
  const [messages, setMessages] = useState([])
  const [topicIsVisible, setTopicIsVisible] = useState(false);
    
  const sendMessage = (topic,message) => {
    client.publish(`${topic}`, `${message}`);
  };

  const handleTopicClick = () => {
    setTopicIsVisible(!topicIsVisible);
  }

  const extractMessage = (message) => {
    let usernameFromOther;
    let messageFromOther;
    const messageToString = message.toString();

    let match = messageToString.match(usernameRegex);
    if (match) {
      usernameFromOther = match[1];
      console.log("username:"+usernameFromOther);
    }
    match = messageToString.match(messageRegex);
    if (match) {
      messageFromOther = match[1];
      console.log("message:"+messageFromOther);
    }

    return { usernameFromOther, messageFromOther };
  };

  const handleMessages = (topic,message) => {
      if(currentTopic === topic) {
          const {usernameFromOther, messageFromOther, } = extractMessage(message);
          console.log(usernameFromOther+" "+messageFromOther);
          const messagetoTopic = { topic: topic, message: messageFromOther, username: usernameFromOther };
          setMessages(messages => [...messages, messagetoTopic]);
      }
  };

  const handleInputMessage = (e) => {
      e.preventDefault();
      const message = `topic:${currentTopic} message:${e.target.message.value} username:${username}`
      sendMessage(`${currentTopic}`,`${message}`);
  };

  useEffect(() => {
      client.on('message', handleMessages);
      return () => {
        client.off('message', handleMessages);
      };
  }, []);

    return (
        <>
        <button onClick={() => handleTopicClick()}>{!topicIsVisible ? 'Voir +' : 'cacher'}</button>
        {
          topicIsVisible && (
            <>
            <div>
              {messages?.map((message, index) => {
                  const messageClass = message.username.includes(username) ? 'own-message' : 'other-message';
                  return (
                      <div key={index} className={`message ${messageClass}`}>
                      <p>{message.username.includes(username) ? "Moi" : message.username}</p>
                      <p>message: {message.message}</p>
                      </div>
                  );
                  })}
              </div>
              <form onSubmit={handleInputMessage}>
              <input type="text" name="message" placeholder="message" />
              <input type="submit" />
              </form>
            </>
          )
        } 
        </>

    )
}

export default ChatComponent