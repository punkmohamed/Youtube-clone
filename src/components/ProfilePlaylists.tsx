import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_KEY = 'AIzaSyDEQEJ3qvVvroAwP-pBh97vXMCHDNJzMeY';
const ProfilePlaylists = () => {
    // const [channelPlayListVideos, setChannelPlayListVideos] = useState()
    // const { id } = useParams()
    // useEffect(() => {
    //     const fetchVideoDetails = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&key=${API_KEY}&id=${id}`
    //             );
    //             const data = response?.data
    //             if (data.items && data.items.length > 0) {
    //                 setChannelHomeVideos(data.items[0]);
    //             }

    //         } catch (error) {
    //             console.error('Error fetching video details:', error);
    //         }
    //     };

    //     fetchVideoDetails();
    // }, [id]);
    return (
        <div>ProfilePlaylists</div>
    )
}

export default ProfilePlaylists