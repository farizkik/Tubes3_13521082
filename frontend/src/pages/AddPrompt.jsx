import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const AddPrompt = () => {
    const [Question, setQuestion] = useState("");
    const [Answer, setAnswer] = useState("");
    const navigate = useNavigate();

    const savePrompt = async (e) =>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/prompts',{
                Question: Question,
                Answer: Answer
            });
            navigate("/database");
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
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddPrompt