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

const DUMMY_REQUESTS = [
    { id: 'r1', username: 'ScarfoWoo', color: '#FE9377', avatarId: 'gelato' },
    { id: 'r2', username: 'Elin1177', color: '#F81803', avatarId: 'cap' },
]

function ProfilePage() {
    const { username, avatarId, topColor, logout } = useAuth()
    const navigate = useNavigate()
    const [searchUsername, setSearchUsername] = useState('')
    const [requests, setRequests] = useState(DUMMY_REQUESTS)
    const [requestSent, setRequestSent] = useState(false)

    const avatar = AVATARS.find(a => a.id === avatarId)

    function handleAccept(id: string) {
        setRequests(prev => prev.filter(r => r.id !== id))
    }

    function handleRemove(id: string) {
        setRequests(prev => prev.filter(r => r.id !== id))
    }

    function handleHittaVän() {
        setRequestSent(true)
    }

    return (
        <div className="page">
            <H1>Profil</H1>
            <div className="profile-avatar-wrapper" onClick={() =>
                navigate('/avatar')} style={{ cursor: 'pointer' }}>
                {avatar
                    ? <img src={avatar.src} className="profile-avatar" alt="Avatar" style={{ backgroundColor: topColor ?? '#d1d5db' }} />
                    : <div className="profile-avatar profile-avatar--placeholder" style={{ backgroundColor: topColor ?? '#d1d5db' }} />
                }
                <strong>{username}</strong>
            </div>

            {requests.length > 0 && (
                <div className="card card--full">
                    <H2>Vänförfrågningar</H2>
                    {requests.map(r => (
                        <div key={r.id} className="results-row">
                            <div className="results-avatar" style={{ backgroundColor: r.color }}>
                                    {(() => { const av = AVATARS.find(a => a.id === r.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                                </div>
                            <div>
                                <div>
                                    <div className="h2Result">{r.username}</div>
                                    <div className="friend-request-actions">
                                        <button className="friend-request-btn" onClick={() => handleAccept(r.id)}>Godkänn</button>
                                        <button className="friend-request-btn" onClick={() => handleRemove(r.id)}>Ta bort</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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