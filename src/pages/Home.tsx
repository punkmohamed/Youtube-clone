
import { categories, videos as fallbackVideos } from "../data/home";
import { useState } from "react";
import CategoriesPills from "../components/CategoriesPills";
import VideoGrid from "../components/VideoGrid";
import { useVideoContext } from "../context/videoContext";
import YoutubeShorts from "../components/youtubeShorts";


function Home() {
    const [selectedCat, setSelectedCat] = useState(categories[0]);
    const { videos, loading, error, searchQuery } = useVideoContext()
    const videoss = error ? fallbackVideos : videos;

    return (
        <>
            {!searchQuery
                ?
                <div className=" flex flex-col justify-center items-center p-9 w-fit mx-auto shadow-xl rounded-xl">
                    <h2 className="font-bold text-2xl">Try searching to get started</h2>
                    <p className="text-secondary-text">Start watching videos to help us build a feed of videos you'll love.</p></div>
                :
                <>
                    <div className="sticky top-0 bg-white z-10 pb-4">
                        <CategoriesPills categories={categories} selectedCat={selectedCat} onSelect={setSelectedCat} />
                    </div>
                    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                        {videoss.map(video => (
                            <VideoGrid key={video.id} {...video} error={error} />
                        ))}
                    </div>
                    <YoutubeShorts />
                </>
            }
        </>

    )
}

export default Home



