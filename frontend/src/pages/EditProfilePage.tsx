import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { H1, H2 } from '../components/typography/Typography'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { getColors } from '../api/colors'
import { updateUserProfile, updateColorRankings } from '../api/users'
import type { ApiColor } from '../api/colors'
import { AVATARS } from '../constants/avatars'

type Step = 'pick' | 'sort' | 'avatar'

function EditProfilePage() {
    const navigate = useNavigate()
    const location = useLocation()
    const state = location.state as { username?: string; firstName?: string; surname?: string; password?: string } | null
    const isRegistering = !!state?.username

    const { login: saveAuth, updateProfile, avatarId, colorRankings, firstName: authFirstName, surname: authSurname, token } = useAuth()

    const [step, setStep] = useState<Step>('pick')
    const [allColors, setAllColors] = useState<ApiColor[]>([])
    const [selectedColorIds, setSelectedColorIds] = useState<string[]>([])
    const [sortedColors, setSortedColors] = useState<ApiColor[]>([])
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    const [nameFirstName, setNameFirstName] = useState('')
    const [nameSurname, setNameSurname] = useState('')
    const [nameSaved, setNameSaved] = useState(false)

    useEffect(() => {
        getColors().then(fetched => {
            setAllColors(fetched)
            if (!isRegistering && colorRankings.length > 0) {
                const currentIds = colorRankings
                    .map(hex => fetched.find(c => c.hexValue === hex)?.id)
                    .filter((id): id is string => !!id)
                setSelectedColorIds(currentIds)
            }
        })
        if (!isRegistering) {
            setSelectedAvatar(avatarId)
            setNameFirstName(authFirstName ?? '')
            setNameSurname(authSurname ?? '')
        }
    }, [])

    function toggleColor(id: string) {
        setSelectedColorIds(prev => {
            if (prev.includes(id)) return prev.filter(c => c !== id)
            if (prev.length >= 6) return prev
            return [...prev, id]
        })
    }

    function goToSort() {
        const ordered = selectedColorIds.map(id => allColors.find(c => c.id === id)!).filter(Boolean)
        setSortedColors(ordered)
        setStep('sort')
    }

    function moveColor(index: number, direction: 'up' | 'down') {
        const next = [...sortedColors]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= next.length) return
        ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
        setSortedColors(next)
    }

    const topColor = sortedColors[0]?.hexValue
        ?? allColors.find(c => c.id === selectedColorIds[0])?.hexValue
        ?? '#45AC7F'

    async function handleSave() {
        const colorRankingIds = sortedColors.map(c => c.id)
        const top = sortedColors[0]?.hexValue ?? '#45AC7F'
        const hexRankings = sortedColors.map(c => c.hexValue)

        if (isRegistering) {
            const { username, firstName, surname, password } = state!
            const result = await register(username!, firstName!, surname!, password!, selectedAvatar!, colorRankingIds)
            if (result.success && result.user && result.token) {
                saveAuth(result.token, result.user.username, result.user.firstName, result.user.surname, result.user.id, selectedAvatar!, top, hexRankings)
                navigate('/profile')
            }
        } else {
            if (!token) return
            await Promise.all([
                updateColorRankings(token, colorRankingIds),
                updateUserProfile(token, nameFirstName, nameSurname, selectedAvatar!)
            ])
            updateProfile(nameFirstName, nameSurname, selectedAvatar!, top, hexRankings)
            navigate('/profile')
        }
    }

    async function handleSaveName() {
        if (!token) return
        await updateUserProfile(token, nameFirstName, nameSurname, avatarId ?? '')
        updateProfile(nameFirstName, nameSurname, avatarId ?? '', topColor, colorRankings)
        setNameSaved(true)
    }

    return (
        <div className="page">
            <button className="ghost back-button" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
            
            <H1>Ändra profil</H1>

            <div className="card card--full">
                {step === 'pick' && (
                    <>
                        <H2>Välj 6 färger</H2>
                        <div className="color-pick-grid">
                            {allColors.map(color => (
                                <div key={color.id} className="color-pick-item" onClick={() => toggleColor(color.id)}>
                                    <div
                                        className="color-pick-circle"
                                        style={{
                                            backgroundColor: color.hexValue,
                                            outline: selectedColorIds.includes(color.id) ? '3px solid white' : '3px solid transparent',
                                            outlineOffset: '2px',
                                        }}
                                    />
                                    <span className="color-pick-label">{color.name}</span>
                                </div>
                            ))}
                        </div>
                        <Button onClick={goToSort} disabled={selectedColorIds.length !== 6}>Nästa</Button>
                    </>
                )}

                {step === 'sort' && (
                    <>
                        <H2>Sortera i ordning</H2>
                        <div className="color-ranking">
                            {sortedColors.map((color, index) => (
                                <div key={color.id} className="color-ranking__row" style={{ backgroundColor: color.hexValue }}>
                                    <span className="color-ranking__name">{color.name}</span>
                                    <div className="color-ranking__controls">
                                        {index > 0 && <button className="color-ranking__btn" onClick={() => moveColor(index, 'up')}>∧</button>}
                                        {index < sortedColors.length - 1 && <button className="color-ranking__btn" onClick={() => moveColor(index, 'down')}>∨</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => setStep('avatar')}>Nästa</Button>
                    </>
                )}

                {step === 'avatar' && (
                    <>
                        <H2>Välj avatar</H2>
                        <div className="color-pick-grid">
                            {AVATARS.filter(a => a.id !== 'guest').map(avatar => (
                                <div key={avatar.id} className="color-pick-item" onClick={() => setSelectedAvatar(avatar.id)}>
                                    <div
                                        className="color-pick-circle"
                                        style={{
                                            backgroundColor: topColor,
                                            outline: selectedAvatar === avatar.id ? '3px solid white' : '3px solid transparent',
                                            outlineOffset: '2px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img src={avatar.src} alt={avatar.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleSave} disabled={!selectedAvatar}>Spara</Button>
                    </>
                )}
            </div>

            {!isRegistering && (
                <div className="card card--full">
                    <H2>Byt namn</H2>
                    <Input label="Förnamn" value={nameFirstName} onChange={v => { setNameFirstName(v); setNameSaved(false) }} />
                    <Input label="Efternamn" value={nameSurname} onChange={v => { setNameSurname(v); setNameSaved(false) }} />
                    {nameSaved
                        ? <span className="label" style={{ color: 'white', marginTop: 8 }}>Sparat!</span>
                        : <Button disabled={!nameFirstName || !nameSurname} onClick={handleSaveName}>Spara</Button>
                    }
                </div>
            )}
        </div>
    )
}

export default EditProfilePage
