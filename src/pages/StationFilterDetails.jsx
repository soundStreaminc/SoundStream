import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { stationService } from "../services/station.service.js";
import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import MoreOptionFor from '../assets/svgs/moreOptionFor.svg?react';
import { showErrorMsg } from '../services/event-bus.service.js';
import { searchAlbums, searchArtists, searchPlaylists, searchSongs } from '../store/song/song.actions';
import { SearchResultsPreviewObject } from "../cmps/SearchResultsPreviewObject.jsx";

export function StationFilterDetails(){
    const [ foundArtists, setFoundArtists ] = useState ( [] )
    const [ foundSongs, setFoundSongs ] = useState ( [] )
    const [ foundPlaylists, setFoundPlaylists ] = useState ( [] )
    const [ foundAlbums, setFoundAlbums ] = useState ( [] )

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(params); // Declare and initialize searchTerm

    const DISPLAYEDSONGSNUMBER = 4
    var playlistsHeader = useRef('')

    useEffect(() => {
        loadFilterResults()
        //TODO add the debounce
    }, [params])

    async function loadFilterResults() {
        const foundArtist = await onSearchArtist(params.filterText)
        setFoundArtists(foundArtist)
        const foundSongs = await onSearchSongs(params.filterText)
        setFoundSongs(foundSongs)
        const foundPlaylist = await onSearchPlaylists(params.filterText)
        setFoundPlaylists(foundPlaylist)
        const foundAlbums = await onSearchAlbums(params.filterText)
        setFoundAlbums(foundAlbums)

        getHeader('playlist')
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
            playlistsHeader.current = getHeader('playlist')
            return foundPlaylists
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for playlist: ', err)
        }
    }

    async function onSearchAlbums(albums = '') {
        try {
            var foundAlbums = albums ? await searchAlbums(albums, DISPLAYEDSONGSNUMBER) : ''
            return foundAlbums
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for albums: ', err)
        }
    }

    async function onAddPlaylist(playlistId, playlistName, playlistType, user = 'ohad' ){
        try {
            if (playlistId && playlistName)
                await stationService.addPlaylist(playlistId, playlistName, playlistType, user)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem Adding Playlist: ', err)
        }
    }

    async function onAddAlbum( albumId, albumName, albumType, user = 'ohad' ){
        try {
            if ( albumId && albumName) 
                await stationService.addAlbum ( albumId, albumName , albumType, user )
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem Adding Album: ', err)
        }  
    }
    
    function getHeader( objectType){
        switch (objectType){
            case "playlist":
                return 'Playlists'
            default: 
                console.log('hrtr:')
                return 'header not found'
        }
    }

    if (!foundArtists[0] | !foundPlaylists[0] ) return <span> station filter details page loading.. </span>
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


                <div className="search-results-object-song-songs-container">
                    {foundSongs.map((song, i) => {
                        const durationInMinutes = Math.floor(song.duration_ms / 60000);
                        const durationInSeconds = Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, '0');
                        return (

                            <div className="search-results-object-song-mini-details-container" key={i}>
                                <div className="search-results-object-song-mini-details-sub-container" key={i + 'r'}>
                                    <div className="search-results-object-song-cover-container" key={i + 'a'}>
                                        <img
                                            className="search-results-object-song-music-cover"
                                            src={song.album.images[0].url}
                                            alt={`track artwork for ${song.name} by ${song.artists[0].name}`}
                                            key={i + 'q'}
                                        />
                                    </div>

                                    <div className="search-results-object-song-mini-details" key={i + 's'}>
                                        <div className="search-results-object-song-artist" key={i + 'o'}> {song.artists[0].name}  </div> { /*//get the details from the song  */}
                                        <p className="search-results-object-song-song-title" key={i + 'e'}> {song.name} </p>
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
                            <span> Albums </span>
                        </h2>
                    </div>

                    <div className="albums-container">
                        { foundAlbums.map( (album , i) =>{
                            const miniAlbum = {
                                id: album.id, 
                                type : album.type,
                                name: album.name,
                                image: album.images ? album.images[0].url : 'not found',
                                artist: album.artists ? album.artists[0].name : 'not found',
                                //followers: playlist.followers.total,
                            }
                            return <SearchResultsPreviewObject miniObject={miniAlbum} key={album.id}/>
                        }
                        ) }
                    </div> 
                </div>

            <div className="filter-songs-container">
                <div className="title">
                    <h2>
                        <span> {playlistsHeader.current} </span>
                    </h2>
                </div>

                <div className="playlists-container">

                    {foundPlaylists.map((playlist, i) => {
                        const miniPlaylist = {
                            id: playlist.id, 
                            type : playlist.type,
                            name: playlist.name,
                            image: playlist.images[0] ? playlist.images[0].url : 'not found',
                            owner: playlist.owner.display_name,
                            //followers: playlist.followers.total,
                        }
                        return <SearchResultsPreviewObject miniObject={miniPlaylist} key={playlist.id}/>
                    }
                    )}
                </div>
            </div>
        </section>
    )
}