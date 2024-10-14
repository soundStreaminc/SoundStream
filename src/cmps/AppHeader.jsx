import { useState, useEffect } from 'react';
import { Link, Navigate, NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
// import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '../assets/svgs/search.svg?react';
import SpotifyIcon from '../assets/svgs/spotifyIcon.svg?react';
import HomeIcon from '../assets/svgs/home.svg?react';
// import  HomeIcon from '../assets/svgs/home.svg?react';
import BrowseIcon from '../assets/svgs/browse.svg?react';
import UserIcon from '../assets/svgs/user.svg?react';
import { stationService } from '../services/station.service';
import { searchArtists, searchPlaylists, searchSongs } from '../store/song/song.actions';
import { getExistingProperties } from '../services/util.service';

export function AppHeader() {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const DISPLAYEDSONGSNUMBER = 4

    const [activeButton, setActiveButton] = useState(''); // Track which button is active
    const [searchTerm, setSearchTerm] = useState(stationService.getFilterFromSearchParams(params)); // Declare and initialize searchTerm

    const handleHomeClick = () => {
        setActiveButton('home'); // Set home as the active button
    };

    const navigate = useNavigate()

    const handleBrowseClick = () => {
        setActiveButton('browse'); // Set home as the active button
    };
    const handleOtherButtonClick = () => {
        onClickSearch()
        setActiveButton(''); // Reset active button on other button click
    };

    const handleSearchChange = (event) => {
        if (event.target.value)
            navigate(`/search/${event.target.value}`)
        setSearchTerm({ filterText: event.target.value }); // Update searchTerm state when input changes
    };

    useEffect(() => {
        setSearchParams(searchTerm.size > 0 ? { filterText: searchTerm } : '')

    }, [searchTerm])

    async function onClickSearch() {
        console.log('appHeader searchTerm:', searchTerm)
        const foundArtist = onSearchArtist(searchTerm.filterText)
        const foundSongs = onSearchSongs(searchTerm.filterText)
        const foundPlaylist = onSearchPlaylists(searchTerm.filterText)
    }

    async function onSearchArtist(artist = '') {
        try {
            var foundArtists = artist ? searchArtists(artist) : ''
        } catch (err) {
            console.log('err:', err)
        }
    }

    async function onSearchSongs(song = '') {
        try {
            var foundSongs = song ? searchSongs(song, DISPLAYEDSONGSNUMBER) : ''
        } catch (err) {
            console.log('err:', err)
        }
    }

    async function onSearchPlaylists(playlists = '') {
        try {
            var foundPlaylists = playlists ? searchPlaylists(playlists, DISPLAYEDSONGSNUMBER) : ''
        } catch (err) {
            console.log('err:', err)
        }
    }

    function handleSearchClick() {
        if (!searchTerm.filterText)
            navigate(`/search/${searchTerm.filterText}`)
    }

    return (
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
                            placeholder="What do you want to play?"
                            value={searchTerm.filterText}  // Bind searchTerm to input
                            onChange={handleSearchChange} // Handle input change
                            onClick={handleSearchClick}
                        />

                        <div className='separator' />
                        <div className=' container-search-home'>
                            <NavLink to="/search">
                                <div exact="true"
                                    to="/"
                                    className={`app-header-icon browse-icon ${activeButton === 'browse' ? 'active' : ''}`}


                                    onClick={handleBrowseClick}>
                                    <Tooltip title="Browse" arrow>
                                        <div onClick={handleBrowseClick}>
                                            <BrowseIcon className="border-icon-browse" />
                                        </div>
                                    </Tooltip>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
                {/* Shopping Cart Icon */}
                <div className="cart-icon" onClick={handleOtherButtonClick}>
                    <i className="fas fa-shopping-cart"></i>
                </div>
            </nav>

            {/* <div className="tracks-container">
                <pre> 
                    found tracks: {JSON.stringify(foundTracks, null, "\t") }  
                </pre>   
            </div> */}

            {/* Right-side buttons */}
            <div className="app-header-right">
{/* 
                <div className="notification-icon">
                    <i className="fas fa-bell"></i>
                </div> */}

                <button className="user-profile-btn" >
                    <figure>
                        <div className="user-profile-container" style={{ "borderRadius" : "50%" ,"width" : "32px" , "height" : "32px", "insetInlineStart" : "0px"}}>
                            <img 
                                src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10216273432443013&height=50&width=50&ext=1731476384&hash=Abb3U5-0-6bLM3quVOH_n7mU" 
                                //alt="Yozik Personage"  TODO: ADD user name
                                className="user-profile-img" />
                        </div>
                    </figure>
                </button>
{/* 
                <div className="user-profile">
                    <UserIcon />
                </div> */}
            </div>
        </div>
    );
}
