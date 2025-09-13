import { useState } from 'react'
import { forgotPassword } from '../services/users'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await forgotPassword(email)
      setMessage('If an account exists, a reset link has been sent.')
    } catch (err) {
      setMessage('If an account exists, a reset link has been sent.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-24">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Forgot Password</h1>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        <button type="button" onClick={() => navigate('/login')} className="mt-4 text-blue-600 text-sm">Back to login</button>
      </form>
    </div>
  )
}

export default ForgotPassword


