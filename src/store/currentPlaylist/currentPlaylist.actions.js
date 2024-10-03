import { stationService } from "../../services/station.service";
import { store } from "../store";
import { SET_TRACKS } from "./currentPlaylist.reducer";

export async function loadTracks(){
    try {
        const tracks = await stationService.query()
        store.dispatch( { type: SET_TRACKS , tracks })

    } catch (err) {
        console.log('Having issues loading playlist:', err)
        //showErrorMsg( ''Having issues loading playlist' )
        throw err
    }

}