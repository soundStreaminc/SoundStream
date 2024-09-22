
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';


export function AppHeader() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (ev) => {
        setSearchTerm(ev.target.value);
    };
    return (
        <div className="app-header">
            <Link to="/">
                <img className="app-header-logo" src="img/spotifty.png" alt="Spotify Logo" title="Spotify" />
            </Link>
            {/* Home and Search */}
            <nav className="app-header-nav">
                <Tooltip title="Home" arrow>
                    <NavLink exact="true" to="/" className="app-header-icon home-icon" >
                        <span className="material-symbols-outlined"
                            style={{ fontSize: '1.7rem' }}  // Increase icon size here
                        >home</span>

                    </NavLink>
                </Tooltip>

                {/* Search Bar */}
                <div className="search-bar" >
                    <Tooltip title="Search" arrow>
                        <SearchIcon className="search-icon" />
                    </Tooltip>
                    <input
                        type="text"
                        placeholder="What do you want to play?"
                        value={searchTerm}
                        onChange={handleChange}
                    />

                    <div className="separator" />
                    <img className="browse-icon" src="img/browse.png" title="Browse" /> {/* Browse Icon */}
                </div>

                {/* Shopping Cart Icon */}
                <div className="cart-icon">
                    <i className="fas fa-shopping-cart"></i>
                </div>
            </nav>
            {/* Right-side buttons */}
            <div className="app-header-right">
                {/* <NavLink to="/premium" className="btn btn-premium">
          Explore Premium
        </NavLink> */}
                <NavLink to="/install" className="btn btn-install">
                    Install App
                </NavLink>
                <div className="notification-icon">
                    <i className="fas fa-bell"></i>
                </div>
                <div className="user-profile">
                    <AccountCircleIcon />
                </div>
            </div>
        </div>


    )
}