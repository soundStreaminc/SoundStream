import SpotifyIcon from '../assets/svgs/spotifyIcon.svg?react';
import ErrorIcon from '../assets/svgs/errorIcon.svg?react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { loginUser } from '../store/user/user.actions';

export function LoginSignup(){
    const [isSignup, setIsSignup] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullname, setFullname] = useState('')

    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [fullnameError, setFullnameError] = useState('')

    //will be in the store in the future
    let loggedinUser = useSelector ( storeState => storeState.loggedinUser ) 

    const navigate = useNavigate()

    function onValidation () {
        // Set initial error values to empty
        setUsernameError('')
        setPasswordError('')
        setConfirmPasswordError('')
        setFullnameError('')

        // Check if the user has entered both fields correctly
        if ('' === username) {
            setUsernameError('Please enter your Soundstream username or email address.')
            throw 'validation error'
        }

        // if (!/^[\w-\.]+/.test(username)) {
        //     setUsernameError('Please enter a valid username')
        //     throw 'validation error'
        // }

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

            if ('' === fullname) {
                setFullnameError('Please enter your fullname')
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
            showSuccessMsg( `Welcome ${user?.fullname}`)

        } catch (err) {
            console.log('cannot signup :', err)
            showErrorMsg( 'Cannot signup ')
        }finally{
            navigate('/')
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

                {/* TODO create component htmlFor button preview and map 3 buttons. */}
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
                </ul>

                <hr role="presentation" className="seperate-line"></hr>

                {!loggedinUser && 
                    <form className='form-container'>
                        <div className={'mainContainer'}>
                    {!isSignup && <div className={'titleContainer'}>
                        <div>Login</div>
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
                        <label className="errorLabel">{usernameError}</label>
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
                            required
                            />
                            <label className="errorLabel">{fullnameError}</label>
                        </div>
                    </div>
                    }

                    <br />
                    <div className={'actions-btn'}>
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
                <div data-testid="login-form" className="login-form-container" data-encore-id="formGroup">
                    <div className="sc-kinYwB dONESo">
                        <div className="form-group" data-encore-id="formGroup">
                            <div className="label-group">
                                <label htmlFor="login-username" className="login-username-label">
                                    <span className="login-username-span-label">Email or username</span>
                                </label>
                            </div>
                            
                            <input aria-invalid="true" className="login-username-input" data-encore-id="formInput" id="login-username" 
                                type="text" placeholder="Email or username" data-testid="login-username" autoCapitalize="off" autoComplete="username" 
                                    spellCheck="false" autoCorrect="off" aria-describedby="username-error" value="eranis54321@gmail.com" />
                            <div data-lastpass-icon-root=""  />
                            <div data-testid="username-error" id="username-error" className="error-svg-container" data-encore-id="formHelpText" >
                                
                                <ErrorIcon  className="ErrorIcon"/>
                            
                                    
                                <span className="login-username-span-input">Please enter your Spotify username or email address.</span>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className="Group-sc-u9bcx5-0 dTRcop sc-fpSrms bSfdyE" data-encore-id="formGroup">
                        <div className="LabelGroup-sc-1ibddrg-0 ebSvva encore-text-body-small-bold">
                            <label htmlFor="login-password" className="Label-sc-1c0cv3r-0 bGmVWE">
                                <span className="LabelInner-sc-19pye2k-0 kuCWup">Password</span>
                            </label>
                        </div>
                        
                        <div data-encore-id="formInputIcon" className="InputContainer-sc-a5ofs0-0 cUEVVf">
                            <input aria-invalid="true" className="Input-sc-1gbx9xe-0 ivEFDo encore-text-body-medium" data-encore-id="formInput" 
                                id="login-password" type="password" placeholder="Password" data-testid="login-password" autoComplete="current-password" 
                                    spellCheck="false" autoCorrect="off" aria-describedby="password-error" autoCapitalize="off" />
                            
                            {/* <div data-lastpass-icon-root=""  >
                                <div className="IconContainer-sc-1oa4n9m-0 gyyaHh">
                                    <button data-testid="login-password-preview" aria-label="show password" data-encore-id="buttonTertiary" className="Button-sc-1dqy6lx-0 bnvbjc">
                                        <span aria-hidden="true" className="IconWrapper__Wrapper-sc-16usrgb-0 hKVcO">
                                            <ErrorIcon  className="ErrorIcon"/>
                                        </span>
                                    </button>
                                </div>
                            </div> */}
                            
                            <div data-testid="password-error" id="password-error" className="error-svg-container" data-encore-id="formHelpText">
                                
                                <ErrorIcon  className="ErrorIcon"/>
                                
                                <span className="Text-sc-g5kv67-0 eZMwYi">Please enter your password.</span>
                            </div>
                        </div>
                    </div>
                    <div className="sc-gutikT sc-huvEkS fVbbtc leTZEG">
                    
                        <button id="login-button" data-testid="login-button" data-encore-id="buttonPrimary" className="Button-sc-qlcn5g-0 hFRjpO encore-text-body-medium-bold">
                            <span className="ButtonInner-sc-14ud5tc-0 hvvTXU encore-bright-accent-set">
                                <span className="encore-text encore-text-body-medium-bold sc-iKTcqh sc-gnpbhQ doOTMr cyUyia" data-encore-id="text">Log In</span>
                            </span>
                            <span className="ButtonFocus-sc-2hq6ey-0 gJnrqA"></span>
                        </button>
                    </div>
                    <div className="sc-ifyrTC sc-dENhDJ sc-eEPDDI dssuKg ilTmUK egGRlx">
                        <a href="#" id="reset-password-link" data-testid="reset-password-link" className="Link-sc-k8gsk-0 cgOuFc sc-euGpHm geXsAV" data-encore-id="textLink">
                            <p variant="bodyMedium" className="sc-czgmHJ kraIJY">Forgot your password?</p>
                        </a>
                    </div>
                </div>
                </form>
                }
            </div>
        </section>
    )
}