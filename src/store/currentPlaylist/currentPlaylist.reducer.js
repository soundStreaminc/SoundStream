
const intialState = {
    currentPlaylist : [
        {
          title: "Love It When You Hate Me (feat. blackbear) - Acoustic",
          artist: "Avril Lavigne",
          audioSrc: "https://p.scdn.co/mp3-preview/ddabbe456fde1ab1bef88c8022056f7d26f2f5ba?cid=426b1061c8be4e70babeec62bbcf0f08",
              image: "https://i.scdn.co/image/ab67616d0000b273ae6b206adcb3d283e9b327ca",
          color: "blue",
        },
        {
            title: "Waiting for the End",
            artist: "Linkin Park",
            audioSrc: "https://p.scdn.co/mp3-preview/1e52f7874a0864d96c106a5ee93970dcee66b05f?cid=426b1061c8be4e70babeec62bbcf0f08",
                image: "https://i.scdn.co/image/ab67616d0000b273163d1c5eddd35473f030f2d4",
            color: "green",
          }
      ]
}
export const ADDTRACK = 'ADDTRACK'
export const REMOVETRACK = 'REMOVETRACK'
export const CHANGE_IMAGE = 'CHANGE_IMAGE'
export const SET_TRACKS = 'SET_TRACKS'


export function stationReducer ( state = intialState, cmd = {}  ){
    switch (cmd.type){
        case SET_TRACKS :
            return{
                ...state,
                currentPlaylist : cmd.tracks
            }     
        case ADDTRACK :
            return{
                ...state,
                currentPlaylist : cmd.tracks
        }       
        case REMOVETRACK :
            break;
        // case CHANGE_IMAGE :
        //     return{
        //         ...state,
        //         tracks[cmd.trackId].audioSrc : cmd.imageUrl
        //     }   
        default:
            return state
    }
}