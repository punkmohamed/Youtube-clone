
import Button from './Button';
import { ArrowUpNarrowWideIcon, ArrowUpRightIcon, CircleAlertIcon, Flag, Globe, Globe2Icon, Mail, PlaySquare, User, X } from 'lucide-react';
import facebook from "../assets/facebook-svgrepo-com.svg"
import tiktok from "../assets/brand-tiktok-sq-svgrepo-com.svg"
import instgram from "../assets/instagram-1-svgrepo-com.svg"
import twitter from "../assets/icons8-twitterx.svg"
import { VIEW_FORMATTER } from '../utils/formatTimeAgo';
type AboutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    description: string;
    publishedAt: string;
    subscriberCount: number;
    videoCount: number;
    viewCount: number;
    customUrl: string;
    channelCountry: string;
};
const AboutModal = ({ isOpen, onClose, description, publishedAt, subscriberCount, videoCount, viewCount, customUrl, channelCountry }: AboutModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white relative rounded-lg px-6 shadow-lg w-96 md:w-[35rem] max-h-[30rem] overflow-y-auto">
                <div className=' fixed  py-2 bg-white'>
                    <div className='flex items-center gap-[16rem]  md:gap-[27rem]'>
                        <h2 className="text-lg font-semibold    ">About</h2>
                        <Button
                            onClick={onClose}
                            variant="ghost" size="icon">
                            <X />
                        </Button>
                    </div>
                </div>
                <div className='mt-24 my-5'>
                    <div className='flex flex-col gap-5'>
                        <p>{description}</p>
                        <h2 className='font-bold text-xl'>Links</h2>
                        <div className='flex gap-4 items-center'>
                            <img src={twitter} className='object-cover size-8' alt="icon" />
                            <div>
                                <h2>X</h2>
                                <a href={`#`} target='_blank' className='text-blue-700'>twitter.com/{customUrl}</a>
                            </div>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <img src={instgram} className='object-cover size-8' alt="icon" />
                            <div>
                                <h2>Instagram</h2>
                                <a href={`#`} target='_blank' className='text-blue-700'>instagram.com/{customUrl}</a>
                            </div>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <img src={facebook} className='object-cover size-8' alt="icon" />
                            <div>
                                <h2>Facebook</h2>
                                <a href={`#`} target='_blank' className='text-blue-700'>facebook.com/{customUrl}</a>
                            </div>
                        </div>
                        <div className='flex gap-4 items-center'>
                            <img src={tiktok} className='object-cover size-8' alt="icon" />
                            <div>
                                <h2>TikTok</h2>
                                <a href={`#`} target='_blank' className='text-blue-700'>tiktok.com/{customUrl}</a>
                            </div>
                        </div>
                        <h2 className='font-bold text-xl'>Channel details</h2>
                        <div className='flex items-center gap-5'>
                            <Mail />
                            <Button variant="ghost" size="default" className='bg-secondary rounded-full'>
                                View email address
                            </Button>
                        </div>
                        <div className='flex items-center gap-5'>
                            <Globe />
                            <a target='_blank' href={`www.youtube.com/${customUrl}`}>www.youtube.com/{customUrl}</a>
                        </div>
                        <div className='flex items-center gap-5'>
                            <User />
                            <h3>{VIEW_FORMATTER.format(subscriberCount)} subscribers</h3>
                        </div>
                        <div className='flex items-center gap-5'>
                            <PlaySquare />
                            <h3>{VIEW_FORMATTER.format(videoCount)} videos</h3>
                        </div>
                        <div className='flex items-center gap-5'>
                            <ArrowUpNarrowWideIcon />
                            <h3>{VIEW_FORMATTER.format(viewCount)} views</h3>
                        </div>
                        <div className='flex items-center gap-5'>
                            <CircleAlertIcon />
                            <h3>Joined {publishedAt?.split("T")[0]} </h3>
                        </div>
                        <div className='flex items-center gap-5'>
                            <Globe2Icon />
                            <h3>{channelCountry}</h3>
                        </div>
                        <div className='flex gap-4'>
                            <Button variant="ghost" size="default" className='bg-secondary rounded-full flex gap-3 px-3'>
                                <span><ArrowUpRightIcon /></span>
                                Share channel
                            </Button>
                            <Button variant="ghost" size="default" className='bg-secondary rounded-full flex gap-3 px-3'>
                                <span><Flag /></span>
                                Report user
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AboutModal;
