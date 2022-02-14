import axios from "axios"

export async function getGames() {
    try {
        const req = await axios.get(`https://api.rawg.io/api/games?key=${process.env.key}`)
    } catch (e) {
        console.log(e)
    }
}