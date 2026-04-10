import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkUsername } from '../api/auth'
import { H1 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'

function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const passwordTooShort = password.length > 0 && password.length < 8

  const isFormFilled =
    firstName.trim() !== '' &&
    surname.trim() !== '' &&
    username.trim() !== '' &&
    password.length >= 8 &&
    confirmPassword.trim() !== ''

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }
    try {
      const exists = await checkUsername(username)
      if (exists) {
        setError('Användarnamnet är redan taget')
        return
      }
      navigate('/edit-profile', { state: { username, firstName, surname, password } })
    } catch {
      setError('Något gick fel, försök igen')
    }
  }

  return (
    <div className="page page--centered">
        <H1>Minigolf</H1>
        <Card>
          <form onSubmit={handleSubmit} className="form">
            <Input label="Användarnamn" value={username} onChange={setUsername} />
            <Input label="Förnamn" value={firstName} onChange={setFirstName} />
            <Input label="Efternamn" value={surname} onChange={setSurname} />
            <Input label="Lösenord" type="password" value={password} onChange={setPassword} showToggle />
            <ErrorMessage message={passwordTooShort ? 'Lösenordet måste vara minst 8 tecken långt' : null} />
            <Input label="Upprepa lösenord" type="password" value={confirmPassword} onChange={setConfirmPassword} showToggle />
            <ErrorMessage message={!passwordTooShort ? error : null} />
            <Button type="submit" disabled={!isFormFilled}>Registrera</Button>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Har du redan ett konto? 
              Gå tillbaka till inlogg
            </Button>
          </form>
        </Card>
    </div>
  )
}

export default RegisterPage