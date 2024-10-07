import React, { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service"; // Import stationService

export default function PlaylistDetails ( playlist ) {
  const [playlists, setPlaylists] = useState([]);  // State to store playlists


  useEffect(() => {
    
  }, []);

  return (
    <div className="playlist-container">
      <ul>
            {playlist && (
              <li key={id} onClick={() => changeCurrentPlaylist(id)}>
                {playlist.name}
              </li>
            )}
      </ul>
    </div>
  );
}