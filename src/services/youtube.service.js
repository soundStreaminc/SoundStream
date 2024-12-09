import { storageService } from './async-storage.service.js';
const youtubekey = import.meta.env.VITE_YOUTUBE_KEY
const KEY = youtubekey; // mention your youtube API key here
const STORAGE_KEY = 'cache'

export const youtubeService = {
    getSongByName,
    query,
    getSearchesByFullNameFromCache,
    save
}
window.cs = youtubeService

async function query() {
    var cache = await storageService.query(STORAGE_KEY)
    return cache
}

function getSearchesByFullNameFromCache(fullname) {
    return storageService.getByName(STORAGE_KEY, fullname)
}

async function save(youtubeSearch) {
    const savedSearch = {
        name: youtubeSearch.name,
        youtubeId : youtubeSearch.youtubeId
    }
    savedSearch = await storageService.postNoId(STORAGE_KEY, savedSearch)
    return savedSearch
}

async function getSongByName(songName) {
    console.log('getSongByName:')
    const youtubeSearch = await getSearchesByFullNameFromCache(songName)
    console.log('cache youtubeId:', youtubeSearch.youtubeId)
    if(youtubeSearch) return youtubeSearch.youtubeId
    try {
        const params = {
            key: KEY,
            part: 'snippet',
            q: songName
        };

        const queryString = new URLSearchParams(params).toString(); // Build query string
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search/?${queryString}`); // Append query string to URL
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const youtubeSearch = {
            name: songName,
            youtubeId : data.items[0]?.id?.videoId
        }

        save(youtubeSearch)
        return data.items ? data.items[0]?.id?.videoId : 'No results found';
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Could not fetch data';
    }
}

