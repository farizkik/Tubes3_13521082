import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import './Home.css'
import './normalize.css'
import NavBar from '../components/NavBar';
import ReactScrollableFeed from 'react-scrollable-feed'
import {Link} from 'react-router-dom'

const Home = () => {
    const [sidebar,setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    const navigate = useNavigate();

    const [convos, setConvo] = useState([]);

    useEffect(()=>{
        getConvos();
    },[]);
    
    const getConvos = async()=>{
        const response = await axios.get('http://localhost:5000/api/histories/');
        setConvo(response.data.reverse());
    };

    const [Text, setText] = useState("");
    const [ChatId, setAvailable] = useState("");
    const [Bubble, setBubble] = useState(1);

    const [chats, setChat] = useState([]);

    useEffect(()=>{
        getChats();
        startAvail();
    },[]);

    function getText(val){
        setText(val.target.value)
    }

    function keyDown(val){
        if(val.keyCode===13 && !val.shiftKey)document.getElementById("btnSend").click();
    }

    function getAvail(arg){
        const len = arg.data.length
        if(len==0) return 1
        var largest = arg.data[0].ChatId
        for(var i=0; i<len; i++){
            if(largest<arg.data[i].ChatId){
                largest = arg.data[i].ChatId
            }
        }
        return largest+1
    }

    const startAvail = async()=>{
        if(ChatId=="")
            {
                const response = await axios.get('http://localhost:5000/api/histories/');
                setAvailable(getAvail(response))
            }
    }

    const getChats = async()=>{
        if(ChatId!=""){
            const response = await axios.get('http://localhost:5000/api/histories/'+ChatId);
            setChat(response.data);
            setBubble(response.data.length+1)
            getConvos()        
        }
    }
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          saveChat();
        }
    }

    const saveChat = async (e) =>{
        if(Text !=""){
            e.preventDefault();
            try {
                if(ChatId=="")
                {
                    const response = await axios.get('http://localhost:5000/api/histories/');
                    setAvailable(getAvail(response))
                }
                
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
                console.log("heeree")
                getChats()
                setText("")
            } catch (error) {
                console.log(error);
            }
        }
        else{
            e.preventDefault();
        }
    };

    return (
        
        <div className="center isi App">
        
        <aside className='sidemenu'>
            <div className='new-chat' onClick={() => {window.location.href="/"}}>
                <span>+</span>
                New Chat
            </div>
            <select name="cars" id="cars" className='algo-select'>
                <option value="KMP" className='algo-item'>Knuth Morris Path</option>
                <option value="BM" className='algo-item'>Bayer-Moore</option>
            </select>
            <div className="scroll-convos">   
                {convos.map((chat,index) => {
                    return(
                        <li key={index+10} className='nav-text'>
                                <Link to={'convo/' + chat.ChatId}>
                                    <span>
                                        {chat.Text}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
            </div>

        </aside>

        <section className='contentbox'>

        <div className="chat-log">
            <div className="chat-message">
        <ReactScrollableFeed className='width-changer'>
                {chats.map((chat, index) =>(
                    <div key={index} className={chat.Sender +" message"}> {chat.Text} </div> 
                    ))}
            <div className='bottom-block'></div>
        </ReactScrollableFeed>
            </div>
        </div>

        <div className="write-chat">
            <textarea 
            type="text" 
            className="input-area" 
            onChange={getText}
            onKeyDown = {keyDown}
            placeholder='Chat here'
            value={Text}
            />
            <div className="field">
                    <button onClick={saveChat} type='submit' className="button-send" id='btnSend'>
                        Send
                    </button>
            </div>
        </div>
        

        </section>
        </div>
    )
}

export default Home