
import { useState } from 'react'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="app">
      <header>
        <h1>AI PM Planner</h1>
      </header>
      <main>
        {!user ? (
          <div className="auth-container">
            <h2>Welcome to AI PM Planner</h2>
            <button>Login</button>
          </div>
        ) : (
          <div className="dashboard">
            <p>Welcome back, {user.name}</p>
          </div>
        )}
      </main>
    </div>
  )
}
