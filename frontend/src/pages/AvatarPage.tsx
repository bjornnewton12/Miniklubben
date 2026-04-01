import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { H2 } from '../components/typography/Typography'
import Button from '../components/common/Button'
import ColorRanking from '../components/game/ColorRanking'
import AvatarPicker from '../components/game/AvatarPicker'
import { getColors } from '../api/colors'
import type { ApiColor } from '../api/colors'
import { AVATARS } from '../constants/avatars'

function RegisterStep2Page() {
    const [colors, setColors] = useState<ApiColor[]>([])
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    useEffect(() => {
        getColors().then(setColors)
    }, [])
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as { username?: string; password?: string } | null
    const username = state?.username
    const password = state?.password
    const { login: saveAuth, updateAvatar } = useAuth()

    function moveColor(index: number, direction: 'up' | 'down') {
        const newColors = [...colors]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= newColors.length) return
            ;[newColors[index], newColors[swapIndex]] = [newColors[swapIndex], newColors[index]]
        setColors(newColors)
    }

    async function handleSubmit() {
        const colorRankingIds = colors.map(c => c.id)
        if (username && password) {
            const result = await register(username, password, selectedAvatar!, colorRankingIds)
            if (result.success && result.user && result.token) {
                saveAuth(result.token, result.user.username, result.user.id, selectedAvatar!, colors[0].hexValue, colors.map(c => c.hexValue))
                navigate('/')
            } else {
                console.error(result.error)
            }
        } else {
            updateAvatar(selectedAvatar!, colors[0].hexValue, colors.map(c => c.hexValue))
            navigate('/profile')
        }
    }

    return (
        <div className="page">
            <div className="card card--full">
                <H2>Rangordna dina favoritfärger</H2>
                <ColorRanking colors={colors} onMove={moveColor} />
                <H2>Välj en avatar</H2>
                <AvatarPicker avatars={AVATARS} selectedId={selectedAvatar} onSelect={setSelectedAvatar} accentColor={colors[0]?.hexValue ?? '#000000'} />
                <Button disabled={!selectedAvatar} onClick={handleSubmit}>Spara</Button>
            </div>
        </div>
    )
}

export default RegisterStep2Page