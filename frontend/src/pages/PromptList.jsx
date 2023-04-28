import React, {useState,useEffect} from 'react'
import axios from "axios"
import { Link } from 'react-router-dom';

const PromptList = () => {
const [prompts, setPrompt] = useState([]);

useEffect(()=>{
    getPrompts();
},[]);

const getPrompts = async()=>{
    const response = await axios.get('http://localhost:5000/api/prompts');
    setPrompt(response.data);
};

const deletePrompt = async(Id)=> {
    try {
        await axios.delete('http://localhost:5000/api/prompts/'+Id);
        getPrompts();
    } catch (error) {
        console.log(error)
    }
}

  return (
    <div className="columns mt-5 is-centered">
        <div className="column is-half">
            <Link to={'/add'} className="button is-success">Add New</Link>

            <tabel className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {prompts.map((prompt, index) =>(
                        <tr key={prompt.Id}>
                            <td>{index+1}</td>
                            <td>{prompt.Question}</td>
                            <td>{prompt.Answer}</td>
                            <td>
                                <Link to={'edit/'+prompt.Id} className='button is-small'>Edit</Link>
                                <button onClick={()=> deletePrompt(prompt.Id)} className='button is-small'>Delete</button>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </tabel>
        </div>
    </div>
  )
}

export default PromptList