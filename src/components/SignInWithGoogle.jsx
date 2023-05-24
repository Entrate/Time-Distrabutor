import { GoogleAuthProvider,signInWithPopup } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, setDoc } from 'firebase/firestore'
import googleLogo from "../assets/googleLogo.png"

const SignInWithGoogle = ({updateStatus, timer}) => {

  let userIsSignedIn = false

  const handleGoogle = async (e) => {
    const provider = await new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      updateStatus()
      
      setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
      }, {merge:true})
      

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }
 
  return (
  <div className="sign-in-box">
    <h1 className="title">SIGN IN</h1>
    <button onClick={handleGoogle} className="sign-in-with-google-button">
        <img src={googleLogo} className="google-logo"/>
          <b className="text">
          Google
          </b>
    </button>
  </div>
  )
}
export default SignInWithGoogle