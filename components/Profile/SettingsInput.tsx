interface Props {
  placeholder: string
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SettingsInput({
  placeholder,
  label,
  type,
  value,
  onChange,
}: Props) {
  return (
    <>
      <h3 className="pt-8 pb-3 text-lg" style={{ color: '#9da8b6' }}>
        {label}
      </h3>
      <input
        value={value}
        id="placeholder-text"
        placeholder={placeholder}
        className="h-14 w-full rounded-md text-white text-md outline-none px-5 "
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255,255,255,0.2)',
          borderWidth: 0.5,
        }}
        disabled={type === 'email' ? true : false}
        type={type}
        onChange={onChange}
      />
    </>
  )
}
