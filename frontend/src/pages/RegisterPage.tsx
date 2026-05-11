import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkUsername } from '../api/auth'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import logo from '../assets/logo/Miniklubben_Logo.svg'

function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const passwordTooShort = password.length > 0 && password.length < 8
  const isStep1Filled = username.trim() !== '' && password.length >= 8 && confirmPassword.trim() !== ''
  const isStep2Filled = firstName.trim() !== '' && surname.trim() !== ''

  async function handleNext(e: React.SyntheticEvent) {
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
      setError(null)
      setStep(2)
    } catch {
      setError('Något gick fel, försök igen')
    }
  }

  function handleRegister(e: React.SyntheticEvent) {
    e.preventDefault()
    navigate('/edit-profile', { state: { username, firstName, surname, password } })
  }

  return (
    <div className="page page--centered page--auth">
        <img src={logo} alt="Miniklubben" style={{ height: '40px', marginBottom: '20px' }} />
        <Card>
          {step === 1 ? (
            <form onSubmit={handleNext} className="form">
              <Input label="Användarnamn" value={username} onChange={setUsername} />
              <Input label="Lösenord" type="password" value={password} onChange={setPassword} showToggle />
              <ErrorMessage message={passwordTooShort ? 'Lösenordet måste vara minst 8 tecken långt' : null} />
              <Input label="Upprepa lösenord" type="password" value={confirmPassword} onChange={setConfirmPassword} showToggle />
              <ErrorMessage message={!passwordTooShort ? error : null} />
              <Button type="submit" disabled={!isStep1Filled}>Nästa</Button>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Har du redan ett konto?
                Gå tillbaka till inlogg
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="form">
              <Input label="Förnamn" value={firstName} onChange={setFirstName} />
              <Input label="Efternamn" value={surname} onChange={setSurname} />
              <Button type="submit" disabled={!isStep2Filled}>Registrera</Button>
              <Button variant="ghost" onClick={() => setStep(1)}>{'< Tillbaka'}</Button>
            </form>
          )}
        </Card>
    </div>
  )
}

export default RegisterPage