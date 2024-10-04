import { useState, useEffect } from 'react';
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
import { stationService } from '../services/station.service';
import { useDispatch } from 'react-redux';
import { SET_ARTIST } from '../store/currentPlaylist/currentPlaylist.reducer';

export function AppHeader() {
    const dispatch = useDispatch()

    const [ foundTracks , setFoundTracks ] = useState([])

    const [activeButton, setActiveButton] = useState(''); // Track which button is active
    const [searchTerm, setSearchTerm] = useState(''); // Declare and initialize searchTerm

    useEffect(() => { console.log(activeButton) }, [activeButton])
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

    useEffect( ()=>{           
        const res = getTracksByArtist( searchTerm )
        console.log('res:', res)
    }, [ searchTerm ])

     /**
     * Get request with artist Id: grab all the albums from that article
     * @param {*} artist 
     */
     async function getTracksByArtist( artist = '' ){
        try {
            var foundArtist = artist !== '' ? await stationService.getArtist ( artist) : ''
            console.log('foundArtist:', foundArtist)
            // var returnedAlbums = await stationService.getAlbumsByArtistId (artistId)
            // var albumId = returnedAlbums[0].id
            // var foundTracks = await stationService.getTracksByAlbumId( albumId )
            // setFoundTracks ( foundTracks )
            addFoundArtist( foundArtist )
        } catch (err) {
            console.log('err:', err)
        }    
    }

    function addFoundArtist( foundArtist ){
        dispatch( { type: SET_ARTIST, artist: foundArtist })
    }

   

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
                            <div onClick={handleOtherButtonClick}>
                                <SearchIcon className="search-icon" />
                            </div>
                        </Tooltip>
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            value={searchTerm} // Bind searchTerm to input
                            onChange={handleSearchChange} // Handle input change
                        />

                        <div className='separator' />
                        <div className=' container-serch-home'>
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
