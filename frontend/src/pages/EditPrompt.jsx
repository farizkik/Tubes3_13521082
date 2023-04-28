import React,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';

const EditPrompt = () => {
    const [Question, setQuestion] = useState("");
    const [Answer, setAnswer] = useState("");
    const navigate = useNavigate();
    const { Id } = useParams();

    useEffect(()=>{
        getPromptById();}
    ,[])

    const updatePrompt = async (e) =>{
        e.preventDefault();
        try {
            await axios.patch('http://localhost:5000/api/prompts/'+Id,{
                Question: Question,
                Answer: Answer
            });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

  const getPromptById = async () =>{
    const response = await axios.get(`http://localhost:5000/api/prompts/`+Id);
    setQuestion(response.data.Question)
    setAnswer(response.data.Answer)
  }

  return (
    <div className="columns mt-5 is-centered">
        <div className="column is-half">
            <form onSubmit={updatePrompt}>
                <div className='field'>
                    <label className='label'>Question</label>
                    <div className="control">
                        <input 
                        type="text" 
                        className="input" 
                        value={Question} 
                        onChange={(e)=> setQuestion(e.target.value)}
                        placeholder='Question'/>
                    </div>
                </div>   
                <div className='field'>
                    <label className='label'>Answer</label>
                    <div className="control">
                        <input 
                        type="text" 
                        className="input" 
                        value={Answer} 
                        onChange={(e)=> setAnswer(e.target.value)}
                        placeholder='Answer'/>
                    </div>
                </div>   
                <div className="field">
                    <button type='submit' className="button is-success">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditPrompt