import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2, H3 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useNewGame } from '../context/NewGameContext'

const DUMMY_COURSES = [
    { id: '1', name: 'Aspuddens Bangolf' },
    { id: '2', name: 'Liseberg' },
    { id: '3', name: 'Slottsskogen' },
    { id: '4', name: 'Hisingen' },
    { id: '5', name: 'Majorna' },
    { id: '6', name: 'Frölunda' },
    { id: '7', name: 'Angered' },
    { id: '8', name: 'Mölndal' },
    { id: '9', name: 'Partille' },
    { id: '10', name: 'Kungsbacka' },
    { id: '11', name: 'Härryda' },
    { id: '12', name: 'Lerum' },
]

function CoursePage() {
    const { courseId, setCourseId, setCourseName } = useNewGame()
    const [newCourseName, setNewCourseName] = useState('')
    const [courses, setCourses] = useState(DUMMY_COURSES)
    const navigate = useNavigate()

    function addCourse() {
        if (newCourseName.trim() === '') return
        if (courses.some(c => c.name.toLowerCase() === newCourseName.trim().toLowerCase())) return
        const id = `new-${Date.now()}`
        setCourses(prev => [{ id, name: newCourseName.trim() }, ...prev])
        setCourseId(id)
        setCourseName(newCourseName.trim())
        setNewCourseName('')
    }

    function selectCourse(id: string, name: string) {
        setCourseId(id)
        setCourseName(name)
    }

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card>
                <button className="ghost" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
                <H2>Välj bana</H2>
                <p>Lägg till namnet på en ny bana</p>
                <input
                    placeholder="Skriv namnet"
                    value={newCourseName}
                    onChange={e => setNewCourseName(e.target.value)}
                />
                <Button onClick={addCourse}>Lägg till</Button>

                <H3>Eller välj en du redan spelat på</H3>

                <div className="course-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-item" onClick={() => selectCourse(course.id, course.name)}>
                        <div className="course-thumbnail">
                            {courseId === course.id && <span className="player-checkmark">✓</span>}
                        </div>
                        <span className="player-label">{course.name}</span>
                    </div>
                ))}
            </div>
            </Card>
            
            
            <Button disabled={!courseId} onClick={() => navigate('/new-game/holes')}>Nästa steg</Button>
        </div>
    )
}

export default CoursePage
