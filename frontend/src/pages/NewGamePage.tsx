import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useNewGame } from '../context/NewGameContext'
import { useAuth } from '../context/AuthContext'
import { getFriends, type FriendDto } from '../api/friends'
import { AVATARS } from '../constants/avatars'
import type { Player } from '../context/NewGameContext'

function NewGamePage() {
    const { selectedIds, guests, setSelectedIds, setGuests, setPlayers } = useNewGame()
    const { userId, username: currentUsername, topColor, avatarId, token, colorRankings } = useAuth()
    const currentUser = { id: userId!, username: currentUsername!, color: topColor ?? '#6b6b6b', avatarId: avatarId ?? '', colorRankings }
    const [guestName, setGuestName] = useState('')
    const [friends, setFriends] = useState<FriendDto[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (token) getFriends(token).then(setFriends)
    }, [token])

    useEffect(() => {
        if (userId && !selectedIds.includes(userId)) {
            setSelectedIds([userId, ...selectedIds])
        }
    }, [userId])

    useEffect(() => {
        const allPlayers: Player[] = [
            currentUser,
            ...friends.map(f => 
                ({ id: f.userId, username: f.username, color: f.topColor ?? '#6b6b6b', avatarId: f.avatarId
                    , colorRankings: f.colorRankings.map(c => c.hexValue) })),
            ...guests.map(g => ({ ...g, avatarId: 'guest', colorRankings: [] })),
        ]
        setPlayers(allPlayers.filter(p => selectedIds.includes(p.id)))
    }, [selectedIds, friends, guests])

    function toggleFriend(id: string) {
        if (id === userId) return
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id))
        } else {
            if (selectedIds.length >= 5) return
            setSelectedIds([...selectedIds, id])
        }
    }

    function addGuest() {
        if (guestName.trim() === '') return
        if (selectedIds.length >= 5) return
        const id = `guest-${Date.now()}`
        setGuests([...guests, { id, username: guestName.trim(), color: '#2C2C2C', avatarId: '1', colorRankings: [] }])
        setSelectedIds([...selectedIds, id])
        setGuestName('')
    }

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card>
                <H2>Vilka ska spela?</H2>
                <div className="player-grid">
                    {[currentUser, ...friends.map(f => ({ id: f.userId, username: f.username, color: f.topColor ?? '#6b6b6b', avatarId: f.avatarId })), ...guests.map(g => ({ ...g, avatarId: 'guest' }))].map(player => (
                        <div key={player.id} className="player-item" onClick={() => toggleFriend(player.id)}>
                            <div className="player-circle" style={{ backgroundColor: player.color }}>
                                {(() => { const av = AVATARS.find(a => a.id === player.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                                {selectedIds.includes(player.id) && <span className="player-checkmark">✓</span>}
                            </div>
                            <span className="player-label">{player.username}</span>
                        </div>
                    ))}
                </div>
                <p>Vill du lägga till någon som inte har ett konto?</p>
                <input
                    placeholder="Skriv namnet"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                />
                <Button type="submit" disabled={guestName.trim() === ''} onClick={addGuest}>Lägg till</Button>

                
            </Card>

            <Button disabled={selectedIds.length === 0} onClick={() => navigate('/new-game/course')}>Nästa steg</Button>
        </div>
    )
}
export default NewGamePage