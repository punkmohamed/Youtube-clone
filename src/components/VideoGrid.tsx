import { useEffect, useRef, useState } from "react"
import { formatDuration } from "../utils/formatDuration"
import { formatTimeAgo } from "../utils/formatTimeAgo"

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
    videoUrl: string
}
const VIEW_FORMATTER = new Intl.NumberFormat(undefined, { notation: "compact" })

const VideoGrid = ({ id, title, channel, views, postedAt, duration, thumbnailUrl, videoUrl }: VideoGrid) => {
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
        <div className="flex flex-col gap-2" onMouseEnter={() => setisVideoPlaying(true)} onMouseLeave={() => setisVideoPlaying(false)}>
            <a href={`/watch?v=${id}`} className="relative aspect-video">
                <img src={thumbnailUrl} className={`block w-full h-full object-cover transition-[border-radius] duration-200  ${isVideoPlaying ? "rounded-none" : "rounded-xl"}`} alt="ThumbNail" />
                <div className=" absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded">
                    {formatDuration(duration)}
                </div>
                <video ref={videoRef} muted playsInline src={videoUrl} className={`block h-full object-cover absolute inset-0 transition-opacity duration-200  ${isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"}`}></video>
            </a>
            <div className="flex gap-2">
                <a href={`/@${channel.id}`} className="flex-shrink-0">
                    <img src={channel.profileUrl} className="size-12 rounded-full" alt="" />
                </a>
                <div className="flex flex-col">
                    <a href={`/watch?v=${id}`} className="font-bold">{title}</a>
                    <a href={`/watch?v=${id}`} className="text-secondary-text text-sm">{channel.name}</a>
                    <div className="text-secondary-text text-sm">
                        {VIEW_FORMATTER.format(views)} Views • {formatTimeAgo(postedAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoGrid