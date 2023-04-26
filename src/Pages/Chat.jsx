
import Popup from 'reactjs-popup';
import { useState } from 'react';
import { useAppContext } from "../AppContext.jsx"
import ChatComponent from '../component/ChatComponent.jsx'


export const Chat = ({username}) => {
  const { client, setClient } = useAppContext();
  const [topics, setTopics] = useState(['Main']);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ currentTopic, setCurrentTopic ] = useState('Main');



  const sendMessage = (topic,message) => {
    client.publish(`${topic}`, `${message}`);
  };


  const handleLeaveTopic = (t) => {
    console.log(t.target.value);
    sendMessage(`${t.target.value}`, `username:${username} message: a pris la porte`)
    client.unsubscribe(`${t.target.value}`);
    setTopics(topics.filter(topic => topic !== t.target.value));
  }

  const handleAddTopic = (e) => {
    e.preventDefault();
    const topic = e.target.topic.value;
    setTopics(topics => [...topics, topic]);
    client.subscribe(`${topic}`, { qos: 0 });
    setIsModalOpen(false);
  }

  const handleClickModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className='Chatdiv'>
        <p>vous etes connecté en tant que: {username}</p>
        <div>
        {topics.map((topic,index) => {
            return (
              <div key={index} className='topicdiv'>
                <span>Canal : {topic}</span>
                <button onClick={handleLeaveTopic} value={topic}>Quitter le canal</button>
                <ChatComponent currentTopic={topic} username={username}/>
              </div>
            )})
        }
        </div>
        <button className="btn btn-secondary" onClick={() => {handleClickModal()}}>+ ajouter un canal</button>
        {isModalOpen && (
          <form
          onSubmit={handleAddTopic}>
            <input type="text" name="topic" placeholder="nom du canal" />
            <input type="submit" value="ajouter le canal" />
          </form> 
          )}
    </div>
  );
};
