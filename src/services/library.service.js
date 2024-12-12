import { httpService } from './http.service.js';

const endpoint = 'library/';
export const libraryService = {
    query,
    addPlaylist,
    removePlaylist,
}
window.cs = libraryService

async function query( ) {
    return httpService.get(endpoint)   
}

async function addPlaylist ( id, name, type, user ){
    var addedStation = { name, id, type }
    var savedStation = httpService.post(endpoint , addedStation)

    return savedStation
}

async function removePlaylist ( id ){
    return httpService.delete(endpoint + id)
}
