type Props = {
    message: string | null
}

function ErrorMessage({ message }: Props) {
    if (!message) return null
    return <div className="error-message">{message}</div>
}

export default ErrorMessage
