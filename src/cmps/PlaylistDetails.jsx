import React, { useEffect, useState } from "react";
import omerAdamImage from '../assets/imgs/omerAdam.jpg'; // Import the image
import playPlaylist from '../assets/svgs/playPlaylist.svg?react'; // Import play icon

export default function PlaylistDetails({ playlist }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Your logic here (e.g., fetch playlists)
  }, []);

  return (
    <li className="playlist-item" onClick={() => console.log('Clicked on playlist:', playlist.name)}>
      <div className="playlist-img-container">
        <img src={omerAdamImage} alt={playlist.name} className="playlist-img" />
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
        <p>Playlist . Spotify</p>
      </div>
    </li>
  );
}
