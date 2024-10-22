
import { ReactNode } from 'react';

import { SidebarProvider } from '../context/SideBarContext';
import PageHeader from './PageHeader';
import SideBar from './SideBar';
import { VideoProvider } from '../context/videoContext';
import { ApiProvider } from '../context/API_KEYS';
type layOutProps = {
    children: ReactNode,

}
const Layout = ({ children }: layOutProps) => {
    return (
        <ApiProvider>
            <VideoProvider>
                <SidebarProvider>
                    <div className="max-h-screen flex flex-col">
                        <PageHeader />
                        <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
                            <SideBar />
                            <div className="overflow-x-hidden px-4 sm:px-8 pb-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarProvider>
            </VideoProvider>
        </ApiProvider>
    );
};

export default Layout;
