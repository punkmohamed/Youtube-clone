import { MoreVertical } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { formatTimeAgo, VIEW_FORMATTER } from "../utils/formatTimeAgo"
import { formatDuration } from "../utils/formatDuration"
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
    postedAt: Date | string,
    duration: number,
    thumbnailUrl: string,
    videoUrl: string,
    error?: string,
    description?: string,
    className?: string

}

const RelatedVideos = ({ id, title, channel, views, postedAt, duration, description, thumbnailUrl, className }: VideoGrid) => {

    console.log(duration, "duration");

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
        <Link key={id} to={`/watch/${id}`} className="flex flex-row gap-2 w-full max-w-full  p-2 group cursor-pointer">
            {/* Thumbnail Section */}
            <div className={twMerge(`relative w-40 sm:w-48 lg:w-40  flex-shrink-0`, className)} onMouseEnter={() => setisVideoPlaying(true)} onMouseLeave={() => setisVideoPlaying(false)}>
                <img
                    src={thumbnailUrl}
                    className="w-full h-full rounded-lg object-cover group-hover:rounded-none transition-all duration-200"
                    alt="Thumbnail"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                    {duration}
                </div>
                {isVideoPlaying ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="absolute inset-0 cursor-pointer"
                    ></iframe>
                ) : null}
            </div>
            {/* Video Info Section */}
            <div className={`flex flex-col flex-grow min-w-0 gap-1   ${path && 'gap-5 lg:max-w-none xl:max-w-96'}`}>
                {/* Title */}
                <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                    {title}
                </h3>
                {/* Channel Name */}
                {!path && <p className="text-gray-600 text-xs break-words ">
                    {channel.name}
                    <span className="inline-block ml-1">
                        <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                        </svg>
                    </span>
                </p>}

                {/* Views and Time */}
                <div className="text-gray-600 text-xs">
                    <span>{VIEW_FORMATTER.format(views)}  Views</span>
                    <span className="mx-1">•</span>
                    {path ? <span>{postedAt?.split("T")[0]}</span>
                        : <span>{formatTimeAgo(postedAt)}</span>
                    }


                </div>
                {path && <div>
                    <p className=" hidden sm:block" >{description?.substring(0, 200)}
                    </p>
                    <Link to={`/watch/${id}`} className="text-secondary-text uppercase font-semibold text-sm">
                        READ MORE
                    </Link>
                </div>}
            </div>
            {!path && <MoreVertical className="flex-shrink-0" />}

        </Link>
    )
}

export default RelatedVideos