import { NextPage } from "next";
import clientPromise from "../../lib/functions/mongodb";

const resetPassword: NextPage = () => {
    return (
        <div>

        </div>
    )
}

export async function getServerSideProps(context: any) {
    const getData = await fetch(
        `https://api.rawg.io/api/games/${context.params.id}?key=39a2bd3750804b5a82669025ed9986a8`
    )

    let db = null
    try {
        const client = await clientPromise
        db = client.db('gameFevr')
    } catch (e) {
        console.log('error', e)
        return {
            props: {
                error: 'Unexpected Error, try again',
                ok: false
            }
        }
    }

    try {
        const is_user_exists = await db.collection('users').findOne({ forgot_password_link: context.params.link })
        if (!is_user_exists) {
            throw new Error('Oops, the link has expired')
        } else {
            return {
                props: {
                    error: null,
                    ok: true
                }
            }
        }
    } catch (e) {
        return {
            props: {
                error: e,
                ok: false
            }
        }
    }


}

export default resetPassword