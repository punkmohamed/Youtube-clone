import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RelatedVideos from "./RelatedVideos";
import { formatVideoDuration } from "../utils/formatVideoDuration";
const API_KEY = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY';
type ProfileHomeSectionProps = {
    uploads: string | undefined
}
type mainVideoProps = {
    id: string,
    title: string,
    description: string,
    postedAt: Date | string,
    thumbnailUrl: string,
    views: number,
    duration: number | string
}
const ProfileHomeSection = ({ uploads }: ProfileHomeSectionProps) => {

    const [mainVideo, setMainVideo] = useState<mainVideoProps | null>(null)
    const { id } = useParams()
    useEffect(() => {
        const fetchVideoDetails = async () => {
            if (!uploads) {
                console.error('Uploads playlist ID is missing');
                return;
            }

            try {
                // First API call to fetch videos in the playlist
                const playlistResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&key=${API_KEY}&maxResults=10`
                );

                const videoIds = playlistResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);

                // Second API call to fetch statistics for the videos
                const videoDetailsResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
                );

                const videoData = videoDetailsResponse.data.items;


                const id = videoData?.[0].id
                const title = videoData?.[0].snippet?.title
                const description = videoData?.[0].snippet?.description
                const publishedAt = videoData?.[0].snippet?.publishedAt
                const thumbnailUrl = videoData?.[0].snippet?.thumbnails?.high?.url
                const views = videoData?.[0].statistics.viewCount
                const duration = formatVideoDuration(videoData?.[0].contentDetails.duration)
                setMainVideo({
                    id,
                    title,
                    description,
                    postedAt: publishedAt,
                    thumbnailUrl,
                    views,
                    duration
                })

            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        }

        fetchVideoDetails();
    }, [uploads, id]);

    console.log(mainVideo, "mainVideo");


    return (
        <div className="flex flex-col gap-2 mt-1">
            <div className="mr-12 xl:mr-48">
                <RelatedVideos {...mainVideo} className="lg:w-[400px] lg:h-[240px] " />
            </div>
        </div>
    )
}

export default ProfileHomeSection