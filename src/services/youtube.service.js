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

async function getSearchesByFullNameFromCache(fullname) {
    const result =await storageService.getByName(STORAGE_KEY, fullname)
console.log("result",result)
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
    console.log('getSongByName:');
    try {
        const youtubeSearch = await getSearchesByFullNameFromCache(songName);
        console.log('cache youtubeId:', youtubeSearch?.youtubeId);
        if (youtubeSearch) return youtubeSearch.youtubeId;

        const params = {
            key: KEY,
            part: 'snippet',
            q: songName
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search/?${queryString}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const youtubeSearchData = {
            name: songName,
            youtubeId: data.items[0]?.id?.videoId
        };

        await save(youtubeSearchData);
        return youtubeSearchData.youtubeId || 'No results found';
    } catch (error) {
        console.error('Error fetching or processing YouTube data:', error.message);
        return 'Could not fetch data';
    }
}

