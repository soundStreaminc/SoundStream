import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import LikedSongsIcon from '../assets/svgs/likedSongs.svg';
// import PlaylistIcon from '../assets/svgs/playlist.svg';
// import ArtistIcon from '../assets/svgs/artist.svg';
import LibraryIcon from '../assets/svgs/library.svg?react';
import Add from '../assets/svgs/add.svg?react';
import Arrow from '../assets/svgs/rightArrow.svg?react';
import Search from '../assets/svgs/search.svg?react';
import Recents from '../assets/svgs/recents.svg?react';
import { stationService } from '../services/station.service';
import PlaylistDetails from './PlaylistDetails';

export function SideBar() {
    const [ playlists , setPlaylists ] = useState([])

    useEffect( ()=> {
        loadPlaylist()
    }, [])


    async function loadPlaylist(){
        //get playlists array from local storage (all the ids)
        const playlistsArray = await stationService.getPlaylistByUser("ohad")
        console.log('playlistsArray:', playlistsArray)
        setPlaylists( playlistsArray )
    }

    const samplePlaylists = [
        {
          image: 'https://link-to-image.com/image1.jpg',
          name: 'Liked Songs',
          owner: 'Spotify',
        },
        {
          image: 'https://link-to-image.com/image2.jpg',
          name: 'This Is ShrekDiMC',
          owner: 'Spotify',
        },
        // Add more sample playlists here...
      ];

    return (
        <div className="sidebar" >
        {/* <div data-testid="LayoutResizer__resize-bar" className="LayoutResizer__resize-bar LayoutResizer__inline-end"><label className="hidden-visually">Resize main navigation<input className="LayoutResizer__input" type="range" min="72" max="1021" step="10" /></label></div> */}
            
            <div className="sidebar-content" >
                {/* Your Library */}
                <div className="sidebar-section">
                    <div className="library-header">
                        <LibraryIcon className='library-icon' />
                        <h3>Your Library</h3>
                    </div>
                    <div className="add-arrow">
                    <button className="library-add-btn"><Add className="Add-icon"/></button>
                    <button className="library-arrow-btn"><Arrow className="Arrow-icon"/></button>
                    </div>
                    
                </div>
                <div className="library-options">
                        <button className="library-btn">Playlists</button>
                        <button className="library-btn">Artists</button>
                    </div>

                {/* Playlist Section */}
                
                <div className="sidebar-playlists">
                    <div className="serch-recents">
                    <button className="library-search-btn"><Search className="search-icon"/></button>
                    <button className="library-recents-btn"><h3>Recents</h3><Recents className="recents-icon"/></button>
                    </div>
                    <ul className="playlist-list">
                    {samplePlaylists.map((playlist, index) => (
                            <PlaylistDetails key={index} playlist={playlist} />
                        ))}
                    
                    </ul>
                </div>
            </div>

            {/* <div className="divider"/> */}

        </div>
    );
}

