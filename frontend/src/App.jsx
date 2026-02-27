import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Register from './pages/Register'
import Login from './pages/Login'






import DashbBoard from './pages/DashBoard'
import Allcourses from './pages/Allcourses'



const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <Allcourses />
              </PrivateRoute>
            }
          />

          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashbBoard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
