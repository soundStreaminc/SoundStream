import React, { useEffect, useState } from "react";
import { showErrorMsg } from '../services/event-bus.service.js';
import { stationService } from "../services/station.service.js";

export default function StationMiniPreview({ stationInfo }) {
  const [ station, setStation ]  = useState(null)

  useEffect(() => {
    //TODO disable first time mount (create use effect without running on intial)
    loadStation()
  }, []);

  async function loadStation(){
    try {
        if (! stationInfo.id) throw new Error ('error: did not get stationInfo.id')
        const loadedStation = await stationService.getStationById_SpotifyApi ( stationInfo.type,  stationInfo.id )
        setStation( loadedStation )
      } catch (err) {
        console.log('err:', err)
        showErrorMsg('problem loading Station: ', err)
    }  
  }

  function getStationOwnerArtist(stationType){
    var res;
    stationType === 'album' ? res = ( <h4> {stationType}*{station.artists[0].name} </h4> ) : res = ( <h4> {stationType}*{station.owner.display_name} </h4> ) 
    return res
  }

  if (!station || !station.images) return <span> station preview loading.. </span>
  return (
<section className="station-mini-preview">
  <li
    className="station-item"
    onClick={() => (window.location.href = `/${stationInfo.type}/${stationInfo.id}`)}
  >
    <div className="station-img-container">
      <img src={station.images[0].url} alt={station.name} className="station-img" />
      <div className="play-button-container">
        <button aria-label={`Play ${station.name}`} className="play-button">
          <span className="play-icon-wrapper">
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="more-option-for"
            >
              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
    <div className="station-info">
      <h3>{station.name || 'Station not found'}</h3>
      {getStationOwnerArtist(station.type)}
    </div>
  </li>
</section>
    
  );
}
