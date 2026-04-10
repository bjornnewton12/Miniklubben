import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { H1, H2, H3, Label } from '../components/typography/Typography'
import { AVATARS } from '../constants/avatars'
import { getFriends, getFriendsFriends, removeFriend, sendFriendRequest, type FriendDto } from '../api/friends'

function FriendProfilePage() {
    const { userId } = useParams<{ userId: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const { token, userId: currentUserId } = useAuth()
    const friend = location.state as FriendDto | null
    const [friendsFriends, setFriendsFriends] = useState<FriendDto[]>([])
    const [myFriendIds, setMyFriendIds] = useState<Set<string>>(new Set())
    const [addCandidate, setAddCandidate] = useState<FriendDto | null>(null)
    const [requestSent, setRequestSent] = useState(false)

    useEffect(() => {
        if (!token || !userId) return
        getFriendsFriends(token, userId).then(setFriendsFriends)
        getFriends(token).then(friends => setMyFriendIds(new Set(friends.map(f => f.userId))))
    }, [token, userId])

    const avatar = AVATARS.find(a => a.id === friend?.avatarId)

    return (
        <div className="page">
            <button className="ghost back-button" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
            <H1>Profil</H1>

            <div className="profile-avatar-wrapper">
                {avatar
                    ? <img src={avatar.src} className="profile-avatar" alt="Avatar" style={{ backgroundColor: friend?.topColor ?? '#d1d5db' }} />
                    : <div className="profile-avatar profile-avatar--placeholder" style={{ backgroundColor: friend?.topColor ?? '#d1d5db' }} />
                }
                <H3>{friend?.firstName} {friend?.surname}</H3>
                <Label>{friend?.username}</Label>
            </div>

            {friendsFriends.length > 0 && (
                <div className="card card--full">
                    <H2>{friend?.firstName}s vänner</H2>
                    <div className="player-grid">
                        {friendsFriends.map(f => {
                            const av = AVATARS.find(a => a.id === f.avatarId)
                            return (
                                <div key={f.friendshipId} className="player-item" onClick={() => { if (f.userId !== currentUserId && !myFriendIds.has(f.userId)) { setAddCandidate(f); setRequestSent(false) } }}>
                                    <div className="player-circle" style={{ backgroundColor: f.topColor ?? '#d1d5db' }}>
                                        {av && <img src={av.src} className="avatar-img" alt="" />}
                                    </div>
                                    <Label>{f.firstName} {f.surname}</Label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {addCandidate && (
                <div className="warning-overlay">
                    <div className="warning-dialog">
                        <p>Vill du skicka en vänförfrågan till {addCandidate.firstName} {addCandidate.surname}?</p>
                        {requestSent
                            ? <p>Vänförfrågan skickad!</p>
                            : <button onClick={async () => {
                                if (!token) return
                                await sendFriendRequest(token, addCandidate.userId)
                                setRequestSent(true)
                            }}>Skicka förfrågan</button>
                        }
                        <button onClick={() => setAddCandidate(null)}>Stäng</button>
                    </div>
                </div>
            )}

            {friend && (
                <button onClick={async () => {
                    if (!token) return
                    await removeFriend(token, friend.friendshipId)
                    navigate('/profile')
                }}>Ta bort vän</button>
            )}

        </div>
    )
}

export default FriendProfilePage
