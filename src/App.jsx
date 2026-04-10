import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Driver from './pages/Driver'
import Host from './pages/Host'

export default function App() {
  return (
    <BrowserRouter>
      <div className="noise">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/host" element={<Host />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}