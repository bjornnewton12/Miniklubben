interface NumberPadProps {
    onSelect: (value: number) => void
    onDelete: () => void
    onClose: () => void
}

function NumberPad({ onSelect, onDelete, onClose }: NumberPadProps) {
    return (
        <div className="number-pad">
            <div className="number-pad__grid">
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                    <button key={n} className="number-pad__key" onClick={() => onSelect(n)}>{n}</button>
                ))}
                <button className="number-pad__key number-pad__key--action" onClick={onDelete}>X</button>
                <button className="number-pad__key number-pad__key--action" onClick={onClose}>V</button>
            </div>
        </div>
    )
}

export default NumberPad
