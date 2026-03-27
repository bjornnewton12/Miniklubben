interface Avatar {
    id: string
    src: string
  }

  interface AvatarPickerProps {
    avatars: Avatar[]
    selectedId: string | null
    onSelect: (id: string) => void
  }

  function AvatarPicker({ avatars, selectedId, onSelect }: AvatarPickerProps) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {avatars.map(avatar => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`rounded-full overflow-hidden border-4 ${selectedId === avatar.id ? 'border-gray-500' : 'border-transparent'}`}
          >
            <img src={avatar.src} alt={avatar.id} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    )
  }

  export default AvatarPicker