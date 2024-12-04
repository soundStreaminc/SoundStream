import axios from 'axios';
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
            q: songName,
            maxResults: 1,
        };

        const queryString = new URLSearchParams(params).toString(); // Build query string
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search/?${queryString}`); // Append query string to URL
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('data:', data);
        return data.items ? data.items[0]?.id?.videoId : 'No results found';
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Could not fetch data';
    }
}
 
async function getAudioById( id ){
    // YouTube video ID
    var videoID = id;

    // Fetch video info (using a proxy to avoid CORS errors)
    const res = await fetch('https://cors-anywhere.herokuapp.com/' + "https://www.youtube.com/get_video_info?video_id=" + videoID).then(response => {
        if (response.ok) {
            response.text().then(ytData => {
            
            // parse response to find audio info
            var ytData = _parse_str(ytData);
            var getAdaptiveFormats = JSON.parse(ytData.player_response).streamingData.adaptiveFormats;
            var findAudioInfo = getAdaptiveFormats.findIndex(obj => obj.audioQuality);
            
            // get the URL for the audio file
            return getAdaptiveFormats[findAudioInfo].url;
                    
            });
        }
    })
    console.log('getAudioById res:', res)
    return res

}

function _parse_str(str) {
    return str.split('&').reduce(function(params, param) {
      var paramSplit = param.split('=').map(function(value) {
        return decodeURIComponent(value.replace('+', ' '));
      });
      params[paramSplit[0]] = paramSplit[1];
      return params;
    }, {});
  }


