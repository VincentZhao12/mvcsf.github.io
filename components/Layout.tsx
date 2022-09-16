import { FC } from 'react';
import { AuthProvider } from '../context/AuthContext';
import Footer from './Footer';
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
            <Footer />
        </AuthProvider>
    );
};

export default Layout;
