import { legacy_createStore as createStore } from "redux";
import { stationReducer } from "./currentPlaylist/currentPlaylist.reducer";

export const store = createStore( stationReducer)

window.gStore = store
