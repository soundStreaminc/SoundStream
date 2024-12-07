import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { showErrorMsg } from '../services/event-bus.service.js';
import { searchAlbums, searchArtists, searchPlaylists, searchSongs } from '../store/song/song.actions';
import { SearchResultsPreviewObject } from "../cmps/SearchResultsPreviewObject.jsx";
import { getHeader, utilService } from "../services/util.service.js";
import { StationFilterDetails_TopResult } from "../cmps/StationFilterDetails_TopResult.jsx";
import { StationFilterDetails_SongsResults } from "../cmps/StationFilterDetails_SongsResults.jsx";

export const DISPLAYEDSONGSNUMBER = 4
export const DISPLAYEDCATEGORIESNUMBER = 6

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

    async function onSearchArtist(artist = '') {
        try {
            var foundArtists = artist ? await searchArtists(artist, DISPLAYEDCATEGORIESNUMBER) : ''
            artistHeader.current = getHeader('artist')
            return foundArtists
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for artist: ', err)
        }
    }

    async function onSearchPlaylists(playlists = '') {
        try {
            var foundPlaylists = playlists ? await searchPlaylists(playlists, DISPLAYEDCATEGORIESNUMBER) : ''
            playlistsHeader.current = getHeader('playlist')
            return foundPlaylists
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for playlist: ', err)
        }
    }

    async function onSearchAlbums(albums = '') {
        try {
            var foundAlbums = albums ? await searchAlbums(albums, DISPLAYEDCATEGORIESNUMBER) : ''
            albumsHeader.current = getHeader('album')
            return foundAlbums
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('problem searching for albums: ', err)
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

               <StationFilterDetails_TopResult topResult={foundArtists[0]}/>

                <StationFilterDetails_SongsResults songs={foundSongs}/>
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
                            image: artist.images[0] ? artist.images[0].url : null,
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
                        return <SearchResultsPreviewObject miniObject={miniPlaylist} key={playlist.id}  playlistTrack={foundPlaylists[0].tracks.items} />
                    }
                    )}
                </div>
            </div>
        </section>
    )
}