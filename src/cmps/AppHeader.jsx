import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '../assets/svgs/search.svg?react';
import SpotifyIcon from '../assets/svgs/spotifyIcon.svg?react';
import HomeIcon from '../assets/svgs/home.svg?react';
import BrowseIcon from '../assets/svgs/browse.svg?react';
import UserIcon from '../assets/svgs/noImageArtist.svg?react';
import { stationService } from '../services/station.service';
import { IconButton }  from '@material-ui/core'
import AddIcon from '../assets/svgs/add.svg?react'
import LibraryIcon from '../assets/svgs/library.svg?react'
import playShuffleBtn from "../assets/imgs/play-shuffle-button.jpg"

export function AppHeader() {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoggedIn, setIsLoggedIn] = useState(false); // // TODO get the login token from the store


    const [activeButton, setActiveButton] = useState('home'); // Track which button is active
    const [searchTerm, setSearchTerm] = useState(stationService.getFilterFromSearchParams(params)); // Declare and initialize searchTerm

    const handleHomeClick = () => {
        navigate("/")
        setActiveButton('home'); // Set home as the active button
    }

    function handleSearchMobileClick() {
        navigate("/search")
        setActiveButton('search'); // Set search as the active button
    }

    const handleLibraryClick = () => {
        //navigate("/library")
        setActiveButton('library'); // Set library as the active button
    }

    const handlePreferencesClick = () => {
        //navigate("/preferences")
        setActiveButton('preferences'); // Set preferences as the active button
    }

    const handleAddClick = () => {
        //navigate("/add")
        setActiveButton('add'); // Set add as the active button
    }

    const navigate = useNavigate()

    function navigateToChat(){
        navigate("/chat")
    }
    const handleBrowseClick = () => {
        // navigate("/search")
        setActiveButton('browse'); // Set home as the active button
    }
    
    const handleOtherButtonClick = () => {
        onClickSearch()
        setActiveButton(''); // Reset active button on other button click
    }

    const handleSearchChange = (event) => {
        if (event.target.value)
            navigate(`/search/${event.target.value}`)
        setSearchTerm({ filterText: event.target.value }); // Update searchTerm state when input changes
    }

    useEffect(() => {
        setSearchParams(searchTerm.size > 0 ? { filterText: searchTerm } : '')

    }, [searchTerm])

    function handleSearchClick() {
        if (!searchTerm.filterText) navigate(`/search/${searchTerm.filterText}`)
    }
    
    const handleLoginClick = () => {
        setIsLoggedIn(true) // TODO add to store the login token
        //navigate("/login");
    };

    const handleSignUpClick = () => {
        navigate("/login");
    };

    return (
        <>
            <div className="app-header">
                <Link to="/">
                    <SpotifyIcon className="app-header-logo" alt="Spotify Logo" title="Spotify" />
                </Link>
                {/* Home and Search */}
                <nav className="container-mid-app-header">
                    <div className=' container-search-home'>
                        <Tooltip title="Home" arrow>
                            <div
                                exact="true"
                                to="/"
                                className={`app-header-icon home-icon ${activeButton === 'home' ? 'active' : ''}`}

                                onClick={handleHomeClick}
                            >
                                <HomeIcon className="border-icon"
                                    fill={activeButton === 'home' ? "#fff" : "#333"} // Change color based on active state
                                // color={activeButton === 'home' ? "#333" : "#fff"} 
                                />
                            </div>
                        </Tooltip>

                        {/* Search Bar */}
                        <div className="search-bar">
                            <Tooltip title="Search" arrow>
                                <div onClick={handleOtherButtonClick}>
                                    <SearchIcon className="search-icon" />
                                </div>
                            </Tooltip>
                            <input
                                type="text" 
                                className='search-bar-input'
                                placeholder="What do you want to play?"
                                value={searchTerm.filterText}  // Bind searchTerm to input
                                onChange={handleSearchChange} // Handle input change
                                onClick={handleSearchClick}
                            />

                            <div className='separator' />
                            <div className=' container-search-home'>

                                <Tooltip title="Browse" arrow>
                                    <button
                                        className={`app-header-icon browse-icon ${activeButton === 'browse' ? 'active' : ''}`}
                                        onClick={() => {
                                            navigate("/search");
                                            setActiveButton("browse");
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '0',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <BrowseIcon className="border-icon-browse" />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    {/* Shopping Cart Icon */}
                    <div className="cart-icon" onClick={handleOtherButtonClick}>
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                </nav>

                {/* Right-side buttons */}
                <div className="app-header-right">
                    {isLoggedIn ? (
                        <button className="user-profile-btn" >
                            <figure>
                                <div className="user-profile-container" style={{ "borderRadius": "50%", "width": "32px", "height": "32px", "insetInlineStart": "0px" }}>
                                    <UserIcon />
                                </div>
                            </figure>
                        </button>
                    ) : (
                        <div className="auth-buttons">
                        <button className="signup-btn" onClick={handleSignUpClick}>
                            Sign up
                        </button>
                        <button className="login-btn" onClick={handleLoginClick}>
                            Log in
                        </button>
                    </div>
                    )} 
                </div>
            </div>

            <div className="app-header-mobile">
                <div className='menu-icons-container'>
                    <IconButton className='menu-icon-container' onClick={handleHomeClick}>
                        <HomeIcon className={`menu-icon ${activeButton === 'home' ? 'active' : ''}`} />                  
                    </IconButton>
                    <IconButton className='menu-icon-container' onClick={handleSearchMobileClick}>
                        <SearchIcon className={`menu-icon ${activeButton === 'search' ? 'active' : ''}`} />                  
                    </IconButton>  
                    <IconButton className='menu-icon-container' onClick={handleLibraryClick}>
                        <LibraryIcon className={`menu-icon ${activeButton === 'library' ? 'active' : ''}`} />                  
                    </IconButton>
                    <IconButton className='menu-icon-container' onClick={handlePreferencesClick}>
                        <img src={playShuffleBtn} className={`menu-icon ${activeButton === 'preferences' ? 'active' : ''}`} />
                    </IconButton>
                    <IconButton className='menu-icon-container' onClick={handleAddClick}>
                        <AddIcon className={`menu-icon  ${activeButton === 'add' ? 'active' : ''}`} />                  
                    </IconButton>  
                </div>
                
                <div className='menu-text-container'>
                    <div className='home-text'>
                        Home
                    </div>
                    <div className='search-text'>
                        Search
                    </div>
                    <div className='library-text'>
                        Library
                    </div>
                    <div className='preferences-text'>
                        Preferences
                    </div>
                    <div className='create-text'>
                        Create
                    </div>         
                                
                </div>
            </div>
        </>    
    );
}
