export default function generateTime(timeStamp: Date): string {
    const date = new Date(timeStamp)
    const dateFormat = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
    return dateFormat
}