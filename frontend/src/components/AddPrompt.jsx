import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const AddPrompt = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const savePrompt = async (e) =>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/prompts',{
                question,
                answer
            });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className="columns mt-5 is-centered">
        <div className="column is-half">
            <form onSubmit={savePrompt}>
                <div className='field'>
                    <label className='label'>Question</label>
                    <div className="control">
                        <input 
                        type="text" 
                        className="input" 
                        value={question} 
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
                        value={answer} 
                        onChange={(e)=> setAnswer(e.target.value)}
                        placeholder='Answer'/>
                    </div>
                </div>   
                <div className="field">
                    <button type='submit' className="button is-success">
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddPrompt