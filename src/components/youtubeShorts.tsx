import { ArrowDown, ArrowUp, X } from 'lucide-react'
import shortsSvg from '../assets/youtube-shorts-icon.svg'
import Button from './Button'
import { useVideoContext } from '../context/videoContext'
import VideoGrid from './VideoGrid'
import { useState } from 'react'
const YoutubeShorts = () => {
    const shorts = true
    const [more, setMore] = useState(false)
    const [hide, setHide] = useState(true)
    const { shortsVideos } = useVideoContext()
    const slice = shortsVideos.slice(0, 3)
    const shortsVideo = more === false ? slice : shortsVideos
    return (
        <>
            {hide && <div className="flex flex-col gap-2 mt-8">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <img src={shortsSvg} className='object-contain size-8' alt="shortsPic" />
                        <h2 className='font-bold text-2xl'>shorts</h2>
                    </div>
                    <Button onClick={() => setHide((prev) => !prev)}
                        variant="ghost" size="icon">
                        <X />
                    </Button>
                </div>
                <div className=" mt-3 grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                    {shortsVideo && shortsVideo?.map((video: JSX.IntrinsicAttributes & VideoGrid) => (
                        <VideoGrid key={video.id} {...video} className="h-96" shorts={shorts} />
                    ))}
                </div>
                <div className='flex items-center w-full'>
                    <div className='w-1/3 h-0.5 bg-secondary'></div>
                    <button className='py-2 rounded-full font-semibold border border-secondary w-2/5 hover:bg-secondary-hover'
                        onClick={() => setMore((prev) => !prev)}>
                        {more === false ? <>Show more <ArrowDown className='inline-block' /></> : <>Show less <ArrowUp className='inline-block' /> </>}
                    </button>

                    <div className='w-1/3 h-0.5 bg-secondary'></div>
                </div>
            </div>}
        </>

    )
}

export default YoutubeShorts