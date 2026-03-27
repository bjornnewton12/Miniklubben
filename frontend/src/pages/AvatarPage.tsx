import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { H2 } from '../components/typography/Typography'
import Button from '../components/common/Button'
import ColorRanking from '../components/game/ColorRanking'
import AvatarPicker from '../components/game/AvatarPicker'
import { COLORS } from '../constants/colors'
import { AVATARS } from '../constants/avatars'

function RegisterStep2Page() {
    const [colors, setColors] = useState(COLORS)
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    const navigate = useNavigate()

    function moveColor(index: number, direction: 'up' | 'down') {
        const newColors = [...colors]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= newColors.length) return
            ;[newColors[index], newColors[swapIndex]] = [newColors[swapIndex], newColors[index]]
        setColors(newColors)
    }

    function handleSubmit() {
        // TODO: call register API with color rankings + avatar
        console.log({ colorRankings: colors.map(c => c.id), selectedAvatar })
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-white px-6 py-10 gap-8">
            <div className="w-full max-w-sm flex flex-col gap-3">
                <H2>Rangordna dina favoritfärger</H2>
                <ColorRanking colors={colors} onMove={moveColor} />
            </div>

            <div className="w-full max-w-sm flex flex-col gap-3">
                <H2 className="text-center">Välj en avatar</H2>
                <AvatarPicker avatars={AVATARS} selectedId={selectedAvatar} onSelect={setSelectedAvatar} />
            </div>

            <div className="w-full max-w-sm">
                <Button disabled={!selectedAvatar} onClick={handleSubmit}>Klart</Button>
            </div>
        </div>
    )
}

export default RegisterStep2Page