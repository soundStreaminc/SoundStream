import { stationService } from "../../services/station.service";
import {  setTrackJson } from "../../services/util.service";
import { store } from "../store";
import { ADD_STATION_TO_LIBRARY, LOAD_STATION_FROM_LIBRARY, REMOVE_STATION_FROM_LIBRARY, REMOVE_TRACK, SEARCH_ALBUMS, SEARCH_ARTISTS, SEARCH_PLAYLISTS, SEARCH_SONGS, SET_CURRENT_PLAYLIST, SET_RECENT, SET_STATION } from "./song.reducer";
import { showErrorMsg } from "../../services/event-bus.service.js"; 
import { libraryService } from "../../services/library.service.js";

export async function loadTracks(){
    try {
        const tracks = await stationService.getCurrentlyPlaying()
        store.dispatch( { type: SET_STATION , tracks })
    } catch (err) {
        console.log('Having issues loading playlist:', err)
        showErrorMsg( 'Having issues loading playlist' )
        throw err
    }
}

export async function removeTrack( trackId ){
    try {
        await stationService.remove( trackId )
        store.dispatch( { type: REMOVE_TRACK , trackId })
    } catch (err) {
        console.log('Having issues removing playlist:', err)
        showErrorMsg( 'Having issues removing playlist' )
        throw err
    }
}

export async function setRecentlyPlayed ( recentlyPlayedArray ){
    try {
        store.dispatch( { type: SET_RECENT , recentlyPlayedArray })
    } catch (err) {
        console.log('Having issues setting new recentlyPlayedArray:', err)
        showErrorMsg( 'Recently Played issue' )
        throw err
    }
}

export async function searchArtists ( artistName, limit  ){
    try {
        const artists = await stationService.getArtists_SpotifyApi ( artistName, limit)
        store.dispatch( { type: SEARCH_ARTISTS , artists })
        if (!artists | artists.length === 0) throw new Error(`Having issues finding artists: ${artistName}`)
        return artists
    } catch (err) {
        console.log('Having issues finding artists:', err)
        showErrorMsg( 'Having issues finding artists:' )
        throw err
    }
}

export async function searchSongs ( songName , limit ){
    try {
        const songs = await stationService.getTracks_SpotifyApi ( songName, limit)
        store.dispatch( { type: SEARCH_SONGS , songs })
        return songs
    } catch (err) {
        console.log('Having issues finding songs:', err)
        showErrorMsg( 'Having issues finding songs' )
        throw err
    }
}

export async function searchPlaylists ( playlistName , limit){
    try {
        const playlists = await stationService.getPlaylist_SpotifiApi ( playlistName, limit)
        store.dispatch( { type: SEARCH_PLAYLISTS , playlists })
        return playlists
    } catch (err) {
        console.log('Having issues finding playlists:', err)
        showErrorMsg( 'Having issues finding playlists:' )
        throw err
    }
}

export async function searchAlbums ( albumName , limit){
    try {
        const albums = await stationService.getAlbum_SpotifiApi ( albumName, limit)
        store.dispatch( { type: SEARCH_ALBUMS , albums })
        return albums
    } catch (err) {
        console.log('Having issues finding albums:', err)
        showErrorMsg( 'Having issues finding albums:' )
        throw err
    }
}

export async function loadStationFromLibrary () {
    try {
        const libraryStations = await libraryService.query();
        store.dispatch( { type: LOAD_STATION_FROM_LIBRARY ,  libraryStations})
    } catch (err) {
        console.error('Error load Station From Library:', err);
    }
}

export async function addStationToLibrary (stationId, stationName, stationType,  MYUSER){
    try {
        var addedStation = await libraryService.addPlaylist(stationId, stationName, stationType,  MYUSER)
        console.log('addedStation:', addedStation)
        store.dispatch( { type: ADD_STATION_TO_LIBRARY , addedStation })
    } catch (err) {
        console.log('Having issues add Station To Library:', err)
        showErrorMsg( 'Having issues add Station To Library' )
        throw err
    }
}

export async function removeStationFromLibrary (stationId, stationName, stationType,  MYUSER){
    try {
        await libraryService.removePlaylist(stationId, stationName, stationType,  MYUSER)
        store.dispatch( { type: REMOVE_STATION_FROM_LIBRARY , stationId })
    } catch (err) {
        console.log('Having issues remove Station From Library:', err)
        showErrorMsg( 'Having issues remove Station From Library' )
        throw err
    }
}

export async function setCurrentlyPlayingPlaylist ( trackInfo ){
    try {
        trackInfo = {...trackInfo, stationType: 'playlist'}
        await store.dispatch( { type: SET_CURRENT_PLAYLIST , trackInfo })
    } catch (err) {
        console.log('Having issues finding playlists:', err)
        showErrorMsg( 'Having issues finding playlists:' )
        throw err
    }
}

export async function setCurrentlyPlayingArtist ( trackInfo ){
    try {
        trackInfo = {...trackInfo, stationType: 'artist'}
        console.log('setCurrentlyPlayingArtist trackInfo:', trackInfo)
        await store.dispatch( { type: SET_CURRENT_PLAYLIST , trackInfo })
    } catch (err) {
        console.log('Having issues finding playlists:', err)
        showErrorMsg( 'Having issues finding playlists:' )
        throw err
    }
}

export async function setCurrentlyPlayingAlbum ( trackInfo , imgSrc){
    try {
        trackInfo = {...trackInfo, stationType: 'album', albumImage: imgSrc}
        console.log('setCurrentlyPlayingArtist trackInfo:', trackInfo)
        await store.dispatch( { type: SET_CURRENT_PLAYLIST , trackInfo })
    } catch (err) {
        console.log('Having issues finding playlists:', err)
        showErrorMsg( 'Having issues finding playlists:' )
        throw err
    }
}

export async function setCurrentlyPlayingTrack ( trackInfo , youtubeId){
    try {
        trackInfo = setTrackJson( trackInfo, youtubeId )
        console.log('setCurrentlyPlayingTrack trackInfo:', trackInfo)
        await store.dispatch( { type: SET_CURRENT_PLAYLIST , trackInfo })
        return trackInfo
    } catch (err) {
        console.log('Having issues finding playlists:', err)
        showErrorMsg( 'Having issues finding playlists:' )
        throw err
    }
}

export async function setCurrentlyPlayingInitial ( trackInfo , youtubeId){
    try {
        await store.dispatch( { type: SET_CURRENT_PLAYLIST , trackInfo })
        return trackInfo
    } catch (err) {
        console.log('Having issues finding playlists:', err)
        showErrorMsg( 'Having issues finding playlists:' )
        throw err
    }
}

