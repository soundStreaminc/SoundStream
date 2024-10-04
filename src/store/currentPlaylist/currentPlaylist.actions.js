import { stationService } from "../../services/station.service";
import { store } from "../store";
import { REMOVE_TRACK, SET_STATION } from "./currentPlaylist.reducer";

export async function loadTracks(){
    try {
        const tracks = await stationService.query()
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