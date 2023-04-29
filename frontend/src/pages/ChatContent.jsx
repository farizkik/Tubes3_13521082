import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import './Home.css'

const ChatContent = () => {
    const [Text, setText] = useState("");
    const [Sender, setSender] = useState("");
    const [Bubble, setBubble] = useState("");

    const navigate = useNavigate();
    const { ChatId } = useParams();

    const [chats, setChat] = useState([]);

    useEffect(()=>{
        getChats();
    },[]);

    useEffect(()=>{
        getChats();
    },[ChatId]);

    function getText(val){
        setText(val.target.value)
    }

    const getChats = async()=>{
        const response = await axios.get('http://localhost:5000/api/histories/'+ChatId);
        setChat(response.data);
        setBubble(response.data.length+1)
    };

    const saveChat = async (e) =>{
        if(Text !=""){
            e.preventDefault();
            try {
                await axios.post('http://localhost:5000/api/histories',{
                    ChatId: ChatId,
                    BubbleId: Bubble,
                    Text: Text,
                    Sender: "user"
                });

                const response = await axios.get('http://localhost:5000/api/prompts/'+ChatId+'/'+Bubble);

                await axios.post('http://localhost:5000/api/histories',{
                    ChatId: ChatId,
                    BubbleId: Bubble+1,
                    Text: response.data,
                    Sender: "ai"
                });

                getChats()
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="center">
        <div className="columns mt-5 is-centered">
            <div className="column is-half">
                {chats.map((chat, index) =>(
                    <div className={chat.Sender}> {chat.Text} </div>
                    
                ))}
        </div>       
        </div>

        <div className="columns mt-5 is-centered ">
            <form className='column is-half'>
                <div className='field'>
                    <label className='label'>Text Me!</label>
                    <div className="control">
                        <input 
                        type="text" 
                        className="input" 
                        onChange={getText}
                        placeholder='Chat here'/>
                    </div>
                </div>    
                <div className="field">
                    <button onClick={saveChat} type='submit' className="button is-success">
                        Send
                    </button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default ChatContent