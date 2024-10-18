import { createContext, ReactNode, useState } from 'react';

const VideoContext = createContext(null);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
    const [videos, setVideos] = useState([]);

    // Fetch videos from an API and set them
    return (
        <VideoContext.Provider value={ }>
            {children}
        </VideoContext.Provider>
    );
};