import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { H1 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login: saveAuth } = useAuth()
  const navigate = useNavigate()
  const isFormFilled = username.trim() !== '' && password.trim() !== ''

async function handleSubmit(e: React.SyntheticEvent) {
  e.preventDefault()
  const result = await login(username, password)
  if (result.success && result.user && result.token) {
    saveAuth(result.token, result.user.username, result.user.id, result.user.avatarId, result.user.topColor, result.user.colorRankings.map(c => c.hexValue))
    navigate('/profile')
  } else {
    setError('Fel användarnamn eller lösenord')
  }
}

  return (
    <div className="page">
      <H1>Minigolf</H1>
      <Card>
        <form onSubmit={handleSubmit} className="form">
          <Input label="Användarnamn" value={username} onChange={setUsername} />
          <Input label="Lösenord" type="password" value={password} onChange={setPassword} />
          <ErrorMessage message={error} />
          <Button type="submit" disabled={!isFormFilled}>Logga in</Button>
          <Button variant="ghost" onClick={() => navigate('/register')}>
            Eller registrera dig här
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage