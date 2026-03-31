interface Color {
    id: string
    name: string
    hexValue: string
  }

  interface ColorRankingProps {
    colors: Color[]
    onMove: (index: number, direction: 'up' | 'down') => void
  }

  function ColorRanking({ colors, onMove }: ColorRankingProps) {
    return (
        <div className="color-ranking">
            {colors.map((color, index) => (
                <div key={color.id} className="color-ranking__row" style={{ backgroundColor: color.hexValue }}>
                    <span className="color-ranking__name">{color.name}</span>
                    <div className="color-ranking__controls">
                        {index > 0 && <button className="color-ranking__btn" onClick={() => onMove(index, 'up')}>∧</button>}
                        {index < colors.length - 1 && <button className="color-ranking__btn" onClick={() => onMove(index, 'down')}>∨</button>}
                    </div>
                </div>
            ))}
        </div>
    )
  }

  export default ColorRanking