import axios from "axios";
import { useEffect, useState } from "react";
import { channelDetailProps, videoDetailsProps } from "./Detail";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { ArrowUpRight, MessageSquareTextIcon, MoreVerticalIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { VIEW_FORMATTER } from "../utils/formatTimeAgo";

const API_KEY = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY';

const Shorts = () => {
    const { id } = useParams()
    const [videoDetails, setVideoDetails] = useState<videoDetailsProps | null>(null);
    const [channelDetail, setChannelDetail] = useState<channelDetailProps | null>(null)

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`);
                const data = response?.data
                if (data.items && data.items.length > 0) {
                    setVideoDetails(data.items[0]);
                    const channelId = data?.items[0]?.snippet?.channelId;
                    const channelResponse = await axios.get(
                        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${API_KEY}`
                    );
                    const channelData = channelResponse?.data?.items?.[0];
                    const profileImg = channelData?.snippet?.thumbnails?.high.url;
                    const subscriberCount = channelData?.statistics?.subscriberCount
                    if (channelData) {
                        setChannelDetail({
                            profileImg,
                            subscriberCount
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        fetchVideoDetails();
    }, [id]);

    if (!videoDetails) return <div>Loading...</div>;

    const { statistics } = videoDetails;

    return (
        <div className="flex flex-wrap gap-4 justify-center ">
            <div className=" aspect-video bg-red-800 w-56 sm:w-80 h-[85vh] rounded-xl relative">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${id}?playsinline=1&modestbranding=1&rel=0`}
                    frameBorder="0"
                    allow="encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 cursor-pointer rounded-xl"
                ></iframe>
            </div>
            <div className=" flex flex-col gap-4 items-center justify-end">
                <div className="flex flex-col gap-1 items-center">
                    <Button variant="ghost" size="icon" className="bg-secondary size-12">
                        <ThumbsUp />
                    </Button>
                    <p>{VIEW_FORMATTER.format(statistics.likeCount)}</p>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <Button variant="ghost" size="icon" className="bg-secondary size-12">
                        <ThumbsDown />
                    </Button>
                    <p>Dislike</p>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <Button variant="ghost" size="icon" className="bg-secondary size-12">
                        <MessageSquareTextIcon />
                    </Button>
                    <p>{VIEW_FORMATTER.format(statistics.commentCount)}</p>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <Button variant="ghost" size="icon" className="bg-secondary size-12">
                        <ArrowUpRight />
                    </Button>
                    <p>Share</p>
                </div>
                <Button variant="ghost" size="icon" className="bg-secondary size-12">
                    <MoreVerticalIcon />
                </Button>

                <img className="size-12 object-cover  rounded-lg" src={channelDetail?.profileImg} alt="" />
            </div>
        </div>
    )
}

export default Shorts