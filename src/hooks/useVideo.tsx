import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'AIzaSyCnDk7A88Tis3iiLKO_GZcRcEtpoh6WMDA';  // Replace with your YouTube Data API key


// Function to get random views between 0 and 1 million
function getRandomViews(): number {
    return Math.floor(Math.random() * 1000000);
}

// Function to get random duration between 1 and 10 minutes (in seconds)
function getRandomDuration(): number {
    return Math.floor(Math.random() * 600) + 60;
}

// Define the structure of the video data using TypeScript interfaces
interface Video {
    id: string;
    title: string;
    channel: {
        name: string;
        profileUrl: string;
    };
    views: number;
    postedAt: Date;
    duration: number;
    thumbnailUrl: string;
    videoUrl: string;
}

// Custom hook to fetch videos using axios
export const useVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    console.log(searchQuery, "searchQuery");


    useEffect(() => {
        const fetchVideos = async () => {
            if (!searchQuery) return;
            try {
                setLoading(true);
                const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&maxResults=10&type=video`;

                const response = await axios.get(apiUrl);  // Using axios for the request
                const data = response.data;


                const mappedVideos: Video[] = data.items.map((item: any) => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    channel: {
                        name: item.snippet.channelTitle,
                        profileUrl: item.snippet.thumbnails.default.url,
                    },
                    views: getRandomViews(),
                    postedAt: new Date(item.snippet.publishedAt),
                    duration: getRandomDuration(),
                    thumbnailUrl: item.snippet.thumbnails.high.url,
                    videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                }));
                console.log(mappedVideos, "mappedVideos");

                setVideos(mappedVideos);
            } catch (error) {
                console.error('Error fetching YouTube videos:', error);
                setError('Failed to load videos');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [searchQuery]);
    console.log(videos, "videos");

    return { videos, loading, error, setSearchQuery };
};
