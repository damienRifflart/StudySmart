import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login-page'
import Success from './pages/success-page'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/success' element={<Success />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
