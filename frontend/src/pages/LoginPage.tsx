import { useState } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { H1 } from '../components/typography/Typography'
  import Card from '../components/common/Card'
  import Input from '../components/common/Input'
  import Button from '../components/common/Button'

  function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const isFormFilled = username.trim() !== '' && password.trim() !== ''

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      // TODO: call API
      console.log({ username, password })
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <H1 className="mb-10">Minigolf</H1>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Användarnamn" value={username} onChange={setUsername} />
            <Input label="Lösenord" type="password" value={password} onChange={setPassword} />
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