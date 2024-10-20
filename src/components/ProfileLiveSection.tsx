import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoGrid from "./VideoGrid";
import { channelDetailsProps } from "../pages/youtubeProfile";
const API_KEY = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY';
const ProfileLiveSection = () => {
    const [channelLiveVideos, setChannelLiveVideos] = useState<channelDetailsProps | null>(null)
    const { id } = useParams()
    // useEffect(() => {
    //     const fetchVideoDetails = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&eventType=live&type=video&key=${API_KEY}`
    //             );
    //             const data = response?.data
    //             console.log(data, "data");

    //             if (data.items && data.items.length > 0) {
    //                 setChannelLiveVideos(data.items);
    //             }

    //         } catch (error) {
    //             console.error('Error fetching video details:', error);
    //         }
    //     };

    //     fetchVideoDetails();
    // }, [id]);
    return (
        <>
            {
                !channelLiveVideos ?
                    <div className="flex justify-center font-semibold text-2xl mt-7">No Live video</div>
                    :
                    <div className=" mt-3 grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                        {/* {channelLiveVideos.map(video => (
                        <VideoGrid key={video.id} {...video} error={error} />
                    ))} */}
                    </div>
            }
        </>

    )
}

export default ProfileLiveSection