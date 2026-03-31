import avatar_overlay from '../../assets/avatars/Avatar_Overlay_400x400.png'

interface Avatar {
    id: string
    src: string
  }

  interface AvatarPickerProps {
    avatars: Avatar[]
    selectedId: string | null
    onSelect: (id: string) => void
    accentColor: string
  }

  function AvatarPicker({ avatars, selectedId, onSelect, accentColor }: AvatarPickerProps) {
    return (
      <div className="player-grid">
        {avatars.map(avatar => (
          <div
            key={avatar.id}
            className="player-item"
            onClick={() => onSelect(avatar.id)}
          >
            <div
              className="player-circle"
              style={{ backgroundColor: selectedId === avatar.id ? accentColor : '#9ca3af' }}
            >
              <img src={avatar.src} alt={avatar.id} className="avatar-img" />
              <img src={avatar_overlay} className="avatar-overlay" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  export default AvatarPicker