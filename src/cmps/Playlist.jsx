import React, { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service"; // Import stationService

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);  // State to store playlists


  useEffect(() => {
    loadPlaylist()
    
  }, []);

  function loadPlaylist(){

    stationService.getPlaylistByName("smedjan")
  }

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    console.log("Selected Playlist ID:", selectedPlaylistId);  // Handle playlist change
    // You could perform more actions like dispatching, etc., here.
  };

  return (
    <div className="playlist-container">
      <ul>
        {playlists.length > 0 ? (
          playlists.map(({ name, id }) => (
            <li key={id} onClick={() => changeCurrentPlaylist(id)}>
              {name}
            </li>
          ))
        ) : (
          <li>No playlists found.</li>
        )}
      </ul>
    </div>
  );
}