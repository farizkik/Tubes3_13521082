import {BrowserRouter, Routes, Route} from "react-router-dom";
import PromptList from "./pages/PromptList"
import AddPrompt from "./pages/AddPrompt";
import EditPrompt from "./pages/EditPrompt";
import NavBar from "./components/NavBar";


function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<PromptList/>}/>
        <Route path="add" element={<AddPrompt/>}/>
        <Route path="edit/:Id" element={<EditPrompt/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
