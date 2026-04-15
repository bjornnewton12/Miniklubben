import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { H1, H2, H3, Label } from '../components/typography/Typography'
import editIcon from '../assets/icons/icon_edit.svg'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import ErrorMessage from '../components/common/ErrorMessage'
import { AVATARS } from '../constants/avatars'
import { getFriends, getFriendRequests, acceptFriendRequest, removeFriend, sendFriendRequest, type FriendDto, type FriendRequestDto } from '../api/friends'
import { getUserByUsername } from '../api/users'

function ProfilePage() {
    const { username, firstName, surname, avatarId, topColor, token, logout } = useAuth()
    const navigate = useNavigate()
    const [friends, setFriends] = useState<FriendDto[]>([])
    const [requests, setRequests] = useState<FriendRequestDto[]>([])
    const [searchUsername, setSearchUsername] = useState('')
    const [requestSent, setRequestSent] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)

    const avatar = AVATARS.find(a => a.id === avatarId)

    useEffect(() => {
        if (!token) return
        getFriends(token).then(setFriends)
        getFriendRequests(token).then(setRequests)
    }, [token])

    async function handleAccept(friendshipId: string) {
        if (!token) return
        await acceptFriendRequest(token, friendshipId)
        const accepted = requests.find(r => r.friendshipId === friendshipId)!
        setFriends(prev => [...prev, { friendshipId: accepted.friendshipId, userId: accepted.requesterId, username: accepted.username, firstName: accepted.firstName, surname: accepted.surname, avatarId: accepted.avatarId, topColor: accepted.topColor, colorRankings: [] }])
        setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
    }

    async function handleRemoveRequest(friendshipId: string) {
        if (!token) return
        await removeFriend(token, friendshipId)
        setRequests(prev => prev.filter(r => r.friendshipId !== friendshipId))
    }

    async function handleHittaVän() {
        if (!token) return
        setAddError(null)
        const user = await getUserByUsername(token, searchUsername)
        if (!user) {
            setAddError('Användaren hittades inte')
            return
        }
        const success = await sendFriendRequest(token, user.id)
        if (success) {
            setRequestSent(true)
            setSearchUsername('')
        } else {
            setAddError('Kunde inte skicka vänförfrågan')
        }
    }

    return (
        <div className="page">
            <H1>Profil</H1>
            <div className="profile-avatar-wrapper" onClick={() => navigate('/edit-profile')} style={{ cursor: 'pointer' }}>
                <div className="profile-avatar-container">
                    {avatar
                        ? <img src={avatar.src} className="profile-avatar" alt="Avatar" style={{ backgroundColor: topColor ?? '#d1d5db' }} />
                        : <div className="profile-avatar profile-avatar--placeholder" style={{ backgroundColor: topColor ?? '#d1d5db' }} />
                    }
                    <img src={editIcon} className="profile-avatar-edit" alt="" />
                </div>
                <H3>{firstName} {surname}</H3>
                <div style={{ marginTop: '-5px' }}><Label>{username}</Label></div>
            </div>

            {requests.length > 0 && (
                <div className="card card--full">
                    <H2>Vänförfrågningar</H2>
                    {requests.map(r => (
                        <div key={r.friendshipId} className="results-row">
                            <div className="results-avatar" style={{ backgroundColor: r.topColor ?? '#d1d5db' }}>
                                {(() => { const av = AVATARS.find(a => a.id === r.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                            </div>
                            <div>
                                <div className="h3Left">{r.firstName} {r.surname}</div>
                                <div className="friend-request-actions">
                                    <button className="friend-request-btn" onClick={() => handleAccept(r.friendshipId)}>Godkänn</button>
                                    <button className="friend-request-btn" onClick={() => handleRemoveRequest(r.friendshipId)}>Ta bort</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {friends.length > 0 && <div className="card card--full">
                <H2>Dina vänner</H2>
                <div className="player-grid">
                    {friends.map(f => (
                        <div key={f.friendshipId} className="player-item" onClick={() => navigate(`/friend/${f.userId}`, { state: f })}>
                            <div className="player-circle" style={{ backgroundColor: f.topColor ?? '#d1d5db' }}>
                                {(() => { const av = AVATARS.find(a => a.id === f.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                            </div>
                            <Label>{f.firstName} {f.surname}</Label>
                        </div>
                    ))}
                </div>
            </div>}

            <div className="card card--full">
                <H2>Lägg till vänner</H2>
                <Input label="Användarnamn" value={searchUsername} onChange={v => { setSearchUsername(v); setRequestSent(false) }} />
                <ErrorMessage message={addError} />
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
