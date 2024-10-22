/* eslint-disable no-unexpected-multiline */
import { Link, useParams } from "react-router-dom"
import Button from "../components/Button"
import { ArrowDown, ArrowUpRight, MoreHorizontal, MoreVertical, SortDesc, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { timeAgo, VIEW_FORMATTER } from "../utils/formatTimeAgo"

import RelatedVideos from "../components/RelatedVideos";
import axios from "axios";
import { formatVideoDuration } from "../utils/formatVideoDuration";

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
    subscriberCount: number | string | bigint;
}
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
    error?: string,
    description?: string,
}
type Comment = {
    author: string;
    text: string;
    publishedAt: string;
    authorImage: string;
    like: number;
}
const Detail = () => {
    const { id } = useParams()
    const [videoDetails, setVideoDetails] = useState<videoDetailsProps | null>(null);
    const [channelDetail, setChannelDetail] = useState<channelDetailProps | null>(null)
    const [relatedVideo, setRelatedVideos] = useState<VideoGrid[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    const [showMore, setShowMore] = useState(false);
    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${id}&key=${API_KEY}&maxResults=10`
            );
            console.log(response, "response");

            const commentData = response.data.items.map((item: any) => ({
                author: item.snippet.topLevelComment.snippet.authorDisplayName,
                like: item.snippet.topLevelComment.snippet.likeCount,
                text: item.snippet.topLevelComment.snippet.textDisplay,
                publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
                authorImage: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
            }));
            setComments(commentData);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

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
                        fetchRelatedVideos(channelData.snippet.title);
                        fetchComments()
                    }
                }
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };
        const fetchRelatedVideos = async (searchQuery: string) => {
            try {
                console.log("Fetching related videos for ID:", id); // Debugging the ID
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&maxResults=10&type=video`
                );
                const videoData = response?.data?.items;
                console.log(searchQuery, "searchQuery");

                // Step 1: Collect all videoIds into a single array for video details
                const videoIds = videoData.map((item: any) => item.id.videoId).join(',');

                // Step 2: Fetch all video details in one request
                const videoDetailsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${API_KEY}`);
                const videoDetails = videoDetailsResponse.data.items;

                // Step 3: Collect all channelIds into a single array for channel details
                const channelIds = videoDetails.map((item: any) => item.snippet.channelId).join(',');

                // Step 4: Fetch all channel details in one request
                const channelResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${API_KEY}`
                );
                const channelData = channelResponse.data.items;

                // Step 5: Map channel data by channelId for easier lookup
                const channelMap = channelData.reduce((acc: any, channel: any) => {
                    acc[channel.id] = {
                        profileUrl: channel.snippet.thumbnails.high.url,
                        subscriberCount: channel.statistics.subscriberCount,
                    };
                    return acc;
                }, {});

                // Step 6: Map the detailed video data, including duration and channel information
                const mappedVideos = videoDetails.map((item: any) => {
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

                setRelatedVideos(mappedVideos);
            } catch (error) {
                console.error('Error fetching related videos:', error);
            }
        };


        fetchVideoDetails();
    }, [id]);

    if (!videoDetails) return <div>Loading...</div>;

    const { snippet, statistics } = videoDetails;
    const { title, channelTitle, description, channelId, thumbnails, tags, publishedAt } = snippet;


    return (
        <div className="flex gap-8 xl:gap-14 lg:gap-1 flex-col lg:flex-row mx-1 xl:mx-12 ">
            <div className="   lg:w-[80em]">
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
                                        {VIEW_FORMATTER.format(typeof channelDetail?.subscriberCount === 'string' ? parseInt(channelDetail.subscriberCount) : channelDetail?.subscriberCount)}
                                        subscribers

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
                            <p className="font-semibold">{VIEW_FORMATTER.format(statistics.viewCount)} Views •  {timeAgo
                                (publishedAt)}</p>

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
                        <div className="flex flex-col gap-7 mt-14  max-w-[40rem] xl:max-w-full ">
                            {comments && comments.map((comment) => (
                                <div className="flex gap-2  w-full">
                                    <img src={comment.authorImage} className="size-12 rounded-full shrink-0" alt="" />
                                    <div className="flex flex-col gap-1 flex-grow">
                                        <div>
                                            <span className="font-semibold mr-2">{comment.author} </span><span className="text-secondary-text">{timeAgo(comment?.publishedAt)}</span>
                                        </div>
                                        <p className="pt-1 break-words    md:max-w-[34rem] xl:max-w-full ">{comment.text}</p>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="ghost">
                                                <ThumbsUpIcon />
                                            </Button>
                                            <span className="text-secondary-text">{comment?.like === 0 ? "" : comment?.like}</span>
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
                                    <Button size="icon" variant="ghost" className="shrink-0">
                                        <MoreVertical />
                                    </Button>
                                </div>
                            ))}

                        </div>

                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1 lg:w-[19rem]  xl:w-[40rem]">
                {relatedVideo && relatedVideo.map((video) => (
                    <RelatedVideos key={video.id} {...video} />
                ))}

            </div>
        </div>
    )
}

export default Detail