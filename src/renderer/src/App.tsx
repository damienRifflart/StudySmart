import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/login"
import HomePage from "@/pages/homepage"

function App() {
  return(
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/success" element={<HomePage />}></Route>
      </Routes>
    </HashRouter>
  )
}

export default App