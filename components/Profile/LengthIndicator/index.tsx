type Props = {
    length: number
}

export default function LengthIndicator({ length }: Props) {
    return (
        <span className="font-semibold text-sm text-text-gray pl-1">
            ({length})
        </span>
    )
}