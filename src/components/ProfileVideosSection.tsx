/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CategoriesPills from "../components/CategoriesPills";
import VideoGrid from "../components/VideoGrid";


import { useEffect, useState } from "react";
import { formatVideoDuration } from "../utils/formatVideoDuration";
import { useParams } from "react-router-dom";
import { useApiContext } from "../context/API_KEYS";

const categories = ["Latest", "Popular", "Oldest"]
type VideoDetails = {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: string;
    views: number;
    postedAt: Date | string | Date;
};
const ProfileVideosSection = () => {
    const [selectedCat, setSelectedCat] = useState(categories[0]);
    const [channelVideos, setChannelVideos] = useState<VideoDetails[]>([]);
    const { API_KEYS_4: API_KEY, API_KEYS_3 } = useApiContext()
    const { id } = useParams()
    useEffect(() => {
        const fetchChannelVideos = async () => {
            try {
                // Step 1: Get the list of video IDs from the channel
                const searchResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=15&order=date&type=video&key=${API_KEYS_3}`
                );

                const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');

                // Step 2: Get video details (duration, view count) for the retrieved video IDs
                const videoDetailsResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
                );

                const videoDetails = videoDetailsResponse.data.items.map((video: any) => ({
                    id: video.id,
                    title: video.snippet.title,
                    thumbnailUrl: video.snippet.thumbnails.high.url,
                    duration: formatVideoDuration(video.contentDetails.duration),
                    views: video.statistics.viewCount,
                    postedAt: video.snippet.publishedAt,
                }));
                console.log(videoDetails, "videoDetails");
                let sortedVideos;
                if (selectedCat === "Latest") {
                    sortedVideos = [...videoDetails].sort((a, b) => {
                        const dateA = new Date(a.postedAt).getTime();
                        const dateB = new Date(b.postedAt).getTime();

                        return dateB - dateA;
                    });
                } else if (selectedCat === "Popular") {
                    sortedVideos = [...videoDetails].sort((a, b) => b.views - a.views);
                } else if (selectedCat === "Oldest") {
                    sortedVideos = [...videoDetails].sort((a, b) => {
                        const dateA = new Date(a.postedAt).getTime();
                        const dateB = new Date(b.postedAt).getTime();
                        return dateA - dateB;
                    });
                }
                setChannelVideos(sortedVideos);
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };


        fetchChannelVideos();
    }, [id, selectedCat]);
    return (
        <>
            <div className="flex gap-3 font-semibold">
                <CategoriesPills categories={categories} selectedCat={selectedCat} onSelect={setSelectedCat} />
            </div>
            <div className=" mt-3 grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {channelVideos.map((video: VideoDetails) => (
                    <VideoGrid key={video.id} {...video} />
                ))}
            </div>
        </>
    )
}

export default ProfileVideosSection