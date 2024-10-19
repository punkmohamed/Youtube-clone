import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { channelDetailProps } from '../pages/Detail';
const API_KEY = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY';


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
        subscriberCount: string | number;

    };
    views: number;
    postedAt: Date;
    duration: number;
    thumbnailUrl: string;
    videoUrl: string;
}
const VideoContext = createContext(null);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [channelDetail, setChannelDetail] = useState<channelDetailProps | null>(null)

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&maxResults=10&type=video`;
                const videoResponse = await axios.get(apiUrl);
                const videoData = videoResponse.data.items;

                // Step 2: Collect all channelIds into a single array
                const channelIds = videoData.map((item: any) => item.snippet.channelId).join(',');

                // Step 3: Make a single API request to fetch all channel details
                const channelResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${API_KEY}`
                );
                const channelData = channelResponse?.data?.items;

                // Map channel data by channelId for easier lookup
                const channelMap = channelData.reduce((acc: any, channel: any) => {
                    acc[channel.id] = {
                        profileUrl: channel.snippet.thumbnails.high.url,
                        subscriberCount: channel.statistics.subscriberCount,
                    };
                    return acc;
                }, {});


                const mappedVideos: Video[] = videoData.map((item: any) => {
                    const channelId = item.snippet.channelId;
                    const channelInfo = channelMap[channelId] || {};

                    return {
                        id: item.id.videoId,
                        title: item.snippet.title,
                        channel: {
                            name: item.snippet.channelTitle,
                            profileUrl: channelInfo.profileUrl || '',
                            subscriberCount: channelInfo.subscriberCount || 'N/A',
                        },
                        views: getRandomViews(),
                        postedAt: new Date(item.snippet.publishedAt),
                        duration: getRandomDuration(),
                        thumbnailUrl: item.snippet.thumbnails.high.url,
                        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    }
                });
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


    return (
        <VideoContext.Provider value={{ videos, loading, error, setSearchQuery }}>
            {children}
        </VideoContext.Provider>
    );
};


export const useVideoContext = () => {
    const value = useContext(VideoContext)
    if (value == null) throw Error("Cannot use outside of videoProvider")

    return value
}