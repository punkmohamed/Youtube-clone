import { ArrowLeft, Bell, Menu, Mic, Search, Upload, User } from 'lucide-react'
import logo from '../assets/YouTube_Logo_2017.svg.webp'
import Button from '../components/Button'
import { useState } from 'react'
import { useSidebarContext } from '../context/SideBarContext'
type PageHeaderProps = {
    setSearchQuery: (data: string) => void
}
const PageHeader = ({ setSearchQuery }: PageHeaderProps) => {
    const [show, setShow] = useState(false)

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        setSearchQuery(searchTerm);
        setSearchTerm('');
    };
    return (
        <div className='flex gap-10 sm:gap-20 justify-between items-center pt-2 mb-6 mx-4'>
            <PageHeaderFirstSection hidden={show} />

            <form className={`  gap-4 flex-grow justify-center ${show === true ? 'flex' : 'hidden md:flex'}`}>
                {show && <Button type='button' variant="ghost" onClick={() => setShow(false)} size="icon" className='flex-shrink-0'>
                    <ArrowLeft />
                </Button>}
                <div className='flex flex-grow max-w-[600px]'>
                    <input type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Search' className='rounded-l-full border border-secondary-border shadow-inner py-1 px-4 text-lg w-full shadow-secondary focus:border-blue-500 outline-none' />
                    <Button type='button'
                        onClick={handleSearch} className=' py-2 px-4 rounded-r-full border border-secondary-border border-l-0 flex-shrink-0'>
                        <Search />
                    </Button>
                </div>
                <Button type='button' size="icon" className='flex-shrink-0'>
                    <Mic />
                </Button>
            </form>
            <div className={` flex-shrink-0 md:gap-2 items-center ${show === true ? 'hidden' : 'flex'}`}>
                <Button onClick={() => setShow(true)} size="icon" variant="ghost" className='md:hidden '>
                    <Search />
                </Button>
                <Button size="icon" variant="ghost" className='md:hidden '>
                    <Mic />
                </Button>
                <Button size="icon" variant="ghost">
                    <Upload />
                </Button>
                <Button size="icon" variant="ghost">
                    <Bell />
                </Button>
                <Button size="icon" variant="ghost">
                    <User />
                </Button>
            </div>
        </div>
    )
}
type PageHeaderFirstSectionProps = {
    hidden?: boolean
}
export function PageHeaderFirstSection({
    hidden = false,
}: PageHeaderFirstSectionProps) {
    const { toggle } = useSidebarContext()

    return (
        <div
            className={`gap-4 items-center flex-shrink-0 ${hidden ? "hidden" : "flex"
                }`}
        >
            <Button onClick={toggle} variant="ghost" size="icon">
                <Menu />
            </Button>
            <a href="/">
                <img src={logo} className="h-6" />
            </a>
        </div>
    )
}
export default PageHeader