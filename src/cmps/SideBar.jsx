import React from 'react';
import { NavLink } from 'react-router-dom';
// import LikedSongsIcon from '../assets/svgs/likedSongs.svg';
// import PlaylistIcon from '../assets/svgs/playlist.svg';
// import ArtistIcon from '../assets/svgs/artist.svg';
import LibraryIcon from '../assets/svgs/library.svg?react';
import Add from '../assets/svgs/add.svg?react';
import Arrow from '../assets/svgs/rightArrow.svg?react';
import Search from '../assets/svgs/search.svg?react';
import Recents from '../assets/svgs/recents.svg?react';
export function SideBar() {
    return (
        <div className="sidebar">
        

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
                    <li>
                        <NavLink to="/liked-songs">
                            {/* <LikedSongsIcon className="playlist-icon" />  */}
                            <span>Liked Songs</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/playlist/this-is-shrek">
                            {/* <PlaylistIcon className="playlist-icon" /> */}
                            <span>This Is ShrekDiMC</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/playlist/project-test">
                            {/* <PlaylistIcon className="playlist-icon" /> */}
                            <span>ProjectTestPlaylist</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/playlist/peer-tasi">
                            {/* <ArtistIcon className="playlist-icon" /> */}
                            <span>Peer Tasi</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

        </div>
    );
}