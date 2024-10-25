/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "./Button";
import { ListVideo, Play, SortDesc } from "lucide-react";
import { useApiContext } from "../context/API_KEYS";

type PlayListProps = {
    playListId: string;
    title: string;
    videosListNumber: number;
    thumbnail: string;
}

const ProfilePlaylists = () => {
    const [channelPlayListVideos, setChannelPlayListVideos] = useState<PlayListProps[]>([])
    const { API_KEYS_4: API_KEY } = useApiContext()
    const { id } = useParams()
    const fetchPlaylistItems = async () => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${id}&maxResults=10&key=${API_KEY}`
            );
            console.log(response.data.items, "response.data.items");

            const videos = response.data.items.map((item: any) => ({
                playListId: item.id,
                title: item.snippet.title,
                videosListNumber: item.contentDetails.itemCount,
                thumbnail: item.snippet.thumbnails.high.url,
            }));

            setChannelPlayListVideos(videos);
        } catch (error) {
            console.error('Error fetching playlist items:', error);
        }
    };
    useEffect(() => {

        fetchPlaylistItems();
    }, [id]);
    if (channelPlayListVideos && channelPlayListVideos.length === 0) return <div className="flex items-center justify-center text-xl font-semibold">There are no PlayLists</div>
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <h1>Created playlists</h1>
                <Button size="default" variant="default" className="bg-white" >
                    <div className="flex gap-1">
                        <SortDesc /> <span className="">Sort by</span>
                    </div>
                </Button>
            </div>

            <div className=" mt-6 grid gap-7  grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {channelPlayListVideos && channelPlayListVideos.map((playList) => (
                    <div key={playList.playListId} className=" group flex flex-col gap-2 cursor-pointer  relative before:content-[''] before:h-16 before:top-0 before:mx-2 before:rounded-lg before:-translate-y-1.5 before:absolute  before:w-56 before:bg-secondary-border  " >
                        <div className="relative aspect-video size-full border-t border-white h-32 w-60">
                            <img src={playList.thumbnail} className="block w-full h-full object-cover transition-[border-radius] duration-200  rounded-lg" alt="ThumbNail" />
                            <div className=" absolute bottom-1 right-2 bg-secondary-dark text-secondary text-sm px-1 rounded">
                                <ListVideo className="inline-block" />
                                <span className="font-semibold ">  {playList.videosListNumber} videos</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-[0.9rem]" >{playList.title}</h3>
                        <h4 className="font-semibold text-sm text-secondary-text">View full playlist</h4>
                        <div className="bg-black transition-opacity opacity-0 hover:opacity-70 absolute inset-0 rounded-lg text-white text-center flex items-center gap-1 font-semibold text-sm  justify-center">
                            <Play /> PLAY ALL
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default ProfilePlaylists