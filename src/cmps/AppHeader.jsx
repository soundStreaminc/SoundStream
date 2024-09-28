import { useState,useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
// import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '../assets/svgs/search.svg?react';
import SpotifyIcon from '../assets/svgs/spotifyIcon.svg?react';
import HomeIcon from '../assets/svgs/home.svg?react';
// import  HomeIcon from '../assets/svgs/home.svg?react';
import BrowseIcon from '../assets/svgs/browse.svg?react';
import UserIcon from '../assets/svgs/user.svg?react';

export function AppHeader() {
    const [activeButton, setActiveButton] = useState(''); // Track which button is active
    const [searchTerm, setSearchTerm] = useState(''); // Declare and initialize searchTerm

useEffect(( )=>{ console.log(activeButton)} ,[activeButton])
    const handleHomeClick = () => {
        setActiveButton('home'); // Set home as the active button
    };
    const handleBrowseClick = () => {
        setActiveButton('browse'); // Set home as the active button
    };
    const handleOtherButtonClick = () => {
        setActiveButton(''); // Reset active button on other button click
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update searchTerm state when input changes
    };

    return (
        <div className="app-header">
            <Link to="/">
                <SpotifyIcon className="app-header-logo" alt="Spotify Logo" title="Spotify" />
            </Link>
            {/* Home and Search */}
            <nav className="container-mid-app-header">
                <div className=' container-serch-home'>
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
                            <SearchIcon className="search-icon" onClick={handleOtherButtonClick} />
                        </Tooltip>
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            value={searchTerm} // Bind searchTerm to input
                            onChange={handleSearchChange} // Handle input change
                        />

                        <div className='separator'/>
                        <div className=' container-serch-home'>
                        <div    exact="true"
                            to="/"
                            className={`app-header-icon browse-icon ${activeButton === 'browse' ? 'active' : ''}`}


                            onClick={handleBrowseClick}>
                        <Tooltip title="Browse" arrow>
                        <BrowseIcon className="border-icon-browse" fill={activeButton === 'browse' ? "#fff" : "#333"} />
                        </Tooltip >
                        </div>
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

                <div className="notification-icon">
                    <i className="fas fa-bell"></i>
                </div>
                <div className="user-profile">
                    <UserIcon />
                </div>
            </div>
        </div>
    );
}
