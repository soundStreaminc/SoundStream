
const intialState = {
    currentPlaylist : [
        {
            id: "c2",
            title: "Waiting for the End",
            artist: "Linkin Park",
            youtubeId: "5qF_qbaWt3Q",
                image: "https://i.scdn.co/image/ab67616d0000b273163d1c5eddd35473f030f2d4"
          }
      ],
      foundArtists : [],
      foundSongs: [],
      foundPlaylists: [],
      foundAlbums: [],
      recentlyPlayed: [],
      libraryStations: [
        {        
            name: "רשימת השמעה המאוד מגניבה של שקד / shaked cool playlist",
            id: "2ezyaQ3apZRID1oOIBHfLz",
            type: "playlist"
        }
      ]
}

export const SEARCH_SONGS = 'SEARCH_SONGS'
export const SEARCH_ARTISTS = 'SEARCH_ARTISTS'
export const SEARCH_PLAYLISTS = 'SEARCH_PLAYLISTS'
export const SEARCH_ALBUMS = 'SEARCH_ALBUMS'
export const SET_CURRENT_PLAYLIST = 'SET_CURRENT_PLAYLIST'
export const SET_STATION = 'SET_STATION'
export const ADD_TRACK = 'ADD_TRACK'
export const REMOVE_TRACK = 'REMOVE_TRACK'
export const CHANGE_IMAGE = 'CHANGE_IMAGE'
export const EDIT_TRACK = 'EDIT_TRACK'
export const SET_RECENT = 'SET_RECENT'
export const GET_LIBRARY = 'GET_LIBRARY'
export const ADD_STATION_TO_LIBRARY = 'ADD_STATION_TO_LIBRARY'
export const REMOVE_STATION_FROM_LIBRARY = 'REMOVE_STATION_FROM_LIBRARY'
export const LOAD_STATION_FROM_LIBRARY = 'LOAD_STATION_FROM_LIBRARY'

export function stationReducer ( state = intialState, cmd = {}  ){
    switch (cmd.type){
        case ADD_STATION_TO_LIBRARY :
            return{
                ...state,
                libraryStations : [...state.libraryStations, cmd.addedStation ] 
            } 
        case LOAD_STATION_FROM_LIBRARY :
            return{
                ...state,
                libraryStations: cmd.libraryStations
            } 
        case REMOVE_STATION_FROM_LIBRARY :
            return{
                ...state,
                libraryStations : state.libraryStations.filter( station => station.id !== cmd.stationId )
            } 
        case SET_RECENT :
            return{
                ...state,
                recentlyPlayed : cmd.recentlyPlayedArray
            } 
        case SEARCH_ARTISTS :
            return{
                ...state,
                foundArtists : cmd.artists
            }  
        case SEARCH_SONGS :
            return{
                ...state,
                foundSongs : cmd.songs
            }  
        case SEARCH_PLAYLISTS :
            return{
                ...state,
                foundPlaylists : cmd.playlists
            } 
        case SEARCH_ALBUMS :
            return{
                ...state,
                foundAlbums : cmd.foundAlbums
            } 
        case SET_STATION :
            return{
                ...state,
                currentPlaylist : cmd.tracks
            }  

        case SET_CURRENT_PLAYLIST :
            return{
                ...state,
                currentPlaylist : cmd.trackInfo
            }  
        case REMOVE_TRACK :
            return{
                ...state,
                currentPlaylist : state.currentPlaylist.filter( track => track.id !== cmd.trackId )
            }        
        case ADD_TRACK :
            return{
                ...state,
                currentPlaylist : [...state.currentPlaylist, cmd.track ] 
            } 
        case EDIT_TRACK :
            return{
                ...state,
                currentPlaylist : state.currentPlaylist.map( track => track.id === cmd.track.id ? cmd.track : track )
            }  
        default:
            return state
    }
}