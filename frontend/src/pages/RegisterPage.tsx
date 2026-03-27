 import { useState } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { H1, H2 } from '../components/typography/Typography'
  import Card from '../components/common/Card'
  import Input from '../components/common/Input'
  import Button from '../components/common/Button'

  function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    const isFormFilled =
      username.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== ''

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      // TODO: go to step 2 (color ranking + avatar)
      console.log({ username, password, confirmPassword })
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <H1 className="mb-10">Minigolf</H1>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <H2 className="text-center">Registrera dig</H2>
            <Input label="Användarnamn" value={username} onChange={setUsername} />
            <Input label="Lösenord" type="password" value={password} onChange={setPassword} />
            <Input label="Upprepa lösenord" type="password" value={confirmPassword} onChange={setConfirmPassword} />
            <Button type="submit" disabled={!isFormFilled} onClick={() => navigate('/avatar')}>
              Registrera
              </Button>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Eller gå tillbaka till inlogg
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  export default RegisterPage