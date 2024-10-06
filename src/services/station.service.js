
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
    getById,
    save,
    remove,
    setAccessKey,
    getArtistId,
    getArtists,
    getTracks,
    getAlbumsByArtistId,
    getTracksByAlbumId,
    getEmptyStation,
    getEmptySong,
    getPlaylistByName,
    getPlaylistData,
    getFilterFromSearchParams
}
window.cs = stationService

let gAccesskey = ''

_createStation()

async function query() {
    const res = await utilService.loadFromStorage(STORAGE_KEY)
    console.log('res:', res)
    return res
}

function getById(stationId) {
    return httpService.get(`station/${stationId}`)
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)

    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

async function remove(stationId) {
    return httpService.delete(`station/${stationId}`)
}


async function setAccessKey(){
    console.log("Client ID:", clientId);
    console.log("Client Secret:", clientSecret);
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
        console.log('authParameters:', authParameters)
        gAccesskey =  await fetch ( 'https://accounts.spotify.com/api/token?scope='+ scope.join(' '), authParameters)
            .then( response => response.json())
            .then( data => { 
                console.log('data:', data)   
                return  data.access_token })
        
}




async function getPlaylistData() {
    try {
        
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: 'GET',
            headers: {
              Authorization: "Bearer " + gAccesskey,  // Ensure token is correctly set
              "Content-Type": "application/json",
            },
          });
          console.log("response",response);
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

async function getArtistId( artistName){
    var searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + gAccesskey
        }
    }
    var artistId = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        artistName + '&type=artist' , searchParameters)
        .then( response => response.json())
        .then( data => { return  data.artists.items[0].id }

        )
    
     console.log('artistId:', artistId)

     return artistId

}

async function getArtists( artistName){
    console.log('gAccesskey:', gAccesskey)
    var searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + gAccesskey
        }
    }
    var foundArtists = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        artistName + '&type=artist' , searchParameters)
        .then( response => response.json())
        .then( data => { return  data.artists? data.artists.items : '' }

        )
    
     console.log('foundArtists:', foundArtists)

     return foundArtists

}

async function getTracks ( tracktName, limit ){
    var searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + gAccesskey
        }
    }
    var foundTracks = await fetch ( 'https://api.spotify.com/v1/search?q=' + 
        tracktName + '&type=track&limit=' + limit , searchParameters)
        .then( response => response.json())
        .then( data => { 
            console.log('data:', data)
            return  data.tracks.items? data.tracks.items : '' }

        )
    
     console.log('foundTracks:', foundTracks)

     return foundTracks

}

async function getAlbumsByArtistId( artistId ){
    var searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + gAccesskey
        }
    }
    var albums = await fetch ('https://api.spotify.com/v1/artists/' + 
        artistId + '/albums' + '?', searchParameters )
        .then( response => response.json())
        .then( data => { return  data.items }
        )
    console.log('albums:', albums)
    return albums
}

async function getTracksByAlbumId( albumId ){
    var searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + gAccesskey
        }
    }
    var tracks = await fetch ('https://api.spotify.com/v1/albums/' + 
        albumId + '/tracks' + '?', searchParameters )
        .then( response => response.json())
        .then( data => { return  data.items }
        )
    console.log('tracks:', tracks)
    return tracks
}
async function getPlaylistByName(name) {
    try {
        const test = await getUserProfile()
        console.log('test:', test)
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + gAccesskey
            }
        };
        console.log('getPlaylistByName gAccesskey:', gAccesskey)
        // Use the search endpoint to find playlists by name
        const response = await fetch(`https://api.spotify.com/v1/users/${name}/playlists`, searchParameters);
        const data = response.json();
        console.log('getPlaylistByName data:', data)
        if (response.ok && data.playlists.items.length > 0) {
            console.log('playlist:', data.playlists.items[0]);
            return data.playlists.items[0];  // Return the first playlist match
        } else {
            throw new Error(`No playlist found with name: ${name}`);
        }
    } catch (err) {
        console.error('Error fetching playlist:', err);
    }
}

async function getUserProfile(){
    var searchParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + gAccesskey
        }
    }
    console.log('getUserProfile searchParameters:', searchParameters)
    var test = await fetch ('https://api.spotify.com/v1/me' , searchParameters )
        .then( response => response.json())
        .then( data => { 
            console.log('data:', data)
            return  data }
        )
    console.log('getUserProfile test:', test)
    return test
    
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
          id: "c1",
          type: "album",
          title: "Love It When You Hate Me (feat. blackbear) - Acoustic",
          artist: "Avril Lavigne",
          audioSrc: "https://p.scdn.co/mp3-preview/ddabbe456fde1ab1bef88c8022056f7d26f2f5ba?cid=426b1061c8be4e70babeec62bbcf0f08",
              image: "https://i.scdn.co/image/ab67616d0000b273ae6b206adcb3d283e9b327ca",
          color: "blue",
        },
        {
            id: "c2",
            type: "playlist",
            title: "Waiting for the End",
            artist: "Linkin Park",
            audioSrc: "https://p.scdn.co/mp3-preview/1e52f7874a0864d96c106a5ee93970dcee66b05f?cid=426b1061c8be4e70babeec62bbcf0f08",
                image: "https://i.scdn.co/image/ab67616d0000b273163d1c5eddd35473f030f2d4",
            color: "green",
          }
      ]
    utilService.saveToStorage(STORAGE_KEY, station)
}

function getFilterFromSearchParams(searchParams){
    console.log('test2 : searchParams:', searchParams)
    const filterBy = {
        filterText: searchParams.size > 0 ?  searchParams.filterText : ''

    }
    console.log('filterBy:', filterBy)
    return filterBy
}

function getAccessKey() {
    return gAccesskey
}

//TODO add get empy msgs?





