import { legacy_createStore as createStore } from "redux";
import { stationReducer } from "./song/song.reducer";

export const store = createStore( stationReducer)

window.gStore = store
