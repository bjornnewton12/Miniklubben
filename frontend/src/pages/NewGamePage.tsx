import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useNewGame } from '../context/NewGameContext'
import { useAuth } from '../context/AuthContext'

const COLORS = ['#45AC7F', '#FE9377', '#4B69FE', '#F81803', '#F6B859', '#F7A6AD']

function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)]
}

const DUMMY_FRIENDS = [
    { id: '1', username: 'Pastor Grön', color: '#45AC7F' },
    { id: '2', username: 'Överste Senap', color: '#F6B859' },
    { id: '3', username: 'Fru Påfågel', color: '#4B69FE' },
    { id: '4', username: 'Professor Plommon', color: '#F7A6AD' },
    { id: '5', username: 'Fröken Sharlakan', color: '#F81803' },
    { id: '6', username: 'Madam Persika', color: '#FE9377' },
]

function NewGamePage() {
    const { selectedIds, guests, setSelectedIds, setGuests } = useNewGame()
    const { userId, username: currentUsername, topColor } = useAuth()
    const currentUser = { id: userId!, username: currentUsername!, color: topColor ?? '#6b6b6b' }
    const [guestName, setGuestName] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (userId && !selectedIds.includes(userId)) {
            setSelectedIds([userId, ...selectedIds])
        }
    }, [userId])

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
        setGuests([...guests, { id, username: guestName.trim(), color: randomColor() }])
        setSelectedIds([...selectedIds, id])
        setGuestName('')
    }

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card>
                <H2>Vilka ska spela?</H2>
                <div className="player-grid">
                    {[currentUser, ...DUMMY_FRIENDS, ...guests].map(friend => (
                        <div key={friend.id} className="player-item" onClick={() => toggleFriend(friend.id)}>
                            <div className="player-circle" style={{ backgroundColor: friend.color }}>
                                {selectedIds.includes(friend.id) && <span className="player-checkmark">✓</span>}
                            </div>
                            <span className="player-label">{friend.username}</span>
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