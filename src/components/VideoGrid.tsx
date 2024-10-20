import { useEffect, useRef, useState } from "react"
import { formatDuration } from "../utils/formatDuration"
import { formatTimeAgo, timeAgo, VIEW_FORMATTER } from "../utils/formatTimeAgo"

import { Link, useLocation } from "react-router-dom"
import { twMerge } from "tailwind-merge"

type VideoGrid = {
    id: string,
    title: string,
    channel: {
        id: string,
        name: string,
        profileUrl: string
    }
    views: number,
    postedAt: Date,
    duration: number,
    thumbnailUrl: string,
    videoUrl: string,
    error?: string,
    className?: string,
    shorts?: boolean
}


const VideoGrid = ({ id, title, channel, views, postedAt, duration, thumbnailUrl, videoUrl, error, className, shorts }: VideoGrid) => {
    const [isVideoPlaying, setisVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null)
    const { pathname } = useLocation()
    const path = pathname.startsWith('/@')


    useEffect(() => {
        if (videoRef.current == null) return
        if (isVideoPlaying) {
            videoRef.current.currentTime = 0
            videoRef.current.play()
        } else {
            videoRef.current.pause()
        }
    }, [isVideoPlaying])
    return (
        <div className="flex flex-col gap-2" onMouseEnter={() => setisVideoPlaying(true)} onMouseLeave={() => setisVideoPlaying(false)}>
            <Link to={shorts && shorts === true ? `/shorts/${id}` : `/watch/${id}`} className={twMerge(`relative aspect-video h-44`, className)}>
                <img src={thumbnailUrl} className={`block w-full h-full object-cover transition-[border-radius] duration-200  ${isVideoPlaying ? "rounded-none" : "rounded-xl"}`} alt="ThumbNail" />
                <div className=" absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-1 rounded">
                    {duration}
                </div>
                {error ? <video ref={videoRef} muted playsInline src={videoUrl} className={`block h-full object-cover absolute inset-0 transition-opacity duration-200  ${isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"}`}></video>
                    : !shorts && isVideoPlaying ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0`}
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="absolute inset-0 cursor-pointer"
                        ></iframe>
                    ) : null
                }

            </Link>
            <div className="flex gap-2">
                {!path && !shorts &&
                    <Link to={`/@${channel?.name}/${id}`} className="flex-shrink-0">
                        <img src={channel?.profileUrl} className="size-12 rounded-full" alt="" />
                    </Link>
                }
                <div className="flex flex-col">
                    <Link to={shorts && shorts === true ? `/shorts/${id}` : `/watch/${id}`} className="font-bold">{title}</Link>
                    {!path && !shorts &&
                        <Link to={`/@${channel?.name}/${id}`} className="text-secondary-text text-sm ">{channel?.name}
                            <span className="inline-block ml-1 ">
                                <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                                </svg>
                            </span>
                        </Link>
                    }

                    <div className="text-secondary-text text-sm">
                        {VIEW_FORMATTER.format(views)} Views   {className !== "h-96" && `• ${timeAgo(postedAt)}`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoGrid