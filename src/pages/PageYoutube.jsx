import React, { useState } from 'react';
import SearchbarYoutube from './SearchbarYoutube';
import VideoListYoutube from './VideoListYoutube';
import VideoDetailYoutube from './VideoDetailYoutube';
import { youtubeService } from '../services/youtube.service.js';

const PageYoutube = () => {
    // State using hooks
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Handle search form submission

    const handleSubmit = async (termFromSearchBar) => {
        try {
            const videoId = await youtubeService.getSongByName(termFromSearchBar);
            console.log('videoId:', videoId)
            // const response = await youtube.get('/search', {
            //     params: {
            //         q: termFromSearchBar,
            //         maxResults: 1, // Limit results to one

            //     }
            // });
            // console.log('response.data.items:', response.data.items[0].id.videoId)
            // setVideos(response.data.items); // Update videos state
            // console.log('This is response:', response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle video selection
    const handleVideoSelect = (video) => {
        setSelectedVideo(video); // Update selected video
    };

    return (
        <div className="ui container" style={{ marginTop: '1em' }}>
            <SearchbarYoutube handleFormSubmit={handleSubmit} />
            <div className="ui grid">
                <div className="ui row">
                    <div className="eleven wide column">
                        <VideoDetailYoutube video={selectedVideo} />
                    </div>
                    <div className="five wide column">
                        <VideoListYoutube handleVideoSelect={handleVideoSelect} videos={videos} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageYoutube;
