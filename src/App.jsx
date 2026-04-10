import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Driver from './pages/Driver'
import Host from './pages/Host'
import ActiveSession from './pages/ActiveSession'
import { HostProvider } from './context/HostContext'
import ListSale from './pages/ListSale'

export default function App() {
  return (
    <HostProvider>
      <BrowserRouter>
        <div className="noise">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/host" element={<Host />} />
            <Route path="/host/active" element={<ActiveSession />} />
            <Route path="/host/list" element={<ListSale />} />
          </Routes>
        </div>
      </BrowserRouter>
    </HostProvider>
  )
}