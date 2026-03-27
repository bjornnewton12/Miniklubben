interface Color {
    id: string
    name: string
    hex: string
  }

  interface ColorRankingProps {
    colors: Color[]
    onMove: (index: number, direction: 'up' | 'down') => void
  }

  function ColorRanking({ colors, onMove }: ColorRankingProps) {
    return (
      <div className="flex flex-col gap-3">
        {colors.map((color, index) => (
          <div
            key={color.id}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-white font-medium"
            style={{ backgroundColor: color.hex }}
          >
            <span>{color.name}</span>
            <div className="flex flex-col">
              <button onClick={() => onMove(index, 'up')} className="text-white leading-none">∧</button>
              <button onClick={() => onMove(index, 'down')} className="text-white leading-none">∨</button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  export default ColorRanking