
import { categories, videos as fallbackVideos } from "../data/home";
import { useEffect, useState } from "react";
import axios from "axios";
import CategoriesPills from "../components/CategoriesPills";
import VideoGrid from "../components/VideoGrid";
import { useVideoContext } from "../context/videoContext";


function Home() {
    const [selectedCat, setSelectedCat] = useState(categories[0]);
    const { videos, loading, error } = useVideoContext()
    const videoss = error ? fallbackVideos : videos;
    return (
        <>
            <div className="sticky top-0 bg-white z-10 pb-4">
                <CategoriesPills categories={categories} selectedCat={selectedCat} onSelect={setSelectedCat} />
            </div>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {videoss.map(video => (
                    <VideoGrid key={video.id} {...video} error={error} />
                ))}
            </div>
        </>

    )
}

export default Home



