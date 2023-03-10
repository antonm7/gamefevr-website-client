import moment from "moment"
export default function generateMinutes() {
    //This time is generated whenever users makes any action,
    //because in the future if I want to check for a timeout,
    //i am checking if the saved time is bigger then the current time,
    // if the current is bigger that means there is still timout.
    const saved_timeout = moment().add(30, 'minutes')
    return saved_timeout.format()
}

