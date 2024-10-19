import { Link, useParams } from "react-router-dom"
import Button from "../components/Button"
import { ArrowDown, ArrowUpRight, MoreHorizontal, MoreVertical, SortDesc, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { VIEW_FORMATTER } from "../utils/formatTimeAgo"
import { useVideoContext } from "../context/videoContext";

import RelatedVideos from "../components/RelatedVideos";
import axios from "axios";

const API_KEY = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY';

export type videoDetailsProps = {
    kind: string;
    etag: string;
    id: string;
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default: {
                url: string;
                width: number;
                height: number;
            };
            medium: {
                url: string;
                width: number;
                height: number;
            };
            high: {
                url: string;
                width: number;
                height: number;
            };
            standard?: {
                url: string;
                width: number;
                height: number;
            };
            maxres?: {
                url: string;
                width: number;
                height: number;
            };
        };
        channelTitle: string;
        categoryId: string;
        liveBroadcastContent: string;
        localized: {
            title: string;
            description: string;
        };
        tags: string[]
    };
    statistics: {
        viewCount: number;
        likeCount: number;
        favoriteCount: number;
        commentCount: number;
    };
};
export type channelDetailProps = {
    profileImg: string;
    subscriberCount: number | string;
}
const Detail = () => {
    const { id } = useParams()
    const [videoDetails, setVideoDetails] = useState<videoDetailsProps | null>(null);
    const [channelDetail, setChannelDetail] = useState<channelDetailProps | null>(null)
    const [showMore, setShowMore] = useState(false);
    const { videos, loading, error } = useVideoContext()
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

    const { snippet, statistics } = videoDetails;
    const { title, channelTitle, description, channelId, thumbnails, tags, publishedAt } = snippet;


    return (
        <div className="flex gap-8 xl:gap-14 lg:gap-1 flex-col lg:flex-row mx-1 xl:mx-12 ">
            <div className="  lg:w-[80em]">
                <div className=" aspect-video bg-red-800 w-full rounded-xl relative">
                    <img src={thumbnails?.standard?.url} className="block w-full h-full object-cover transition-[border-radius] duration-200 rounded-xl" alt="ThumbNail" />
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
                <div className="flex flex-col gap-2 my-3">
                    <h1 className="font-bold text-xl">{title}</h1>
                    <div className="flex flex-col  sm:flex-row sm:flex-wrap  sm:items-center gap-3 sm:justify-between">
                        <div className="flex gap-4 justify-between items-center flex-grow xl:flex-grow-0">
                            <div className="flex gap-4 flex-grow">
                                <Link to={`/@${channelTitle}/${channelId}`} className="flex-shrink-0">
                                    <img src={channelDetail?.profileImg} className="size-12 rounded-full" alt="" />
                                </Link>
                                <div className="flex flex-col">
                                    <Link to={`/@${channelTitle}/${channelId}`} className="text-lg font-semibold">{channelTitle}         <span className="inline-block ml-1">
                                        <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                                        </svg>
                                    </span></Link>
                                    <div className="text-secondary-text text-sm">
                                        {VIEW_FORMATTER.format(channelDetail?.subscriberCount)} subscribers

                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink">
                                <Button size="default" variant="ghost" className="bg-secondary px-4 rounded-full hidden xl:block">Join</Button>
                                <Button size="default" variant="dark" className="rounded-full px-4 font-bold ">Subscribe</Button>
                            </div>
                        </div>
                        <div className="flex gap-1 justify-between flex-grow xl:flex-grow-0">
                            <div>
                                <Button size="default" variant="ghost" className="bg-secondary px-2 rounded-s-full " >
                                    <div className="flex gap-1 border-r-2 border-secondary-text pr-2">
                                        <ThumbsUpIcon /> <span className="">{VIEW_FORMATTER.format(statistics.likeCount)}
                                        </span>
                                    </div>
                                </Button>
                                <Button size="default" variant="ghost" className="bg-secondary px-2 rounded-e-full" >
                                    <ThumbsDownIcon />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button size="default" variant="ghost" className="bg-secondary px-2 rounded-full" >
                                    <div className="flex gap-1  ">
                                        <ArrowUpRight /> <span>Share</span>
                                    </div>
                                </Button>
                                <Button size="icon" variant="ghost" className="bg-secondary" >
                                    <MoreHorizontal />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-secondary rounded-2xl p-4 my-4 flex flex-col">
                        <div className="flex items-center gap-1 flex-wrap">
                            <p className="font-semibold">{VIEW_FORMATTER.format(statistics.viewCount)} Views •  {publishedAt.split("T")[0]}</p>

                            {tags && tags.map((tag) => (
                                <div className="space-x-1 cursor-pointer ">
                                    <span className="text-blue-800 font-semibold hover:text-blue-900">#{tag}</span>
                                </div>
                            ))}
                        </div>

                        {description &&
                            <>
                                <div className="mt-8">
                                    <h2 className="font-bold text-xl">Description : </h2>
                                    <p className="ms-1 break-words">{showMore ? description : `${description.substring(0, 200)}...`}</p>
                                </div>
                                <span className="mt-3 cursor-pointer" onClick={() => setShowMore((prev) => !prev)}>{showMore ? 'Show less' : '...more'}</span>
                            </>
                        }

                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold">{VIEW_FORMATTER.format(statistics.commentCount)} Comments</h3>
                            <Button size="default" variant="default" className="bg-secondary px-4 rounded-full " >
                                <div className="flex gap-1">
                                    <SortDesc /> <span className="">Sort by</span>
                                </div>
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 mt-5">
                            <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1729123200&semt=ais_hybrid" className="size-12 rounded-full" alt="" />
                            <input type="text" placeholder="Add a comment" className="w-full py-2 border-b-2" />
                        </div>
                        <div className="flex flex-col gap-7 mt-14">

                            <div className="flex gap-2 ">
                                <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1729123200&semt=ais_hybrid" className="size-12 rounded-full" alt="" />
                                <div className="flex flex-col gap-1">
                                    <div>
                                        <span className="font-semibold">@Mohamed hassan </span><span className="text-secondary-text">9 months ago</span>
                                    </div>
                                    <p className="pt-1">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo odio, nam eos aliquam adipisci commodi libero eum!</p>
                                    <div className="flex items-center gap-2">
                                        <Button size="icon" variant="ghost">
                                            <ThumbsUpIcon />
                                        </Button>
                                        <span className="text-secondary-text">813</span>
                                        <Button size="icon" variant="ghost">
                                            <ThumbsDownIcon />
                                        </Button>
                                        <span className="ml-2 cursor-pointer hover:bg-secondary-hover rounded-full p-2">Reply</span>
                                    </div>
                                    <div className="bg-none w-fit  p-2 rounded-full hover:bg-blue-500">
                                        <div className="flex text-blue-600 gap-3">
                                            <ArrowDown />
                                            <span> 3 replies</span>
                                        </div>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost">
                                    <MoreVertical />
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1 lg:w-[19rem]  xl:w-[40rem]">
                {videos && videos.map((video) => (
                    <RelatedVideos key={video.id} {...video} />
                ))}

            </div>
        </div>
    )
}

export default Detail