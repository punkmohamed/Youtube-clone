/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoGrid from "./VideoGrid";
import CategoriesPills from "./CategoriesPills";
const API_KEY = 'AIzaSyCnDk7A88Tis3iiLKO_GZcRcEtpoh6WMDA';
const ProfileShortsSection = () => {
    const categories = ["Latest", "Popular", "Oldest"]

    const [selectedCat, setSelectedCat] = useState(categories[0]);
    const [channelShortsVideos, setChannelShortsVideos] = useState<
        { id: string; title: string; thumbnailUrl: string; views: string, postedAt: number | string | Date }[]
    >([]);
    const { id } = useParams()
    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&maxResults=10&type=video&videoDuration=short&key=${API_KEY}`
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
                    let sortedVideos;
                    if (selectedCat === "Latest") {
                        sortedVideos = [...combinedData].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
                    } else if (selectedCat === "Popular") {
                        sortedVideos = [...combinedData].sort((a, b) => b.viewCount - a.viewCount);
                    } else if (selectedCat === "Oldest") {
                        sortedVideos = [...combinedData].sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
                    }
                    setChannelShortsVideos(sortedVideos);
                }

            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        fetchVideoDetails();
    }, [id, selectedCat]);
    console.log(channelShortsVideos, "channelShortsVideos");
    const shorts = true
    return (
        <>
            <div className="flex gap-3 font-semibold">
                <CategoriesPills categories={categories} selectedCat={selectedCat} onSelect={setSelectedCat} />
            </div>
            <div className=" mt-3 grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {channelShortsVideos && channelShortsVideos?.map((video) => (
                    <VideoGrid key={video.id} {...video} className="h-96" shorts={shorts} />
                ))}
            </div>
        </>
    )
}

export default ProfileShortsSection