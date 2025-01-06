
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="flex flex-col p-4">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
