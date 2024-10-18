import { Link, useParams } from "react-router-dom"
import Button from "../components/Button"
import { ArrowDown, ArrowUpRight, MoreHorizontal, MoreVertical, SortDesc, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { formatTimeAgo, VIEW_FORMATTER } from "../utils/formatTimeAgo"

const API_KEY = 'AIzaSyB5IJeRJobv4jHDFOsO4e1ZelW_NDZ8vds';
type videoDetailsProps = {
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

const Detail = () => {
    const { id } = useParams()
    const [videoDetails, setVideoDetails] = useState<videoDetailsProps | null>(null);
    const [showMore, setShowMore] = useState(false);
    const [isVideoPlaying, setisVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current == null) return
        if (isVideoPlaying) {
            videoRef.current.currentTime = 0
            videoRef.current.play()
        } else {
            videoRef.current.pause()
        }
    }, [isVideoPlaying])
    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`);
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    setVideoDetails(data.items[0]);
                }
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        fetchVideoDetails();
    }, [id]);

    if (!videoDetails) return <div>Loading...</div>;

    const { snippet, statistics } = videoDetails;
    const { title, channelTitle, description, thumbnails, tags, publishedAt } = snippet;
    console.log(videoDetails, "videoDetails");
    console.log(snippet, "snippet");

    return (
        <div className="flex gap-8 lg:gap-1 flex-col lg:flex-row ">
            <div className="  lg:w-[135rem]">
                <div className=" aspect-video bg-red-800 w-full rounded-xl relative">
                    <img src={thumbnails?.standard?.url} className="block w-full h-full object-cover transition-[border-radius] duration-200 rounded-xl" alt="ThumbNail" />

                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${id}?playsinline=1&modestbranding=1&rel=0`}
                        frameBorder="0"
                        allow="encrypted-media"
                        allowFullScreen
                        className="absolute inset-0 cursor-pointer"
                    ></iframe>

                </div>
                <div className="flex flex-col gap-2 my-3">
                    <h1 className="font-bold text-xl">{title}</h1>
                    <div className="flex flex-col  sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:justify-between">
                        <div className="flex gap-4 justify-between">
                            <div className="flex gap-4 flex-grow">
                                <Link to='/' className="flex-shrink-0">
                                    <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2113030492.1729123200&semt=ais_hybrid" className="size-12 rounded-full" alt="" />
                                </Link>
                                <div className="flex flex-col">
                                    <Link to='/' className="text-lg font-semibold">{channelTitle}</Link>
                                    <div className="text-secondary-text text-sm">
                                        {VIEW_FORMATTER.format(statistics.viewCount)}

                                    </div>
                                </div>
                            </div>
                            <div className="space-x-4">
                                <Button size="default" variant="ghost" className="bg-secondary px-4 rounded-full">Join</Button>
                                <Button size="default" variant="dark" className="rounded-full px-5 font-bold ">Subscribe</Button>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-between">
                            <div>
                                <Button size="default" variant="ghost" className="bg-secondary px-4 rounded-s-full " >
                                    <div className="flex gap-1 border-r-2 border-secondary-text pr-4">
                                        <ThumbsUpIcon /> <span className="">{VIEW_FORMATTER.format(statistics.likeCount)}
                                        </span>
                                    </div>
                                </Button>
                                <Button size="default" variant="ghost" className="bg-secondary px-4 rounded-e-full" >
                                    <ThumbsDownIcon />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button size="default" variant="ghost" className="bg-secondary px-4 rounded-full" >
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
                        <div className="flex items-center gap-2 flex-wrap">
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
                                    <p className="ms-1">{showMore ? description : `${description.substring(0, 200)}...`}</p>
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
            <div className="">
                <div className="flex flex-row gap-2 w-full max-w-full lg:max-w-[420px] p-2 group cursor-pointer">
                    {/* Thumbnail Section */}
                    <div className="relative w-40 flex-shrink-0">
                        <img
                            src="https://th.bing.com/th/id/OIG1.wQ7nqzXG6LLji1s3MrOP"
                            className="w-full aspect-video rounded-lg object-cover group-hover:rounded-none transition-all duration-200"
                            alt="Thumbnail"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                            31231
                        </div>
                    </div>
                    {/* Video Info Section */}
                    <div className="flex flex-col flex-grow min-w-0 gap-1">
                        {/* Title */}
                        <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                            helloooo
                        </h3>
                        {/* Channel Name */}
                        <p className="text-gray-600 text-xs break-words ">
                            xqwqwdqwdqwd
                            <span className="inline-block ml-1">
                                <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                                </svg>
                            </span>
                        </p>
                        {/* Views and Time */}
                        <div className="text-gray-600 text-xs">
                            <span>3M views</span>
                            <span className="mx-1">•</span>
                            <span>2123des</span>
                        </div>
                    </div>
                    <MoreVertical />
                </div>
            </div>
        </div>
    )
}

export default Detail