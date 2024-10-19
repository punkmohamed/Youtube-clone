import { MoreVertical } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { formatTimeAgo, VIEW_FORMATTER } from "../utils/formatTimeAgo"
import { formatDuration } from "../utils/formatDuration"

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
    error?: string
}

const RelatedVideos = ({ id, title, channel, views, postedAt, duration, thumbnailUrl }: VideoGrid) => {
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
    return (
        <Link key={id} to={`/watch/${id}`} className="flex flex-row gap-2 w-full max-w-full lg:max-w-[420px] p-2 group cursor-pointer">
            {/* Thumbnail Section */}
            <div className="relative  w-40 flex-shrink-0" onMouseEnter={() => setisVideoPlaying(true)} onMouseLeave={() => setisVideoPlaying(false)}>
                <img
                    src={thumbnailUrl}
                    className="w-full  rounded-lg object-cover group-hover:rounded-none transition-all duration-200"
                    alt="Thumbnail"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                    {formatDuration(duration)}
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
            <div className="flex flex-col flex-grow min-w-0 gap-1">
                {/* Title */}
                <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                    {title}
                </h3>
                {/* Channel Name */}
                <p className="text-gray-600 text-xs break-words ">
                    {channel.name}
                    <span className="inline-block ml-1">
                        <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                        </svg>
                    </span>
                </p>
                {/* Views and Time */}
                <div className="text-gray-600 text-xs">
                    <span>{VIEW_FORMATTER.format(views)}  Views</span>
                    <span className="mx-1">•</span>
                    <span>{formatTimeAgo(postedAt)}</span>
                </div>
            </div>
            <MoreVertical className="flex-shrink-0" />
        </Link>
    )
}

export default RelatedVideos