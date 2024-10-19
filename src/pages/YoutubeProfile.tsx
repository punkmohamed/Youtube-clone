import { useEffect, useState } from "react";
import Button from "../components/Button"
import { Search } from "lucide-react";
import CategoriesPills from "../components/CategoriesPills";
import VideoGrid from "../components/VideoGrid";

import { videos as fallbackVideos } from "../data/home";
import { useVideoContext } from "../context/videoContext";
import { useParams } from "react-router-dom";
import { VIEW_FORMATTER } from "../utils/formatTimeAgo"
import axios from "axios";
const categories = ["Latest", "Popular", "Oldest"]
const tabs = ["Home", "Videos", "Shorts", "Live", "Relases", "Playlists", "Posts"]
const API_KEY = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY';

type channelDetailsProps = {
    kind: string;
    etag: string;
    id: string;
    snippet?: {
        title: string;
        description: string;
        customUrl: string;
        publishedAt: string;
        thumbnails: {
            default: Thumbnail;
            medium: Thumbnail;
            high: Thumbnail;
        };
        localized: {
            title: string;
            description: string;
        };
        country: string;
    };
    statistics: {
        viewCount: number;
        subscriberCount: number;
        hiddenSubscriberCount: boolean;
        videoCount: number;
    };
    brandingSettings: {
        channel: {
            country: string;
            description: string;
            keywords: string;
            title: string;
            unsubscribedTrailer: string;
        }
        image: {
            bannerExternalUrl: string;
        }
    }
};

type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

const YoutubeProfile = () => {
    const [active, setActive] = useState(tabs[1]);
    const [searchIcon, setSearchIcon] = useState(false);
    const [selectedCat, setSelectedCat] = useState(categories[0]);
    const { videos, loading, error } = useVideoContext()
    const videoss = error ? fallbackVideos : videos;

    const { id } = useParams()
    const [channelDetails, setChannelDetails] = useState<channelDetailsProps | null>(null);
    useEffect(() => {

        const fetchVideoDetails = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&key=${API_KEY}&id=${id}`
                );
                const data = response?.data
                if (data.items && data.items.length > 0) {
                    setChannelDetails(data.items[0]);
                }

            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        fetchVideoDetails();
    }, [id]);
    console.log(channelDetails, "channelDetails");


    // Optional chaining and fallback values applied
    const snippet = channelDetails?.snippet;
    const statistics = channelDetails?.statistics;
    const brandingSettings = channelDetails?.brandingSettings;

    const title = snippet?.title ?? 'No Title';
    const description = snippet?.description ?? 'No Description';
    const customUrl = snippet?.customUrl ?? 'No Custom URL';
    const thumbnails = snippet?.thumbnails ?? { high: { url: '', width: 0, height: 0 } };
    const subscriberCount = statistics?.subscriberCount ?? 1;
    const videoCount = statistics?.videoCount ?? 1;
    const viewCount = statistics?.viewCount ?? 1;
    const bannerUrl = brandingSettings?.image?.bannerExternalUrl ?? '';
    const channelCountry = brandingSettings?.channel?.country ?? 'Unknown';

    if (!channelDetails) return <div>Loading...</div>;
    return (
        <div className="flex flex-col gap-2 mx-0 xl:ml-48 xl:mr-20">
            <div className="w-full ">
                <img src={bannerUrl} className="object-cover w-full h-36 rounded-xl" alt="" />
            </div>
            <div className="flex gap-3 mt-3 mb-3">
                <div className="max-h-36 max-w-44">
                    <img className="object-cover rounded-full" src={thumbnails?.high?.url} style={{ width: `${thumbnails.high.width}`, height: `${thumbnails.high.height}`, }} alt="" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-4xl font-bold">{title}</h1><span className="inline-block ml-1">
                            <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-secondary-text font-semibold">
                        <p>{customUrl} • {VIEW_FORMATTER.format(subscriberCount)} subscribers • {VIEW_FORMATTER.format(videoCount)} videos</p>
                    </div>
                    <div>
                        <p className="text-secondary-text">{description} <span className="text-black font-semibold">...more</span></p>
                    </div>
                    <div className="font-semibold">
                        <span className="text-blue-500">Views • </span>
                        {VIEW_FORMATTER.format(viewCount)}
                    </div>
                    <Button size="default" variant="dark" className="rounded-full px-5 font-bold w-fit ">Subscribe</Button>
                </div>
            </div>
            <div className="flex gap-3 items-center border-b border-secondary-border w-full my-2">
                {tabs.map((tab) => (
                    <button onClick={() => setActive(tab)} className={`p-3 font-semibold ${active === tab ? "border-b-2  border-black " : " text-secondary-text hover:border-b-2 hover:border-secondary-border"} `}>{tab}</button>
                ))}

                <div className="flex gap-1 w-fit">
                    <Button variant="ghost" size="icon" className="text-secondary-border" onClick={() => setSearchIcon((prev) => !prev)}> <Search /></Button>
                    {searchIcon && <input type="text" className=" outline-none border-b-2 border-black text-black" placeholder="Search" />}
                </div>
            </div>
            <div className="flex gap-3 font-semibold">
                <CategoriesPills categories={categories} selectedCat={selectedCat} onSelect={setSelectedCat} />
            </div>
            <div className=" mt-3 grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {videoss.map(video => (
                    <VideoGrid key={video.id} {...video} error={error} />
                ))}
            </div>
        </div>
    )
}

export default YoutubeProfile