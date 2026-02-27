import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow">
      <h1 className="text-lg font-bold">📚 Course Manager</h1>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-100">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 text-sm font-medium px-4 py-1.5 rounded hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
