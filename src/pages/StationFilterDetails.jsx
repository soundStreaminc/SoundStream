import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { stationService } from "../services/station.service.js";
import AddToLiked from '../assets/svgs/addToLiked.svg?react';
import MoreOptionFor from '../assets/svgs/moreOptionFor.svg?react';
import { showErrorMsg } from '../services/event-bus.service.js';
import { searchAlbums, searchArtists, searchPlaylists, searchSongs } from '../store/song/song.actions';
import { SearchResultsPreviewObject } from "../cmps/SearchResultsPreviewObject.jsx";
import { utilService } from "../services/util.service.js";
import Play from '../assets/svgs/play.svg?react'
import Pause from '../assets/svgs/pause.svg?react'; // Import the Pause component
import PlayWithe from '../assets/svgs/playWithe.svg?react';
export const DISPLAYEDSONGSNUMBER = 4

export function StationFilterDetails(isPlayingSearchResult = false) {
    const DEBOUNCETIME = 300 //TODO should be in config
    const debounceFilterBy =
        useCallback(utilService.debounce(loadFilterResults, DEBOUNCETIME), [])

    const [foundArtists, setFoundArtists] = useState([])
    const [foundSongs, setFoundSongs] = useState([])
    const [foundPlaylists, setFoundPlaylists] = useState([])
    const [foundAlbums, setFoundAlbums] = useState([])

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(params); // Declare and initialize searchTerm
    const [isPlaying, setIsPlaying] = useState(isPlayingSearchResult);

    var playlistsHeader = useRef('')
    var artistHeader = useRef('')
    var albumsHeader = useRef('')
    var tracksHeader = useRef('')

    useEffect(() => {
        debounceFilterBy(params)
    }, [params])


    function onPlayPauseClick() {
        if (isPlaying) {
            setIsPlaying(false)
        } else {
            setIsPlaying(true)
        }
    }
    async function loadFilterResults(parameter) {
        // if(params.filterText) return
        const foundArtist = await onSearchArtist(parameter.filterText)
        setFoundArtists(foundArtist ? foundArtist : [])
        const foundSongs = await onSearchSongs(parameter.filterText)
        setFoundSongs(foundSongs ? foundSongs : [])
        const foundPlaylist = await onSearchPlaylists(parameter.filterText)
        setFoundPlaylists(foundPlaylist ? foundPlaylist : [])
        const foundAlbums = await onSearchAlbums(parameter.filterText)
        setFoundAlbums(foundAlbums ? foundAlbums : [])

        // getHeader('playlist')
        // getHeader('artist')
        // getHeader('album')
        // getHeader('track')
    }

    async function onSearchArtist(artist = '') {
        try {
            var foundArtists = artist ? await searchArtists(artist, DISPLAYEDSONGSNUMBER) : ''
            artistHeader.current = getHeader('artist')
            return foundArtists
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for artist: ', err)
        }
    }

    async function onSearchSongs(song = '') {
        try {
            var foundSongs = song ? await searchSongs(song, DISPLAYEDSONGSNUMBER) : ''
            tracksHeader.current = getHeader('track')
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
            albumsHeader.current = getHeader('album')
            return foundAlbums
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for albums: ', err)
        }
    }

    async function onAddPlaylist(playlistId, playlistName, playlistType, user = 'ohad') {
        try {
            if (playlistId && playlistName)
                await stationService.addPlaylist(playlistId, playlistName, playlistType, user)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem Adding Playlist: ', err)
        }
    }

    async function onAddAlbum(albumId, albumName, albumType, user = 'ohad') {
        try {
            if (albumId && albumName)
                await stationService.addAlbum(albumId, albumName, albumType, user)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem Adding Album: ', err)
        }
    }

    function getHeader(objectType) {
        switch (objectType) {
            case "playlist":
                return 'Playlists'
            case "artist":
                return 'Artists'
            case "album":
                return 'Albums'
            case "track":
                return 'Songs'
            default:
                return 'header not found'
        }
    }

    if (!foundArtists[0] | !foundPlaylists[0]) return <span> station filter details page loading.. </span>
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
                <div className="title-Songs">
                    <h2>  <span> Songs </span></h2>
                </div>

                <div className="top-result-container">
                    <div className="top-result-sub-container">
                        <div className="artist-image-container" >
                            <img className="artist-image" src={foundArtists[0].images[0] ? foundArtists[0].images[0].url : null} />                           
                        </div>
                        <div className="artist-name">
                            {foundArtists[0].name ? foundArtists[0].name : "not found"}
                        </div>

                        <span> Artist </span>
                        <div className='top-result-item-btn-container'>
                            {!isPlaying ? (
                                <button type="button" aria-label="Pause" className="search-results-item-btn" onClick={() => onPlayPauseClick(true)}>
                                    <span aria-hidden="true" className="search-results-item-svg-wrapper">
                                        <Pause />
                                    </span>
                                </button>
                            ) : (
                                <button type="button" aria-label="Play" className="search-results-item-btn" onClick={() => onPlayPauseClick(false)}>
                                    <span aria-hidden="true" className="search-results-item-svg-wrapper">
                                        <Play />
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>


                <div className="filter-songs-container">
                    <div className="search-results-object-song-songs-container">
                        {foundSongs.map((song, i) => {
                            const durationInMinutes = Math.floor(song.duration_ms / 60000);
                            const durationInSeconds = Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, '0');
                            return (

                                <a href={`/${song.type}/${song.id}`} className="search-results-object-song-mini-details-container" key={i}>
                                    <div className="search-results-object-song-mini-details-sub-container" key={i + 'r'}>
                                        <div className="search-results-object-song-cover-container" key={i + 'a'}>
                                            <img
                                                className="search-results-object-song-music-cover"
                                                src={song.album.images[0].url}
                                                alt={`track artwork for ${song.name} by ${song.artists[0].name}`}
                                                key={i + 'q'}
                                            />

                                            <button type="button" aria-label="Play" className="search-results-object-song-music-cover-playWithe" onClick={() => onPlayPauseClick(false)}>
                                                <span aria-hidden="true" className="search-results-item-svg-playWithe">
                                                    <PlayWithe />
                                                </span>
                                            </button>
                                        </div>

                                        <div className="search-results-object-song-mini-details" key={i + 's'}>
                                            <p className="search-results-object-song-song-title" key={i + 'e'}> {song.name} </p>
                                            <div className="search-results-object-song-artist" key={i + 'o'}> {song.artists[0].name}  </div> { /*//get the details from the song  */}
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


                                </a>
                            )
                        }
                        )}
                    </div>
                </div>
            </div>

            <div className="filter-artists-container">
                <div className="title">
                    <h2>
                        <span> {artistHeader.current} </span>
                    </h2>
                </div>

                <div className="artists-container">
                    {foundArtists.map((artist, i) => {
                        const miniArtist = {
                            id: artist.id,
                            type: artist.type,
                            name: artist.name,
                            image: artist.images ? artist.images[0].url : null,
                            followers: artist.followers.total,
                        }
                        return <SearchResultsPreviewObject miniObject={miniArtist} key={miniArtist.id} />
                    }
                    )}
                </div>
            </div>

            <div className="filter-albums-container">
                <div className="title">
                    <h2>
                        <span> {albumsHeader.current} </span>
                    </h2>
                </div>

                <div className="albums-container">
                    {foundAlbums.map((album, i) => {
                        const miniAlbum = {
                            id: album.id,
                            type: album.type,
                            name: album.name,
                            image: album.images ? album.images[0].url : null,
                            artist: album.artists ? album.artists[0].name : 'not found',
                            //followers: playlist.followers.total,
                        }
                        return <SearchResultsPreviewObject miniObject={miniAlbum} key={album.id} />
                    }
                    )}
                </div>
            </div>

            <div className="filter-playlists-container">
                <div className="title">
                    <h2>
                        <span> {playlistsHeader.current} </span>
                    </h2>
                </div>

                <div className="playlists-container">

                    {foundPlaylists.map((playlist, i) => {
                        const miniPlaylist = {
                            id: playlist.id,
                            type: playlist.type,
                            name: playlist.name,
                            image: playlist.images[0] ? playlist.images[0].url : null,
                            owner: playlist.owner.display_name,
                            //followers: playlist.followers.total,
                        }
                        return <SearchResultsPreviewObject miniObject={miniPlaylist} key={playlist.id} />
                    }
                    )}
                </div>
            </div>
        </section>
    )
}