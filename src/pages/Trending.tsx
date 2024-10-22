
import trendingImg from '../assets/trending-video.png'
import TrendingNow from "../components/TrendingNow";
import TrendingGaming from "../components/TrendingGaming";
import TrendingMovies from "../components/TrendingMovies";
import TrendingMusic from "../components/TrendingMusic";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { formatVideoDuration } from '../utils/formatVideoDuration';

type Sections = {
    Now: JSX.Element;
    Music: JSX.Element;
    Gaming: JSX.Element;
    Movies: JSX.Element;
}
type SectionKey = 'Now' | 'Music' | 'Gaming' | 'Movies';
const tabs: SectionKey[] = ["Now", "Music", "Gaming", "Movies"];

type VideoGrid = {
    id: string,
    title: string,
    channel: {
        id: string,
        name: string,
        profileUrl: string
    }
    views: number,
    postedAt: Date | string,
    duration: number,
    thumbnailUrl: string,
    videoUrl: string,
    description?: string,
}

const API_KEY = 'AIzaSyBE6V01lroMLICgaUll6b7zB6n5GDhvyTY';
const Trending = () => {

    const [active, setActive] = useState<SectionKey>("Now");
    const [trendingVideos, setTrendingVideos] = useState<VideoGrid[]>([]);
    const [category, setCategory] = useState<number | string>('');



    useEffect(() => {
        const fetchTrendingVideos = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=EG${category ? `&videoCategoryId=${category}` : ''}&maxResults=10&key=${API_KEY}`
                );
                const videoDetails = response?.data?.items
                const mappedVideos = videoDetails.map((item: any) => {
                    const channelId = item.snippet.channelId;
                    const duration = formatVideoDuration(item.contentDetails.duration);

                    return {
                        id: item.id,
                        title: item.snippet.title,
                        channel: {
                            name: item.snippet.channelTitle,
                            channelId
                        },
                        description: item.snippet.description,
                        views: item.statistics.viewCount || 0,
                        postedAt: new Date(item.snippet.publishedAt),
                        duration: duration,
                        thumbnailUrl: item.snippet.thumbnails.high.url,
                        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
                    };
                });
                setTrendingVideos(mappedVideos);
            } catch (error) {
                console.error("Error fetching trending videos", error);
            }
        };

        fetchTrendingVideos();
    }, [category]);
    const handleActive = (tab: SectionKey) => {
        setActive(tab)
        const type =
            tab === 'Now' ? '' : tab === 'Music' ? 10 : tab === 'Movies' ? 30 : 20;
        setCategory(type);
    }
    const sections: Sections = {
        Now: <TrendingNow trendingVideos={trendingVideos} />,
        Music: <TrendingMusic trendingVideos={trendingVideos} />,
        Gaming: <TrendingGaming trendingVideos={trendingVideos} />,
        Movies: <TrendingMovies trendingVideos={trendingVideos} />,

    };
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5">
                <img src={trendingImg} className=" object-cover size-24" alt="trending" />
                <h1 className="text-4xl font-bold">Trending</h1>
            </div>
            <div className="flex gap-3 items-center border-b border-secondary-border w-full my-2 flex-wrap ">
                {tabs.map((tab) => (
                    <button onClick={() => handleActive(tab)} className={`p-3 font-semibold ${active === tab ? "border-b-2  border-black " : " text-secondary-text hover:border-b-2 hover:border-secondary-border"} `}>{tab}</button>
                ))}
            </div>
            {sections[active]}
        </div>
    )
}

export default Trending