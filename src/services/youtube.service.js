import axios from 'axios';
import { httpService } from './http.service.js';
const youtubekey = import.meta.env.VITE_YOUTUBE_KEY
const KEY = youtubekey; // mention your youtube API key here

export const youtubeService = {
    getSongByName,
    getAudioById
}
window.cs = youtubeService

async function getSongByName(songName) {
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
        return data.items ? data.items[0]?.id?.videoId : 'No results found';
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Could not fetch data';
    }
}
 
async function getAudioById( playingId ){
    return httpService.get(`playing/getAudio/${playingId}` )
}

