import React, { useEffect, useState } from 'react';
import LibraryIcon from '../assets/svgs/library.svg?react';
import Add from '../assets/svgs/add.svg?react';
import Arrow from '../assets/svgs/rightArrow.svg?react';
import Search from '../assets/svgs/search.svg?react';
import Recents from '../assets/svgs/recents.svg?react';
import { stationService } from '../services/station.service';
import StationMiniPreview from './StationMiniPreview';

export function SideBar() {
    const [ stations , setPlaylists ] = useState([])

    useEffect( ()=> {
        loadPlaylist()
    }, [])

    async function loadPlaylist(){
        //get stations array from local storage (all the ids)
        const playlistsArray = await stationService.getPlaylistByUser("ohad")
        setPlaylists( playlistsArray )
    }

    return (
        <div className="sidebar" >
        {/* <div data-testid="LayoutResizer__resize-bar" className="LayoutResizer__resize-bar LayoutResizer__inline-end"><label className="hidden-visually">Resize main navigation<input className="LayoutResizer__input" type="range" min="72" max="1021" step="10" /></label></div> */}
            
            <div className="sidebar-content" >
                {/* Your Library */}
                <div className="sidebar-section">
                    <div className="library-header">
                        <LibraryIcon className='library-icon' />
                        <h3 className='library'>Your Library</h3>
                    </div>
                    <div className="add-arrow">
                    <button className="library-add-btn"><Add className="Add-icon"/></button>
                    <button className="library-arrow-btn"><Arrow className="Arrow-icon"/></button>
                    </div>
                    
                </div>
                <div className="library-options">
                        <button className="library-btn">stations</button>
                        <button className="library-btn">Artists</button>
                    </div>

                {/* Station Section */}
                
                <div className="sidebar-stations">
                    <div className="serch-recents">
                    <button className="library-search-btn"><Search className="search-icon"/></button>
                    <button className="library-recents-btn"><h3>Recents</h3><Recents className="recents-icon"/></button>
                    </div>
                        <ul className="station-test">
                            {stations.map((station, index) => (
                                <StationMiniPreview key={index} stationInfo={station} />
                            ))}
                        </ul>
                </div>
            </div>

            {/* <div className="divider"/> */}

        </div>
    );
}

