import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useNewGame } from '../context/NewGameContext'

function HolesPage() {
    const { holes, setHoles } = useNewGame()
    const [holesInput, setHolesInput] = useState(holes?.toString() ?? '')
    const navigate = useNavigate()

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card>
                <button className="ghost" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
                <H2>Antal hål</H2>
                <p>Hur många hål är det på banan?</p>
                <input
                    type="number"
                    placeholder="Antal"
                    value={holesInput}
                    onChange={e => {
                        setHolesInput(e.target.value)
                        setHoles(Number(e.target.value))
                    }}
                />
                <Button onClick={() => navigate('/new-game/summary')} disabled={!holes || holes < 1}>Nästa steg</Button>
            </Card>
        </div>
    )
}

export default HolesPage
