
import { categories, videos as fallbackVideos } from "../data/home";
import { useEffect, useState } from "react";
import axios from "axios";
import CategoriesPills from "../components/CategoriesPills";
import VideoGrid from "../components/VideoGrid";
const API_KEY = 'AIzaSyB5IJeRJobv4jHDFOsO4e1ZelW_NDZ8vds';


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
type HomeProps = {
    searchQuery: string
}
function Home({ searchQuery }: HomeProps) {
    const [selectedCat, setSelectedCat] = useState(categories[0]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&maxResults=10&type=video`;
                const response = await axios.get(apiUrl);  // Using axios for the request
                const data = response.data;
                console.log(data, "data");

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
    const videoss = error ? fallbackVideos : videos;
    return (
        <>
            <div className="sticky top-0 bg-white z-10 pb-4">
                <CategoriesPills categories={categories} selectedCat={selectedCat} onSelect={setSelectedCat} />
            </div>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {videoss.map(video => (
                    <VideoGrid key={video.id} {...video} error={error} />
                ))}
            </div>
        </>

    )
}

export default Home



