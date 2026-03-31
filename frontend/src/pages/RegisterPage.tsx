import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkUsername } from '../api/auth'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const isFormFilled =
    username.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== ''

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }
    const exists = await checkUsername(username)
    if (exists) {
      setError('Användarnamnet är redan taget')
      return
    }
    navigate('/avatar', { state: { username, password } })
  }

  return (
    <div className="page">
      <H1>Minigolf</H1>
      <Card>
        <form onSubmit={handleSubmit} className="form">
          <H2 className="text-center">Registrera dig</H2>
          <Input label="Användarnamn" value={username} onChange={setUsername} />
          <Input label="Lösenord" type="password" value={password} onChange={setPassword} />
          <Input label="Upprepa lösenord" type="password" value={confirmPassword} onChange={setConfirmPassword} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={!isFormFilled}>Registrera</Button>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Eller gå tillbaka till inlogg
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage