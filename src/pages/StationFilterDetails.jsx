import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { stationService } from "../services/station.service.js";
import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import MoreOptionFor from '../assets/svgs/moreOptionFor.svg?react';
import { showErrorMsg } from '../services/event-bus.service.js';
import Play from '../assets/svgs/play.svg?react'

import { searchArtists, searchPlaylists, searchSongs } from '../store/song/song.actions';
export function StationFilterDetails(){
    const [ foundArtists, setFoundArtists ] = useState ( [] )
    const [ foundSongs, setFoundSongs ] = useState ( [] )
    const [ foundPlaylists, setFoundPlaylists ] = useState ( [] )

    // let foundArtists = useSelector ( storeState => storeState.foundArtists )
    // let foundSongs = useSelector ( storeState => storeState.foundSongs )
    // let foundPlaylists = useSelector ( storeState => storeState.foundPlaylists )

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()  
    const [searchTerm, setSearchTerm] = useState(params); // Declare and initialize searchTerm

    const DISPLAYEDSONGSNUMBER = 4


    useEffect( ()=>{      
        loadFilterResults()
        //TODO add the debounce
    },  [params])

    async function loadFilterResults() {
        const foundArtist = await onSearchArtist(params.filterText)
        setFoundArtists(foundArtist)
        const foundSongs = await onSearchSongs(params.filterText)
        setFoundSongs(foundSongs)
        const foundPlaylist = await onSearchPlaylists(params.filterText)
        setFoundPlaylists(foundPlaylist)
    }

    async function onSearchArtist(artist = '') {
        try {
            var foundArtists = artist ? await searchArtists(artist) : ''
            return foundArtists
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for artist: ', err)
        }
    }

    async function onSearchSongs(song = '') {
        try {
            var foundSongs = song ? await searchSongs(song, DISPLAYEDSONGSNUMBER) : ''
            return foundSongs
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for songs: ', err)
        }
    }

    async function onSearchPlaylists(playlists = '') {
        try {
            var foundPlaylists = playlists ? await searchPlaylists(playlists, DISPLAYEDSONGSNUMBER) : ''
            return foundPlaylists
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for playlist: ', err)
        }
    }

    async function onAddPlaylist(playlistId, playlistName, user = 'ohad') {
        try {
            if (playlistId && playlistName)
                await stationService.addPlaylist(playlistId, playlistName, user)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem Adding Playlist: ', err)
        }
    }
    if (!foundArtists[0] ) return <span> station filter details page loading.. </span>
    return (
        <section className="station-filter-container">
            <div className="filter-menu-container">
                <button className="filter-btn"> All </button>
                <button className="filter-btn"> Artists </button>
                <button className="filter-btn"> Songs </button>
            </div>
            <div className="filter-top-result-container">
                <div className="title">
                    <h2>
                        <span> Top result </span>
                    </h2>
                </div>


                <div className="top-result-container">
                    <div className="top-result-sub-container">
                        <div className="artist-image-container" >
                            <img className="artist-image" src={foundArtists[0].images[0] ? foundArtists[0].images[0].url : "not found"} />
                        </div>
                        <div className="artist-name">
                            {foundArtists[0].name ? foundArtists[0].name : "not found"}
                        </div>
                        <span> Artist </span>
                    </div>
                </div>
            </div>

            <div className="filter-songs-container">
                <div className="title">
                    <h2>
                        <span> Songs </span>
                    </h2>
                </div>


                <div className="songs-container">
                    {foundSongs.map((song, i) => {
                        const durationInMinutes = Math.floor(song.duration_ms / 60000);
                        const durationInSeconds = Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, '0');
                        return (

                            <div className="mini-details-container" key={i}>
                                <div className="mini-details-sub-container" key={i + 'r'}>
                                    <div className="musicCover-container" key={i + 'a'}>
                                        <img
                                            className="musicCover"
                                            src={song.album.images[0].url}
                                            alt={`track artwork for ${song.name} by ${song.artists[0].name}`}
                                            key={i + 'q'}
                                        />
                                    </div>

                                    <div className="mini-details" key={i + 's'}>
                                        <div className="artist" key={i + 'o'}> {song.artists[0].name}  </div> { /*//get the details from the song  */}
                                        <p className="song-title" key={i + 'e'}> {song.name} </p>
                                    </div>


                                </div>

                                <div className="song-actions">
                                    <div className="action-icon">
                                        <span aria-hidden="true" className="iconWrapper">
                                            <AddToLiked className="add-to-liked" />
                                        </span>
                                    </div>
                                    <div className="song-duration">{durationInMinutes}:{durationInSeconds}</div>
                                    <div className="action-icon">
                                    <span aria-hidden="true" className="iconWrapper">
                                        <MoreOptionFor className="more-option-for" />
                                        </span>
                                    </div>
                                </div>


                            </div>
                        )
                    }
                    )}
                </div>


            </div>

            <div className="filter-songs-container">
                <div className="title">
                    <h2>
                        <span> Playlists </span>
                    </h2>
                </div>

                <div className="playlists-container">
                    {foundPlaylists.map((playlist, i) => {
                        return (

                            <a href={`/playlist/${playlist.id}`} className="playlists-mini-details-container" key={i}>

                                <button key={i + 'y'} type="button" className="playlists-add-playlist-btn" onClick={() => onAddPlaylist(playlist.id, playlist.name)}></button>

                                <div className="playlists-mini-details-sub-container" key={i + 'r'}>
                                    <div className="musicCover-container" key={i + 'a'}>
                                        <img
                                            className="playlists-musicCover"
                                            src={playlist.images[0].url}
                                            alt={`track artwork for ${playlist.name}`}
                                            key={i + 'q'}

                                        />
                                        <span aria-hidden="true" className="iconWrapper">
                                            <Play className="action-btn3" />
                                        </span>
                                    </div>

                                    <div className="playlists-mini-details" key={i + 's'}>
                                        {/* <p className="playlist-title" key={i + 'e'}> {playlist.name} </p> */}
                                        <p className="playlist-title">{playlist.name}</p>
                                        <p className="playlist-subtitle">By {playlist.owner.display_name}</p>
                                    </div>


                                </div>
                            </a>

                        )
                    }
                    )}
                </div>
            </div>
        </section>
    )
}