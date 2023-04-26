import {BrowserRouter, Routes, Route} from "react-router-dom";
import PromptList from "./components/PromptList"
import AddPrompt from "./components/AddPrompt";
import EditPrompt from "./components/EditPrompt";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PromptList/>}/>
        <Route path="add" element={<AddPrompt/>}/>
        <Route path="edit/:id" element={<EditPrompt/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
