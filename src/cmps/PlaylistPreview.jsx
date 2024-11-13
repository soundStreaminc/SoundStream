import React, { useEffect, useState } from "react";
import { showErrorMsg } from '../services/event-bus.service.js';
import { stationService } from "../services/station.service";

export default function PlaylistPreview({ playlistInfo }) {
  const [ playlist, setPlaylist ]  = useState(null)

  useEffect(() => {
    //TODO disable first time mount (create use effect without running on intial)
    loadPlaylist()
  }, []);

  async function loadPlaylist(){
    try {
        if (! playlistInfo.id) throw new Error ('error: did not get playlistInfo.id')
        const loadedPlaylist = await stationService.getPlaylistById_SpotifyApi ( playlistInfo.id )
        setPlaylist( loadedPlaylist )
      } catch (err) {
        console.log('err:', err)
        showErrorMsg('problem loading Playlist: ', err)
    }  
}

  if (!playlist ) return <span> playlist preview loading.. </span>
  return (
    <li className="playlist-item" onClick={() => console.log('Clicked on playlist:', playlist.name)}>
      <div className="playlist-img-container">
        <img src={playlist.images[0].url} alt={playlist.name} className="playlist-img" />
        <div className="play-button-container">
          <button aria-label={`Play ${playlist.name}`} className="play-button">
            <span aria-hidden="true" className="play-icon-wrapper">
              {/* <img src={playPlaylist} alt="Play" /> */}
            </span>
          </button>
        </div>
      </div>
      <div className="playlist-info">
        <h3>{playlist.name || "This is ShrekDiMC"}</h3>
      </div>
    </li>
  );
}
