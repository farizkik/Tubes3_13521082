import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

const Home = () => {
    const [Text, setText] = useState("");
    const [Available, setAvailable] = useState("");
    const [Bubble, setBubble] = useState(1);

    const navigate = useNavigate();

    const [chats, setChat] = useState([]);

    useEffect(()=>{
        getChats();
        startAvail();
    },[]);

    function getText(val){
        setText(val.target.value)
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
        if(Available=="")
            {
                const response = await axios.get('http://localhost:5000/api/histories/');
                setAvailable(getAvail(response))
            }
    }

    const getChats = async()=>{
        if(Available!=""){
            const response = await axios.get('http://localhost:5000/api/histories/'+Available);
            setChat(response.data);
            setBubble(response.data.length+1)
        }
    }
    const saveChat = async (e) =>{
        if(Text !=""){
            e.preventDefault();
            try {
                if(Available=="")
                {
                    const response = await axios.get('http://localhost:5000/api/histories/');
                    setAvailable(getAvail(response))
                }

                await axios.post('http://localhost:5000/api/histories',{
                    ChatId: Available,
                    BubbleId: Bubble,
                    Text: Text,
                    Sender: "user"
                });

                const response = await axios.get('http://localhost:5000/api/prompts/'+Available+'/'+Bubble);

                await axios.post('http://localhost:5000/api/histories',{
                    ChatId: Available,
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
                <tabel className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>BubbleId</th>
                            <th>Text</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chats.map((chat, index) =>(
                            <tr key={chat.BubbleId}>
                                <td>{index+1}</td>
                                <td>{chat.BubbleId}</td>
                                <td>{chat.Text}</td>
                                <td>{chat.Sender}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </tabel>
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

export default Home