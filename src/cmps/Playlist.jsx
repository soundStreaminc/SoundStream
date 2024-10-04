import React, { useEffect, useRef, useState } from "react";
import { stationService } from "../services/station.service"; // Import stationService

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);  // State to store playlists
  let token = useRef('')


  useEffect(() => {
    const fetchPlaylists = async () => {
 
      // try {
      //   // Fetch access token from stationService
      //   console.log("Fetching access token...");
      //   await stationService.getAccessKey().then( result => result.json())
      //   .then( data => {  token.current = data.access_token
      //     console.log("data.access_token",data.access_token);
      //    }) 
      //   console.log("Access token received:", token.current);

      //   // Fetch playlist data using the token
      //   if (token.current) {
      //     console.log("Fetching playlists data...");
      //     const playlistsData = await stationService.getPlaylistData(token.current);
      //     console.log("Playlists data received:", playlistsData);
      //     setPlaylists(playlistsData);  // Save the fetched playlists
      //   } else {
      //     console.error("Failed to get access token");
      //   }
      // } catch (error) {
      //   console.error("Error fetching playlists:", error);
      // }
    };

    fetchPlaylists();  // Call function to fetch playlists
  }, []);

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
