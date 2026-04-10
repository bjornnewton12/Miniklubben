import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import { useNewGame } from '../context/NewGameContext'
import { useAuth } from '../context/AuthContext'
import { getFriends, type FriendDto } from '../api/friends'
import { AVATARS } from '../constants/avatars'

import type { Player } from '../context/NewGameContext'

function NewGamePage() {
    const { selectedIds, guests, setSelectedIds, setGuests, setPlayers } = useNewGame()
    const { userId, firstName: currentFirstName, surname: currentSurname, topColor, avatarId, token, colorRankings } = useAuth()
    const currentUser = { id: userId!, firstName: currentFirstName ?? '', surname: currentSurname ?? '', color: topColor ?? '#6b6b6b', avatarId: avatarId ?? '', colorRankings }
    const [guestName, setGuestName] = useState('')
    const [guestError, setGuestError] = useState<string | null>(null)
    const [friends, setFriends] = useState<FriendDto[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (token) getFriends(token).then(setFriends)
    }, [token])

    useEffect(() => {
        if (!guestError) return
        const timer = setTimeout(() => setGuestError(null), 3000)
        return () => clearTimeout(timer)
    }, [guestError])

    useEffect(() => {
        if (userId && !selectedIds.includes(userId)) {
            setSelectedIds([userId, ...selectedIds])
        }
    }, [userId])

    useEffect(() => {
        const allPlayers: Player[] = [
            currentUser,
            ...friends.map(f =>
                ({ id: f.userId, firstName: f.firstName, surname: f.surname, color: f.topColor ?? '#6b6b6b', avatarId: f.avatarId, colorRankings: f.colorRankings.map(c => c.hexValue) })),
            ...guests.map(g => ({ ...g, avatarId: 'guest', colorRankings: [] })),
        ]
        setPlayers(allPlayers.filter(p => selectedIds.includes(p.id)))
    }, [selectedIds, friends, guests])

    function toggleFriend(id: string) {
        if (id === userId) return
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id))
        } else {
            if (selectedIds.length >= 6) return
            setSelectedIds([...selectedIds, id])
        }
    }

    function addGuest() {
        if (guestName.trim() === '') return
        if (selectedIds.length >= 6) {
            setGuestError('Max 6 spelare per spel')
            return
        }
        const id = `guest-${Date.now()}`
        setGuests([...guests, { id, firstName: guestName.trim(), surname: '', color: '#2C2C2C', avatarId: '1', colorRankings: [] }])
        setSelectedIds([...selectedIds, id])
        setGuestName('')
        setGuestError(null)
    }

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card>
                <H2>Vilka ska spela?</H2>
                <div className="player-grid">
                    {[currentUser, ...friends.map(f => ({ id: f.userId, firstName: f.firstName, surname: f.surname, color: f.topColor ?? '#6b6b6b', avatarId: f.avatarId })), ...guests.map(g => ({ ...g, avatarId: 'guest' }))].map(player => (
                        <div key={player.id} className="player-item" onClick={() => toggleFriend(player.id)}>
                            <div className="player-circle" style={{
                                backgroundColor: player.color,
                                outline: selectedIds.includes(player.id) ? '3px solid white' : '3px solid transparent',
                                outlineOffset: '2px',
                            }}>
                                {(() => { const av = AVATARS.find(a => a.id === player.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                            </div>
                            <span className="label">{player.firstName} {player.surname}</span>
                        </div>
                    ))}
                </div>
                <p className="input-label">Vill du lägga till någon som inte har ett konto?</p>
                <input
                    placeholder="Skriv namnet"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                />
                <ErrorMessage message={guestError} />
                <div style={{ marginTop: '8px', width: '100%' }}>
                    <Button type="submit" disabled={guestName.trim() === ''} onClick={addGuest}>Lägg till</Button>
                </div>

                
            </Card>

            <Button disabled={selectedIds.length === 0} onClick={() => navigate('/new-game/course')}>Nästa steg</Button>
        </div>
    )
}
export default NewGamePage