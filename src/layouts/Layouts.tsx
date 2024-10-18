
import { ReactNode } from 'react';
import { SidebarProvider } from '../context/SideBarContext';
import PageHeader from './PageHeader';
import SideBar from './SideBar';
type layOutProps = {
    children: ReactNode,
    setSearchQuery: (data: string) => void
}
const Layout = ({ children, setSearchQuery }: layOutProps) => {
    return (
        <SidebarProvider>
            <div className="max-h-screen flex flex-col">
                <PageHeader setSearchQuery={setSearchQuery} />
                <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
                    <SideBar />
                    <div className="overflow-x-hidden px-8 pb-4">
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default Layout;
