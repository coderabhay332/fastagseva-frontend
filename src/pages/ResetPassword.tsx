import { useEffect, useState } from 'react'
import { resetPassword } from '../services/users'
import { useNavigate, useSearchParams } from 'react-router-dom'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing token')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      await resetPassword({ token, password, confirmPassword })
      setMessage('Password reset successful. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setMessage('Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-24">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Reset Password</h1>
        <label className="block text-sm font-medium mb-2">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        />
        <button type="submit" disabled={loading || !token} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  )
}

export default ResetPassword


