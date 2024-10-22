import {
    ChevronDown,
    ChevronUp,
    Clapperboard,
    Clock,
    Home,
    Library,
    PlaySquare,
    Repeat,
    History,
    ListVideo,
    Flame,
    ShoppingBag,
    Music2,
    Film,
    Radio,
    Gamepad2,
    Newspaper,
    Trophy,
    Lightbulb,
    Shirt,
    Podcast,
} from "lucide-react"

import { Children, ElementType, ReactNode, useState } from "react"
import Button, { buttonStyles } from "../components/Button"
import { twMerge } from "tailwind-merge"
import { playlists, subscriptions } from "../data/sidebar";
import { useSidebarContext } from "../context/SideBarContext";
import { PageHeaderFirstSection } from "./PageHeader";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {

    const { isLargeOpen, isSmallOpen, close } = useSidebarContext()
    const { pathname } = useLocation()

    return (
        <>
            {!pathname.startsWith('/watch') &&
                <aside
                    className={`sticky top-0 overflow-y-auto scrollbar-hidden pb-4 md:flex flex-col ml-1 ${isLargeOpen ? "lg:hidden" : "lg:flex"
                        }`}
                >
                    <SmallSideBarItem Icon={Home} title="Home" url="/" />
                    <SmallSideBarItem Icon={Repeat} title="Shorts" url="/shorts" />
                    <SmallSideBarItem
                        Icon={Clapperboard}
                        title="Subscriptions"
                        url="/subscriptions"
                    />
                    <SmallSideBarItem Icon={Library} title="Library" url="/library" />
                </aside>
            }

            {isSmallOpen && (
                <div
                    onClick={close}
                    className="lg:hidden fixed inset-0 z-[999] bg-secondary-dark opacity-50"
                />
            )}
            <aside
                className={`w-56 lg:sticky absolute top-0 overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2 ${isLargeOpen && !pathname.startsWith('/watch') ? "lg:flex" : "lg:hidden"
                    } ${isSmallOpen ? "flex z-[999] bg-white max-h-screen" : "hidden"}`}
            >
                <div className="lg:hidden pt-2 pb-4 px-2 sticky top-0 bg-white">
                    <PageHeaderFirstSection />
                </div>
                <LargeSidebarSection>
                    <LargeSidebarItem isActive Icon={Home} title="Home" url="/" />
                    <LargeSidebarItem
                        Icon={Clapperboard}
                        title="Subscriptions"
                        url="/subscriptions"
                    />
                </LargeSidebarSection>
                <hr />
                <LargeSidebarSection visibleItemCount={5}>
                    <LargeSidebarItem
                        Icon={Library}
                        title="Library"
                        url="/library"
                    />
                    <LargeSidebarItem
                        Icon={History}
                        title="History"
                        url="/history"
                    />
                    <LargeSidebarItem
                        Icon={PlaySquare}
                        title="Your Videos"
                        url="/your-videos"
                    />
                    <LargeSidebarItem
                        Icon={Clock}
                        title="Watch Later"
                        url="/playlist?list=WL"
                    />
                    {playlists.map(playlist => (
                        <LargeSidebarItem
                            key={playlist.id}
                            Icon={ListVideo}
                            title={playlist.name}
                            url={`/playlist?list=${playlist.id}`}
                        />
                    ))}
                </LargeSidebarSection>
                <hr />
                <LargeSidebarSection title="Subscriptions">
                    {subscriptions.map(subscription => (
                        <LargeSidebarItem
                            key={subscription.id}
                            Icon={subscription.imgUrl}
                            title={subscription.channelName}
                            url={`/@${subscription.id}`}
                        />
                    ))}
                </LargeSidebarSection>
                <hr />
                <LargeSidebarSection title="Explore">
                    <LargeSidebarItem
                        Icon={Flame}
                        title="Trending"
                        url="/feed/trending"
                    />
                    <LargeSidebarItem
                        Icon={ShoppingBag}
                        title="Shopping"
                        url="/shopping"
                    />
                    <LargeSidebarItem Icon={Music2} title="Music" url="/music" />
                    <LargeSidebarItem
                        Icon={Film}
                        title="Movies & TV"
                        url="/movies-tv"
                    />
                    <LargeSidebarItem Icon={Radio} title="Live" url="/live" />
                    <LargeSidebarItem
                        Icon={Gamepad2}
                        title="Gaming"
                        url="/gaming"
                    />
                    <LargeSidebarItem Icon={Newspaper} title="News" url="/news" />
                    <LargeSidebarItem
                        Icon={Trophy}
                        title="Sports"
                        url="/sports"
                    />
                    <LargeSidebarItem
                        Icon={Lightbulb}
                        title="Learning"
                        url="/learning"
                    />
                    <LargeSidebarItem
                        Icon={Shirt}
                        title="Fashion & Beauty"
                        url="/fashion-beauty"
                    />
                    <LargeSidebarItem
                        Icon={Podcast}
                        title="Podcasts"
                        url="/podcasts"
                    />
                </LargeSidebarSection>
            </aside>
        </>
    )
}
type SmallSide = {
    Icon: ElementType,
    title: string,
    url: string,
}
const SmallSideBarItem = ({ Icon, title, url }: SmallSide) => {
    return (
        <a href={url} className={twMerge(buttonStyles({ variant: "ghost" }), "py-4 px-1 flex flex-col items-center rounded-lg gap-1")}>
            <Icon className="size-6" />
            <div className="text-sm">
                {title}
            </div>
        </a>
    )
}
type LargeSidebarSectionProps = {
    children: ReactNode,
    title?: string,
    visibleItemCount?: number
}
const LargeSidebarSection = ({ children, title, visibleItemCount = Number.POSITIVE_INFINITY }: LargeSidebarSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const childrenArray = Children.toArray(children).flat()
    const showExpandButton = childrenArray.length > visibleItemCount
    const visibleChildren = isExpanded
        ? childrenArray
        : childrenArray.slice(0, visibleItemCount)
    const ButtonIcon = isExpanded ? ChevronUp : ChevronDown
    return (
        <div>
            {title && <div className="ml-4 mt-2 text-lg mb-1">{title}</div>}
            {visibleChildren}
            {showExpandButton && (
                <Button
                    onClick={() => setIsExpanded(e => !e)}
                    variant="ghost"
                    className="w-full flex items-center rounded-lg gap-4 p-3"
                >
                    <ButtonIcon className="w-6 h-6" />
                    <div>{isExpanded ? "Show Less" : "Show More"}</div>
                </Button>
            )}
        </div>
    )
}
type LargeSide = {
    Icon: ElementType | string
    title: string,
    url: string,
    isActive?: boolean
}
const LargeSidebarItem = ({ Icon, title, url, isActive = false, }: LargeSide) => {
    return <Link to={url} className={twMerge(
        buttonStyles({ variant: "ghost" }),
        `w-full flex items-center rounded-lg gap-4 p-3 ${isActive ? "font-bold bg-neutral-100 hover:bg-secondary" : undefined
        }`
    )}>
        {typeof Icon === "string" ? (
            <img src={Icon} className="w-6 h-6 rounded-full" />
        ) : (
            <Icon className="w-6 h-6" />
        )}
        <div className="whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
        </div>
    </Link>
}
export default SideBar