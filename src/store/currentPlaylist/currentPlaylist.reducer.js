
const intialState = {
    currentPlaylist : [
        {
          id: "c1",
          title: "Love It When You Hate Me (feat. blackbear) - Acoustic",
          artist: "Avril Lavigne",
          audioSrc: "https://p.scdn.co/mp3-preview/ddabbe456fde1ab1bef88c8022056f7d26f2f5ba?cid=426b1061c8be4e70babeec62bbcf0f08",
              image: "https://i.scdn.co/image/ab67616d0000b273ae6b206adcb3d283e9b327ca",
          color: "blue",
        },
        {
            id: "c2",
            title: "Waiting for the End",
            artist: "Linkin Park",
            audioSrc: "https://p.scdn.co/mp3-preview/1e52f7874a0864d96c106a5ee93970dcee66b05f?cid=426b1061c8be4e70babeec62bbcf0f08",
                image: "https://i.scdn.co/image/ab67616d0000b273163d1c5eddd35473f030f2d4",
            color: "green",
          }
      ],
      foundArtist : []
}

export const SET_ARTIST = 'SET_ARTIST'
export const SET_STATION = 'SET_STATION'
export const ADD_TRACK = 'ADD_TRACK'
export const REMOVE_TRACK = 'REMOVE_TRACK'
export const CHANGE_IMAGE = 'CHANGE_IMAGE'
export const EDIT_TRACK = 'EDIT_TRACK'


export function stationReducer ( state = intialState, cmd = {}  ){
    switch (cmd.type){
        case SET_ARTIST :
            return{
                ...state,
                foundArtist : cmd.artist
            }  
        case SET_STATION :
            return{
                ...state,
                currentPlaylist : cmd.tracks
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