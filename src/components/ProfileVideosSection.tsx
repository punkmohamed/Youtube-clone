import CategoriesPills from "../components/CategoriesPills";
import VideoGrid from "../components/VideoGrid";

import { videos as fallbackVideos } from "../data/home";
import { useVideoContext } from "../context/videoContext";
import { useState } from "react";
const categories = ["Latest", "Popular", "Oldest"]
const ProfileVideosSection = () => {
    const [selectedCat, setSelectedCat] = useState(categories[0]);
    const { videos, loading, error } = useVideoContext()
    const videoss = error ? fallbackVideos : videos;
    return (
        <>
            <div className="flex gap-3 font-semibold">
                <CategoriesPills categories={categories} selectedCat={selectedCat} onSelect={setSelectedCat} />
            </div>
            <div className=" mt-3 grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {videoss.map(video => (
                    <VideoGrid key={video.id} {...video} error={error} />
                ))}
            </div>
        </>
    )
}

export default ProfileVideosSection