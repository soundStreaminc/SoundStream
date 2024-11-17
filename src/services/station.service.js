import { utilService } from './util.service.js'
import { showErrorMsg } from '../services/event-bus.service.js';

const clientId = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET
const STORAGE_KEY = 'station'

//TODO getMostPlayed_SpotifiApi

export const stationService = {
    query,
    setAccessKey,
    getAlbumsByArtistId,
    getEmptyStation,
    getEmptySong,
    getPlaylistData,
    getFilterFromSearchParams,
    getPlaylistById,
    getPlaylistByUser,
    getCurrentlyPlaying,
    addPlaylist,
    addAlbum,
    getCategoryPlaylists,

    getArtistId_SpotifyApi,
    getArtists_SpotifyApi,
    getTracks_SpotifyApi,
    getTracksByAlbumId_SpotifyApi,
    getRecomended_SpotifyApi,  
    getStationById_SpotifyApi,
    getPlaylistById_SpotifyApi,
    getPlaylist_SpotifiApi,
    getAlbum_SpotifiApi,
    getMadeForU_SpotifiApi,
    getTopMixes_SpotifiApi,
    getYourFavoriteArtist_SpotifiApi,
    getRecommended_SpotifiApi,
    getStayTuned_SpotifiApi,
    getRecentlyPlayed_SpotifiApi,
    getMostPlayed_SpotifiApi,
}
window.cs = stationService

let gAccesskey = ''

_createStation()

async function query() {
    const res = await utilService.loadFromStorage(STORAGE_KEY)
    return res
}

async function addPlaylist ( id, name, type, user ){
    const res = await _addStationToUser(user, { name, id, type })
}

async function addAlbum ( id, name, type, user ){
    const res = await _addStationToUser(user, { name, id, type })
}

async function _addStationToUser ( userName , station ) {
    const res = await query(STORAGE_KEY).then(entity => {

        const idx = entity[0].users.find(entity => entity.userName === userName)
        idx.playlists.push(station)

        
        if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`)
        return entity
        })
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
    var station = utilService.loadFromStorage(STORAGE_KEY)
    if (station && station.length > 0) return
     
    console.log('no staorage data, creating template data')
    station = [
        {
            users: [
                {
                userName : "ohad",
                playlists : [ 
                    {
                        "name": "רשימת השמעה המאוד מגניבה של שקד / shaked cool playlist",
                        "id": "2ezyaQ3apZRID1oOIBHfLz",
                        'type': 'playlist',
                    } 
                ]
                },
                {
                    userName : "avinoam",
                    playlists : [ 
                        {
                            "name": "the best playlist!!!!",
                            "id": "3cEYpjA9oz9GiPac4AsH4n",
                            'type': 'playlist',
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

//TODO feels like there is a bug in this function
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

async function getAlbumsByArtistId( artistId ){
    var searchParameters = await setupHeader()

    var albums = await fetch ('https://api.spotify.com/v1/artists/' + 
        artistId + '/albums' + '?', searchParameters )
        .then( response => response.json())
        .then( data => { return  data.items }
        )
    return albums
}

async function _getHardCodedData(){
    return [              
        {
            id: "c1",
            title: "הכבש השישה עשר",
            artist: "Avril Lavigne",
            audioSrc: "https://p.scdn.co/mp3-preview/ddabbe456fde1ab1bef88c8022056f7d26f2f5ba?cid=426b1061c8be4e70babeec62bbcf0f08",
            image: "https://i.scdn.co/image/ab67616d0000b273ae6b206adcb3d283e9b327ca",
            color: "blue",
        } ,
        {
            id: "c2",
            title: "Best Platlist!",
            artist: "Linkin Park",
            audioSrc: "https://p.scdn.co/mp3-preview/1e52f7874a0864d96c106a5ee93970dcee66b05f?cid=426b1061c8be4e70babeec62bbcf0f08",
            image: "https://i.scdn.co/image/ab67616d0000b273163d1c5eddd35473f030f2d4",
            color: "green",
          }
    ]     
}

async function getCategoryPlaylists( category ){
    switch (category){
        case 'Made For You':
            const madeForU = await getMadeForU_SpotifiApi();
            return madeForU
        case 'Your Top Mixes':
            const topMixes = await getTopMixes_SpotifiApi();
            return topMixes
        case 'Recently Played':
            const recentlyPlayed = await getRecentlyPlayed_SpotifiApi();
            return recentlyPlayed
        case 'Your Favorite Artists':
            const yourFavoriteArtist = await getYourFavoriteArtist_SpotifiApi();
            return yourFavoriteArtist
        case 'Recommended Stations':
            const recommended = await getRecommended_SpotifiApi();
            return recommended
        case 'Stay Tuned':
            const stayTuned = await getStayTuned_SpotifiApi();
            return stayTuned
        default:
            console.log('error: the category was not found')
            showErrorMsg('error: the category was not found')
            return []
    }
}

//TODO add get empy msgs?

/*
    Spotifi Api functions: connect to spotifi using the api key and get information about playlists and songs.
*/

async function getStationById_SpotifyApi( stationType, stationId ){
    var searchParameters = await setupHeader()
    var stationTypeParam = ''

    switch (stationType){
        case 'playlist':
            stationTypeParam = 'playlists'
            break
        case 'album':
            stationTypeParam = 'albums'
            break

    }
    var station = await fetch (`https://api.spotify.com/v1/${stationTypeParam}/${stationId}` , searchParameters )
        .then( response => response.json())
        .then( data => { 
            return  data ? data : ' could not get station '}
        )
    return station
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

async function getTracksByAlbumId_SpotifyApi( albumId ){
    var searchParameters = await setupHeader()

    var tracks = await fetch ('https://api.spotify.com/v1/albums/' + 
        albumId + '/tracks' + '?', searchParameters )
        .then( response => response.json())
        .then( data => { return  data.items }
        )
    return tracks
}

async function getPlaylist_SpotifiApi ( playlistName, limit ){
    var searchParameters = await setupHeader()

    var foundPlaylists = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        playlistName + '&type=playlist&limit=' + limit , searchParameters)
        .then( response => response.json())
        .then( data => { 
            return  data.playlists.items? data.playlists.items : '' }

        )
     return foundPlaylists
}

async function getAlbum_SpotifiApi ( albumName, limit ){
    var searchParameters = await setupHeader()

    var foundAlbums = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        albumName + '&type=album&limit=' + limit , searchParameters)
        .then( response => response.json())
        .then( data => { 
            return  data.albums.items? data.albums.items : '' }

        )
     return foundAlbums
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

async function getMostPlayed_SpotifiApi (){
    //TODO create function, for now using some hard coded data.
    return await _getHardCodedData()
}

async function getMadeForU_SpotifiApi (){
    //TODO create function, for now using some hard coded data.
    return await _getHardCodedData()
}

async function getTopMixes_SpotifiApi (){
    //TODO create function, for now using some hard coded data.
    return await _getHardCodedData()
}

async function getYourFavoriteArtist_SpotifiApi (){
    //TODO create function, for now using some hard coded data.
    return await _getHardCodedData()
}

async function getRecommended_SpotifiApi (){
    //TODO create function, for now using some hard coded data.
    return await _getHardCodedData()
}

async function getStayTuned_SpotifiApi (){
    //TODO create function, for now using some hard coded data.
    return await _getHardCodedData()
}

async function getRecentlyPlayed_SpotifiApi (){
    //TODO create function, for now using some hard coded data.
    return await _getHardCodedData()
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



