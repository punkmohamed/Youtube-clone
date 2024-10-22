import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { formatVideoDuration } from '../utils/formatVideoDuration';

const API_KEY = 'AIzaSyCnDk7A88Tis3iiLKO_GZcRcEtpoh6WMDA';

// Define the structure of the video data using TypeScript interfaces
interface Video {
    id: string;
    title: string;
    channel: {
        name: string;
        profileUrl: string;
        subscriberCount: string | number;
    };
    views: number;
    postedAt: Date;
    duration: string; // Use string to store ISO format (e.g., PT4M33S)
    thumbnailUrl: string;
    videoUrl: string;
}

const VideoContext = createContext(null);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [shortsVideos, setShortsVideos] = useState<
        { id: string; title: string; thumbnailUrl: string; views: string, postedAt: Date }[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const fetchVideoDetails = async () => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&maxResults=10&type=video&videoDuration=short`
            );
            const data = response?.data
            console.log(data, "data");
            const videoIds = data.items.map((item: { id: { videoId: any; }; }) => item.id.videoId).join(',');

            if (data.items && data.items.length > 0) {
                const statsResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
                );
                const statsData = statsResponse?.data;
                console.log(statsData, "Statistics API Data");

                const combinedData = data.items.map(
                    (item: { id: { videoId: string }; snippet: any }, index: number) => ({
                        id: item.id.videoId,
                        title: item.snippet.title,
                        thumbnailUrl: item.snippet.thumbnails.high.url,
                        views: statsData.items[index]?.statistics.viewCount || "0",
                        postedAt: item.snippet.publishedAt,
                    })
                );
                console.log(combinedData, "combinedData");

                setShortsVideos(combinedData);
            }

        } catch (error) {
            console.error('Error fetching video details:', error);
        }
    };
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);

                // Step 1: Fetch video data using the search API
                const searchApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&maxResults=10&type=video`;
                const videoResponse = await axios.get(searchApiUrl);
                const videoData = videoResponse.data.items;

                // Step 2: Collect all video IDs into a single array
                const videoIds = videoData.map((item: any) => item.id.videoId).join(',');

                // Step 3: Make a single API request to fetch detailed video content, including duration
                const videoDetailsResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
                );
                const videoDetails = videoDetailsResponse.data.items;

                // Step 4: Collect all channelIds into a single array for channel details
                const channelIds = videoData.map((item: any) => item.snippet.channelId).join(',');

                // Step 5: Fetch all channel details
                const channelResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${API_KEY}`
                );
                const channelData = channelResponse.data.items;

                // Map channel data by channelId for easier lookup
                const channelMap = channelData.reduce((acc: any, channel: any) => {
                    acc[channel.id] = {
                        profileUrl: channel.snippet.thumbnails.high.url,
                        subscriberCount: channel.statistics.subscriberCount,
                    };
                    return acc;
                }, {});

                // Step 6: Map the detailed video data, including duration
                const mappedVideos: Video[] = videoDetails.map((item: any) => {
                    const channelId = item.snippet.channelId;
                    const channelInfo = channelMap[channelId] || {};
                    const duration = formatVideoDuration(item.contentDetails.duration);

                    return {
                        id: item.id,
                        title: item.snippet.title,
                        channel: {
                            name: item.snippet.channelTitle,
                            profileUrl: channelInfo.profileUrl || '',
                            subscriberCount: channelInfo.subscriberCount || 'N/A',
                        },
                        views: item.statistics.viewCount || 0, // Real views count from the videos API
                        postedAt: new Date(item.snippet.publishedAt),
                        duration: duration, // Duration in ISO 8601 format (PT4M33S)
                        thumbnailUrl: item.snippet.thumbnails.high.url,
                        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
                    };
                });

                setVideos(mappedVideos);
                fetchVideoDetails()
            } catch (error) {
                console.error('Error fetching YouTube videos:', error);
                setError('Failed to load videos');
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchVideos();

        }
    }, [searchQuery]);

    return (
        <VideoContext.Provider value={{ videos, loading, error, searchQuery, setSearchQuery, shortsVideos }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideoContext = () => {
    const value = useContext(VideoContext);
    if (value == null) throw Error("Cannot use outside of videoProvider");
    return value;
};
