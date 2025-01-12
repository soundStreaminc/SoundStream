import SpotifyIcon from '../assets/svgs/spotifyIcon.svg?react';
import ErrorIcon from '../assets/svgs/errorIcon.svg?react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../store/user/user.actions';

export function LoginSignup(){
    const [isSignup, setIsSignup] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullname, setFullname] = useState('')

    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    //will be in the store in the future
    let loggedinUser = useSelector ( storeState => storeState.loggedinUser ) 

    const navigate = useNavigate()

    function onValidation () {
        // Set initial error values to empty
        setUsernameError('')
        setPasswordError('')
        setConfirmPasswordError('')

        // Check if the user has entered both fields correctly
        if ('' === username) {
            setUsernameError('Please enter your Soundstream username or email address.')
            throw 'validation error'
        }

        if ('' === password) {
            setPasswordError('Please enter a password')
            throw 'validation error'
        }

        if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer')
            throw 'validation error'
        }

        if (isSignup){
            if ('' === confirmPassword) {
                setConfirmPasswordError('Please enter your confirm Password')
                throw 'validation error'
            }

            if (password !== confirmPassword) {
                setConfirmPasswordError('your confirm Password and password must be identical')
                throw 'validation error'
            }

            if ('' === username) {
                setUsernameError('Please enter your Soundstream username or email address.')
                throw 'validation error'
            }
    
        }
    }

    async function onLogin () {
        try{
            onValidation()
        }catch (err){
            console.log('validation error :', err)
            return
        }

        try {
            var loggedUser = await userService.login ( { 
                username,
                password
            } )
            loginUser(loggedUser)
        } catch (err) {
            console.log('cannot login :', err)
            showErrorMsg( 'Cannot login ')
        } finally{
            navigate('/')
        }
    
    }

    function onBackLogin(){
        setIsSignup ( false )
    }

    function onSignup () {
        setIsSignup ( true )
    }

    async function onSubmit () {
        try{
            onValidation()
        }catch (err){
            console.log('validation error :', err)
            return
        }

        try {
            const user = await userService.signup( { 
                username,
                password,
                fullname
            } )
            loginUser(user)
            showSuccessMsg( `Welcome ${user?.username}`)

        } catch (err) {
            console.log('cannot signup :', err)
            showErrorMsg( 'Cannot signup ')
        }finally{
            navigate('/')
        }
    }

    async function onGuest () {
        try {
        const user = { 
            username: "guest",
            fullname: "guest",
            password: "guest",
        } 
        loginUser(user)
        showSuccessMsg( `Welcome ${user?.username}`)

        } catch (err) {
            console.log('cannot signup guest:', err)
            showErrorMsg( 'Cannot signup guest')
        }finally{
            navigate('/') 
        }
    }
        
    async function onLogout () {
        try {
            await userService.logout()
            logoutUser(null)
        } catch (err) {
            console.log('cannot logout')
        } 
    }

    return (
        <section className="login-page">
            <div className="login-bg-container">
                <div className="login-header-container">
                    <div className='login-header-sub-container'>
                        <SpotifyIcon className="login-logo" alt="Spotify Logo" title="Spotify" />   
                    </div>
                    
                 
                </div>
                <div className='login-title-container'> 
                        <h1 className='login-title'> Log in to Soundstream </h1>
                </div>
{/* 
                <ul className='continue-with-btns-container'>
                    <li className='continue-with-btn'>
                        <button data-testid="google-login" className="login-btn-container" data-encore-id="buttonSecondary">
                            <span name="new-google-icon" className="login-google-icon"></span>
                            <span className="continue-with-span" data-encore-id="text">Continue with Google</span>
                        </button>

                        <button data-testid="facebook-login" className="login-btn-container" data-encore-id="buttonSecondary">
                            <span name="new-facebook-icon" className="login-facebook-icon"></span>
                            <span className="continue-with-span" data-encore-id="text">Continue with Facebook </span>
                        </button>

                        <button data-testid="apple-login" className="login-btn-container" data-encore-id="buttonSecondary">
                            <span name="new-apple-icon" className="login-apple-icon"></span>
                            <span className="continue-with-span" data-encore-id="text">Continue with Apple</span>
                        </button>
                    </li>
                </ul> */}

                <hr role="presentation" className="seperate-line"></hr>
                <button type="button" onClick={onGuest} className="button-19" role="button"> Continue as a Guest </button>

                {!loggedinUser && 
                    <form className='form-container'>
                        <div className={'mainContainer'}>
                    {!isSignup && <div className={'titleContainer'}>
                        <div>Email or username</div>
                    </div>}

                    {isSignup && <div className={'titleContainer'}>
                        <div>Signup</div>
                    </div>}
                    <br />
                    <div className={'username-container'}>
                        <input
                        value={username}
                        placeholder="Email or username"
                        onChange={(ev) => setUsername(ev.target.value)}
                        className={'inputBox'}
                        />

                        {/* <ErrorIcon  className="ErrorIcon"/>            */}
                        <label className="errorLabel">{usernameError}</label>
                    </div>
                    <div className={'titleContainer'}>
                        <div>Password</div>
                    </div>
                    <br />
                    <div className={'password-container'}>
                        <input
                        value={password}
                        placeholder="Password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className={'inputBox'}
                        />
                        <label className="errorLabel">{passwordError}</label>
                    </div>

                    <br />
                    {isSignup && 
                    <div className='signup-extra-fields'>

                        <div className={'confirm-password-container'}>
                        <input
                            value={confirmPassword}
                            placeholder="Enter your confirm password here"
                            onChange={(ev) => setConfirmPassword(ev.target.value)}
                            className={'inputBox'}
                            required
                            />
                            <label className="errorLabel">{confirmPasswordError}</label>
                            <div data-testid="username-error" id="username-error" className="error-svg-container" data-encore-id="formHelpText" >
                                
                                <ErrorIcon  className="ErrorIcon"/>
                            
                                    
                                <span className="login-username-span-input">Please enter your Spotify username or email address.</span>
                            </div>
                        </div>

                        <br/>
                        <div className={'fullname-container'}>
                        <input
                            value={fullname}
                            placeholder="Enter your fullname here"
                            onChange={(ev) => setFullname(ev.target.value)}
                            className={'inputBox'}
                            />
                        </div>
                    </div>
                    }

                    <br />
                    <div className={'actions-btn-login'}>
                    {!isSignup && <div className='login-btns-container'>
                        <button className="button-19" role="button" onClick={onLogin} type="button"> Log in </button>
                        <button className="button-19" role="button" onClick={onSignup} type="button"> Sign up </button>
                    </div>
                    }
                    {isSignup&& <div className='login-btns-container'>
                        <button className="button-19" role="button" onClick={onBackLogin} type="button"> Back to Log in </button>
                        <button className="button-19" role="button" onClick={onSubmit} type="button"> Submit </button>
                    </div>}
                        
                    </div>
                   
                </div>
                </form>
                }
            </div>
        </section>
    )
}