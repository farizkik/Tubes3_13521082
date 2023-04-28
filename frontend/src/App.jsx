import {BrowserRouter, Routes, Route} from "react-router-dom";
import PromptList from "./pages/PromptList"
import AddPrompt from "./pages/AddPrompt";
import EditPrompt from "./pages/EditPrompt";
import NavBar from "./components/NavBar";
import ChatContent from "./pages/ChatContent";
import Home from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="database" element={<PromptList/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="database/add" element={<AddPrompt/>}/>
        <Route path="edit/:Id" element={<EditPrompt/>}/>
        <Route path="convo/:ChatId" element={<ChatContent/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
