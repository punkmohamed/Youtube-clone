
import RelatedVideos from "./RelatedVideos"

type VideoGridProps = {
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
    description?: string,
}
type TrendingNowProps = {
    trendingVideos: VideoGridProps[];
}
const TrendingMusic = ({ trendingVideos }: TrendingNowProps) => {
    return (
        <div className="mt-2">
            <div className="flex flex-col gap-1  w-full">
                {trendingVideos && trendingVideos.map((video) => (
                    <RelatedVideos key={video.id} {...video} className=" " />
                ))}

            </div>
        </div>
    )
}

export default TrendingMusic