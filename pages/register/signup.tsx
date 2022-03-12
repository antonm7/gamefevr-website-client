import { NextPage } from "next"

const Signup:NextPage = () => {
    const signup = async () => {
        //validate inputs
        //make call for /api/auth/signup
        //to create our user
        // try {
        //   const res = await fetch('/api/auth/signup', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email: signupEmail,
        //         password: signupPassword,
        //         username
        //     })
        //   })
    
        //   const data = await res.json()
        // check the response, if its ok we can authorize the user
        //   if(res.status === 201) {
        //     signIn('credentials', {
        //       redirect: false,
        //       email: signupEmail,
        //       password: signupPassword
        //     }).then(() => router.push('/'))
        //   } else {
        //     setLoading(false)
        //     setSignuperror(data.error)
        //   }
        // } catch (e) {
        //   setLoading(false)
        //   return store.setGlobalError('Failed to signup... :(')
        // }
      }
    return (
        <>
            Sign Up
        </>
    )
}
export default Signup