import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { H1, H2, Label } from '../components/typography/Typography'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { AVATARS } from '../constants/avatars'

const DUMMY_FRIENDS = [
    { id: '1', username: 'Agnes', color: '#45AC7F' },
    { id: '2', username: 'Bo', color: '#FE9377' },
    { id: '3', username: 'Cecilia', color: '#4B69FE' },
    { id: '4', username: 'Dawit', color: '#4B69FE' },
    { id: '5', username: 'Erica', color: '#F81803' },
    { id: '6', username: 'Filip', color: '#F6B859' },
]

function ProfilePage() {
    const { username, avatarId, topColor, logout } = useAuth()
    const navigate = useNavigate()
    const [searchUsername, setSearchUsername] = useState('')
    const [requestSent, setRequestSent] = useState(false)

    const avatar = AVATARS.find(a => a.id === avatarId)

    function handleHittaVän() {
        setRequestSent(true)
    }

    return (
        <div className="page">
            <H1>Profil</H1>
            <div className="profile-avatar-wrapper" onClick={() =>
                navigate('/avatar')} style={{ cursor: 'pointer'}}>
                {avatar
                    ? <img src={avatar.src} className="profile-avatar" alt="Avatar" style={{ backgroundColor: topColor ?? '#d1d5db' }} />
                    : <div className="profile-avatar profile-avatar--placeholder" style={{ backgroundColor: topColor ?? '#d1d5db' }} />
                }
                <strong>{username}</strong>
            </div>

            <div className="card card--full">
                <H2>Dina vänner</H2>
                <div className="player-grid">
                    {DUMMY_FRIENDS.map(f => (
                        <div key={f.id} className="player-item">
                            <div className="player-circle" style={{ backgroundColor: f.color }} />
                            <Label>{f.username}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card card--full">
                <H2>Lägg till vänner</H2>
                <Input
                    label="Användarnamn"
                    value={searchUsername}
                    onChange={setSearchUsername}
                />
                {requestSent
                    ? <Label>Vänförfrågan skickad!</Label>
                    : <Button onClick={handleHittaVän} disabled={!searchUsername}>Hitta vän</Button>
                }
            </div>
            <Button onClick={() => { logout(); navigate('/login') }}>Logga ut</Button>
        </div>
    )
}

export default ProfilePage