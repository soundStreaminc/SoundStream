import { useEffect } from "react"
import { useNavigate } from "react-router"

export function StationDetails_GeneralObjectMiniTitle({ miniStation }) {
    const navigate = useNavigate()

    function onButtonClickHandler (  ) {
        navigate(`/artist/${miniStation.artistId}`);
    }

    useEffect(() => {
        getMiniTitle()
    }, [])

    function getMiniTitle() {
        var stationMiniHeader = ''
        var stationTitleEl = document.querySelector(".station-title4")

        switch (miniStation.type) {
            /* TODO create a function to get the duration of the album. maybe api?*/
            case 'playlist':
                stationMiniHeader = `
    <span class="station-title4-container-p">
        ${miniStation.description}
    </span>

                <div class="station-sub-title">
        <b class='owner-name'> ${miniStation.owner} </b> 
        <span class='seperator-title'> • </span>                        
        ${miniStation.followers} save 
        <span class='seperator-title'> • </span>
        ${miniStation.count} songs, ${miniStation.length}
    </div>`
                break
            case 'album':
                stationMiniHeader = `
                <div class="station-sub-title-album">
                  <div class='artist-icon-container'>
                    <img src=${miniStation.image} class='artist-icon'/>
                  </div>
                  <b class='artist-name-album'>${miniStation.artist}</b>  
                  <span class='seperator-title-album'> • </span>                  
                  <div class='mini-title-release-date-album'>${getYearFromDate(miniStation.releaseDate).year}</div> 
                  <span class='seperator-title-album'> • </span>
                  ${miniStation.count} songs, ${miniStation.length}
                </div>`;
                break
            case 'track':
                stationMiniHeader =
                    `<div class="station-sub-title">
                    <div class='artist-icon-container'>
                        <img src=${miniStation.image} class='artist-icon'/>
                    </div> 
                 
                    <div class='mini-title-artist-name'> ${miniStation.artist} </div>
                    <span class='seperator-title'> • </span> 
                     <div class='mini-title-album-name'>${miniStation.album} </div>
                    <span class='seperator-title'> • </span>    
                    <div class='mini-title-release-date'> ${getYearFromDate(miniStation.releaseDate).year} </div> 
                    <span class='seperator-title'> • </span>                       
                    <div class='mini-title-duration'> ${convertMsToMinutes(miniStation.duration)}</div>
                </div>`
                break
            case 'artist':
                stationMiniHeader =
                    `<div class="station-sub-title">
                    ${miniStation.followers}  
                    followers
                </div>`
                break
            default:
                break
        }

        stationTitleEl.innerHTML = stationMiniHeader
    }

    function getYearFromDate(date) {
        const getDate = string => (([year, day, month]) => ({ day, month, year }))(string.split('-'));
        return getDate(date)
    }

    function convertMsToMinutes(miliSeconds) {
        const ms = miliSeconds
        const mmss = new Date(ms).toLocaleTimeString().substring(3, 7)
        return mmss
    }

    return (
        <div className="station-title4">

        </div>
    )
}