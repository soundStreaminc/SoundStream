
// import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { utilService } from './util.service'
const clientId = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET
// const clientId = 'd3fc38ce7f59434d9d1ee7e7c85205fd'; // Replace with your client ID
// const clientSecret = '06fd876e23034893aa7f2f0af79a42ca'; // Replace with your client secret
const STORAGE_KEY = 'station'
import axios from 'axios';

export const stationService = {
    query,
    setAccessKey,
    getArtistId_SpotifyApi,
    getArtists_SpotifyApi,
    getTracks_SpotifyApi,
    getAlbumsByArtistId,
    getTracksByAlbumId_SpotifyApi,
    getRecomended_SpotifyApi,
    getEmptyStation,
    getEmptySong,
    getPlaylistData,
    getFilterFromSearchParams,
    getPlaylistById,
    getPlaylistByUser,
    getPlaylistById_SpotifyApi,
    getPlaylist_SpotifiApi,
    getCurrentlyPlaying,
    setPLaylistByUser,
    addPlaylist
}
window.cs = stationService

let gAccesskey = ''

_createStation()

async function query() {
    const res = await utilService.loadFromStorage(STORAGE_KEY)
    return res
}

async function addPlaylist ( playlistId, playlistName , user ){
    const res = await setPLaylistByUser(user, { playlistId, playlistName })
}

async function setPLaylistByUser ( userName , playlist ) {
    console.log('playlist:', playlist)
    const res = await query(STORAGE_KEY).then(entity => {

        const idx = entity[0].users.find(entity => entity.userName === userName)
        idx.playlists.push(playlist)
        console.log('idx:', idx)

        
        if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`)
            console.log('idx:', idx)
        return entity
        })
    console.log('res:', res)
    utilService.saveToStorage(STORAGE_KEY, res)


}

// async function save(station) {
//     var savedStation
//     if (station._id) {
//         savedStation = await httpService.put(`station/${station._id}`, station)

//     } else {
//         savedStation = await httpService.post('station', station)
//     }
//     return savedStation
// }

// async function remove(stationId) {
//     return httpService.delete(`station/${stationId}`)
// }

async function setAccessKey(){
    console.log("Client ID:", clientId);
    console.log("Client Secret:", clientSecret);


   console.log("Fetching access token...");
    if (!clientId || !clientSecret) {
        console.error('Client ID or Secret not found');
        return;
    }

    var scope = [
        'playlist-read-private', // Ensure this scope is included
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-read-playback-position',
        'user-top-read',
        'user-read-recently-played'
      ];

    if (!clientId || !clientSecret) {
      console.error('Client ID or Secret not found');
      return;
    }
    //TODO add error handling
        //API ACESS TOKEN
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + 
                clientId + '&client_secret=' + clientSecret
        }
        gAccesskey =  await fetch ( 'https://accounts.spotify.com/api/token?scope='+ scope.join(' '), authParameters)
            .then( response => response.json())
            .then( data => { 
                return  data.access_token })
        return gAccesskey
        
}



async function getPlaylistData(gAccesskey) {
    console.log("getPlaylistData",gAccesskey);
    try {
        
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: 'GET',
            headers: {
              Authorization: "Bearer " + gAccesskey,  // Ensure token is correctly set
              Authorization: "Bearer " + gAccesskey,  // Ensure token is correctly set
              "Content-Type": "application/json",
            },
          });
      const { items } = response.data;
      const playlists = items.map(({ name, id }) => {
        return { name, id };
      });
      return playlists;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      throw error;
    }
  }

async function getArtistId_SpotifyApi( artistName){
    var searchParameters = await setupHeader()

    var artistId = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        artistName + '&type=artist' , searchParameters)
        .then( response => response.json())
        .then( data => { return  data.artists.items[0].id }

        )
     return artistId

}

async function getArtists_SpotifyApi( artistName){
    var searchParameters = await setupHeader()

    var foundArtists = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        artistName + '&type=artist' , searchParameters)
        .then( response => response.json())
        .then( data => { return  data.artists? data.artists.items : '' }

        )
     return foundArtists

}

async function getTracks_SpotifyApi ( tracktName, limit ){
    var searchParameters = await setupHeader()

    var foundTracks = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        tracktName + '&type=track&limit=' + limit , searchParameters)
        .then( response => response.json())
        .then( data => { 
            return  data.tracks.items? data.tracks.items : '' }

        )
     return foundTracks

}

async function getPlaylist_SpotifiApi ( playlistName, limit ){
    var searchParameters = await setupHeader()

    var foundPlaylists = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        playlistName + '&type=playlist&limit=' + limit , searchParameters)
        .then( response => response.json())
        .then( data => { 
            console.log('data:', data)
            return  data.playlists.items? data.playlists.items : '' }

        )
     return foundPlaylists

}

/**
 * You can specify up to 5 seed values in total (any combination of tracks, artists, or genres).
 * @param {*} seedTracksArray 
 */
async function getRecomended_SpotifyApi ( seedTracksArray ){
    var searchParameters = await setupHeader()
    var seedTrackParams = _setSeedTrack( seedTracksArray)

    var foundPlaylists = await fetch ( 'https://api.spotify.com/v1/recommendations?' + 
        seedTrackParams , searchParameters)
        .then( response => response.json())
        .then( data => { 
            console.log('data:', data)
            return  data.playlists.items? data.playlists.items : '' }

        )
     return foundPlaylists
}

/**
 * every seed can have a type (artist, track, genre).
 * @param {*} seedTracksArray 
 */
function _setSeedTrack( seedTracksArray){
    var res = ''
    var tracks = []
    var artists = []
    var genres = []

    seedTracksArray.map( track => {
        const { type } = track
        switch (type){
            case 'track':
                tracks.push( track.id )
                break
            case 'artist':
                artists.push( track.name )
                break
            case 'genre':
                genres.push( track.name )
                break
            default: 
                throw 'did not get correct seed Tracks Array'
        }

        res += tracks.length > 0 ? 'seed_tracks=' + tracks.toString() : ''
        res += artists.length > 0 ? 'seed_artists=' + artists.toString() : ''
        res += genres.length > 0 ? 'seed_genres=' + genres.toString() : ''
        return res

    })
}

async function getAlbumsByArtistId( artistId ){
    var searchParameters = await setupHeader()

    var albums = await fetch ('https://api.spotify.com/v1/artists/' + 
        artistId + '/albums' + '?', searchParameters )
        .then( response => response.json())
        .then( data => { return  data.items }
        )
    return albums
}

async function getTracksByAlbumId_SpotifyApi( albumId ){
    var searchParameters = await setupHeader()

    var tracks = await fetch ('https://api.spotify.com/v1/albums/' + 
        albumId + '/tracks' + '?', searchParameters )
        .then( response => response.json())
        .then( data => { return  data.items }
        )
    return tracks
}



// async function addCarMsg(carId, txt) {
//     const savedMsg = await httpService.post(`car/${carId}/msg`, {txt})
//     return savedMsg
// }


function getEmptyStation() {
    return {
        _id: utilService.makeId(),
        name: '',
        tags: [],
        createdBy: [],
        likedByUsers: [],
        songs: [],
        msgs: []
    }
}

function getEmptySong() {
    return {
        _id: utilService.makeId(),
        type: '',
        title: '',
        url: '',
        imgUrl: '',
        likedBy: [],
        addedAt: utilService.getRandomIntInclusive(1000, 9000),
        addedBy,


    }
}

function _createStation() {
    let station = utilService.loadFromStorage(STORAGE_KEY)
    if (station && station.length > 0) return
     
    station = [
        {
            users: [
                {
                userName : "ohad",
                playlists : [ 
                    {
                        "name": "רשימת השמעה המאוד מגניבה של שקד / shaked cool playlist",
                        "id": "2ezyaQ3apZRID1oOIBHfLz",
                    } 
                ]
                },
                {
                    userName : "avinoam",
                    playlists : [ 
                        {
                            "name": "the best playlist!!!!",
                            "id": "3cEYpjA9oz9GiPac4AsH4n",
                        } 
                    ]
                }        
            ]         
        },    
        {
            currentlyPlaying: [
                
                    {
                        id: "c1",
                        title: "Love It When You Hate Me (feat. blackbear) - Acoustic",
                        artist: "Avril Lavigne",
                        audioSrc: "https://p.scdn.co/mp3-preview/ddabbe456fde1ab1bef88c8022056f7d26f2f5ba?cid=426b1061c8be4e70babeec62bbcf0f08",
                            image: "https://i.scdn.co/image/ab67616d0000b273ae6b206adcb3d283e9b327ca",
                        color: "blue",
                    } ,
                    {
                        id: "c2",
                        title: "Waiting for the End",
                        artist: "Linkin Park",
                        audioSrc: "https://p.scdn.co/mp3-preview/1e52f7874a0864d96c106a5ee93970dcee66b05f?cid=426b1061c8be4e70babeec62bbcf0f08",
                            image: "https://i.scdn.co/image/ab67616d0000b273163d1c5eddd35473f030f2d4",
                        color: "green",
                      }
                
                   
            ]     
        },
        
      ]
    utilService.saveToStorage(STORAGE_KEY, station)
}

function getFilterFromSearchParams(searchParams){
    const filterBy = {
        filterText: searchParams.size > 0 ?  searchParams.filterText : ''

    }
    return filterBy
}

async function getPlaylistById( playlistId ){
    const playlists = await query()
        .then( data => { 
            data[0].users.playlists.filter(playlist => playlist.id === playlistId )
            return  data 
        })


    return playlists
}

async function getPlaylistByUser ( userName ){
    const playlists = await query()
    .then( data => {   
        return  (data[0].users.find( user => user.userName === userName )).playlists
    })
    return playlists
}

async function getCurrentlyPlaying (  ){
    const playlists = await query()
    .then( data => {   
        return  data[1].currentlyPlaying
    })
    return playlists
}

async function getPlaylistById_SpotifyApi( playlistId ){
    var searchParameters = await setupHeader()

    var playlist = await fetch ('https://api.spotify.com/v1/playlists/' + playlistId , searchParameters )
        .then( response => response.json())
        .then( data => { 
            return  data ? data : ' could not get playlist '}
        )
    return playlist
}

function getAccessKey() {
    return gAccesskey
}

async function setupHeader(){
    if  ( !gAccesskey || gAccesskey === '' ){
        gAccesskey = await setAccessKey()
    }
    var searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + gAccesskey
        }
    }
    return searchParameters
}

//TODO add get empy msgs?





