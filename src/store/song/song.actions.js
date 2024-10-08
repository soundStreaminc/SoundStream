import { stationService } from "../../services/station.service";
import { store } from "../store";
import { REMOVE_TRACK, SEARCH_ARTISTS, SEARCH_PLAYLISTS, SEARCH_SONGS, SET_STATION } from "./song.reducer";

export async function loadTracks(){
    try {
        const tracks = await stationService.getCurrentlyPlaying()
        console.log('tracks:', tracks)
        store.dispatch( { type: SET_STATION , tracks })

    } catch (err) {
        console.log('Having issues loading playlist:', err)
        //showErrorMsg( ''Having issues loading playlist' )
        throw err
    }

}

export async function removeTrack( trackId ){
    try {
        await stationService.remove( trackId )
        store.dispatch( { type: REMOVE_TRACK , trackId })

    } catch (err) {
        console.log('Having issues removing playlist:', err)
        //showErrorMsg( ''Having issues removing playlist' )
        throw err
    }

}

export async function searchArtists ( artistName ){
    try {
        const artists = await stationService.getArtists ( artistName)
        console.log('dispatch foundArtists:', artists)
        store.dispatch( { type: SEARCH_ARTISTS , artists })

    } catch (err) {
        console.log('Having issues finding artists:', err)
        //showErrorMsg( ''Having issues finding artists:' )
        throw err
    }

}

export async function searchSongs ( songName , limit ){
    try {
        const songs = await stationService.getTracks ( songName, limit)
        console.log('dispatch found songs:', songs)
        store.dispatch( { type: SEARCH_SONGS , songs })

    } catch (err) {
        console.log('Having issues finding songs:', err)
        //showErrorMsg( ''Having issues finding songs' )
        throw err
    }

}

export async function searchPlaylists ( playlistName , limit){
    try {
        const playlists = await stationService.getPlaylist_SpotifiApi ( playlistName, limit)
        console.log('dispatch playlists:', playlists)
        store.dispatch( { type: SEARCH_PLAYLISTS , playlists })

    } catch (err) {
        console.log('Having issues finding playlists:', err)
        //showErrorMsg( ''Having issues finding playlists:' )
        throw err
    }

}