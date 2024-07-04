import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "@/components/login-page"
import HomePage from "@/components/homepage"

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/success" element={<HomePage />}></Route>
      </Routes>
    </Router>
  )
}

export default App