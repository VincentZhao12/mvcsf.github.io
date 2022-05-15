import { FC } from 'react';
import Meta from './Meta';
import Nav from './Nav';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Meta />
            <Nav />
            <div>
                <main>{children}</main>
            </div>
        </>
    );
};

export default Layout;
