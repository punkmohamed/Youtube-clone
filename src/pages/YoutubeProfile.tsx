import { useEffect, useState } from "react";
import Button from "../components/Button"
import { Search } from "lucide-react";

import { useParams } from "react-router-dom";
import { VIEW_FORMATTER } from "../utils/formatTimeAgo"
import axios from "axios";
import ProfileHomeSection from "../components/ProfileHomeSection";
import ProfileVideosSection from "../components/ProfileVideosSection";
import ProfilePlaylists from "../components/ProfilePlaylists";
import ProfileShortsSection from "../components/ProfileShortsSection";
import AboutModal from "../components/AboutModel";


const API_KEY = 'AIzaSyBE6V01lroMLICgaUll6b7zB6n5GDhvyTY';

export type channelDetailsProps = {
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
    contentDetails: {
        relatedPlaylists: {
            likes: string;
            uploads: string;
        }
    }
};

type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

type Sections = {
    Home: JSX.Element;
    Videos: JSX.Element;
    Shorts: JSX.Element;

    Playlists: JSX.Element;
}
type SectionKey = 'Home' | 'Videos' | 'Shorts' | 'Live' | 'Relases' | 'Playlists' | 'Posts';

const tabs: SectionKey[] = ["Home", "Videos", "Shorts", "Live", "Relases", "Playlists", "Posts"]


const YoutubeProfile = () => {

    const [active, setActive] = useState<SectionKey>("Home");
    const [searchIcon, setSearchIcon] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const { id } = useParams()
    const [channelDetails, setChannelDetails] = useState<channelDetailsProps | null>(null);
    useEffect(() => {

        const fetchVideoDetails = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&key=${API_KEY}&id=${id}`
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


    // Optional chaining and fallback values applied
    const snippet = channelDetails?.snippet;
    const statistics = channelDetails?.statistics;
    const brandingSettings = channelDetails?.brandingSettings;
    const contentDetails = channelDetails?.contentDetails;

    const title = snippet?.title ?? 'No Title';
    const description = snippet?.description ?? 'No Description';
    const customUrl = snippet?.customUrl ?? 'No Custom URL';
    const thumbnails = snippet?.thumbnails ?? { high: { url: '', width: 0, height: 0 } };
    const publishedAt = snippet?.publishedAt ?? "no data";
    const subscriberCount = statistics?.subscriberCount ?? 1;
    const videoCount = statistics?.videoCount ?? 1;
    const viewCount = statistics?.viewCount ?? 1;
    const bannerUrl = brandingSettings?.image?.bannerExternalUrl ?? '';
    const channelCountry = brandingSettings?.channel?.country ?? 'Unknown';
    const uploads: string | undefined = contentDetails?.relatedPlaylists?.uploads
    const sections: Sections = {
        Home: <ProfileHomeSection uploads={uploads} />,
        Videos: <ProfileVideosSection />,
        Shorts: <ProfileShortsSection />,
        Playlists: <ProfilePlaylists />,
    };
    if (!channelDetails) return <div>Loading...</div>;
    return (
        <div className="flex flex-col gap-2 mx-0 xl:ml-20 xl:mr-20" >
            <div className="w-full ">
                <img src={bannerUrl} className="object-cover w-full h-36 rounded-xl" alt="" />
            </div>
            <div className="flex flex-col md:flex-row gap-10 justify-center items-center md:justify-start md:items-start md:gap-3 mt-3 mb-3">
                <div className="h-24 w-32  md:h-36 md:w-44 lg:flex-shrink-0">
                    <img className="object-cover rounded-full" src={thumbnails?.high?.url} style={{ width: `${thumbnails.high.width}`, height: `${thumbnails.high.height}`, }} alt="" />
                </div>
                <div className="flex flex-col justify-center items-center sm:items-start sm:justify-start gap-2">
                    <div className="flex items-center  gap-2">
                        <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold ">{title}</h1><span className="inline-block ml-1">
                            <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-secondary-text font-semibold">
                        <p>{customUrl} • {VIEW_FORMATTER.format(subscriberCount)} subscribers • {VIEW_FORMATTER.format(videoCount)} videos</p>
                    </div>
                    <div>
                        <p className="text-secondary-text">{description.substring(0, 100)} <span className="text-black font-semibold cursor-pointer" onClick={openModal}>...more</span></p>
                    </div>
                    <AboutModal isOpen={isModalOpen} onClose={closeModal} description={description} publishedAt={publishedAt} subscriberCount={subscriberCount} videoCount={videoCount} viewCount={viewCount} customUrl={customUrl} channelCountry={channelCountry} />
                    <div className="font-semibold">
                        <span className="text-blue-500">Views • </span>
                        {VIEW_FORMATTER.format(viewCount)}
                    </div>
                    <Button size="default" variant="dark" className="rounded-full px-5 font-bold w-fit ">Subscribe</Button>
                </div>
            </div>
            <div className="flex gap-3 items-center border-b border-secondary-border w-full my-2 flex-wrap">
                {tabs.map((tab) => (
                    <button onClick={() => setActive(tab)} className={`p-3 font-semibold ${active === tab ? "border-b-2  border-black " : " text-secondary-text hover:border-b-2 hover:border-secondary-border"} `}>{tab}</button>
                ))}
                <div className="flex gap-1 w-fit">
                    <Button variant="ghost" size="icon" className="text-secondary-border" onClick={() => setSearchIcon((prev) => !prev)}> <Search /></Button>
                    {searchIcon && <input type="text" className=" outline-none border-b-2 border-black text-black" placeholder="Search" />}
                </div>
            </div>
            {sections[active]}
        </div>
    )
}

export default YoutubeProfile