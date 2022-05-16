import { FC } from 'react';
import { AuthProvider } from '../context/AuthContext';
import Meta from './Meta';
import Nav from './Nav';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <AuthProvider>
            <Meta />
            <Nav />
            <div>
                <main>{children}</main>
            </div>
        </AuthProvider>
    );
};

export default Layout;
