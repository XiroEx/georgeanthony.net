'use client';


import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Header() {
    const path = usePathname();

    return <header className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#7200a2]"><Link href="/">George Anthony</Link></h1>
        <nav className="space-x-6">
        
        {!path.includes('quote') && <a href="quote" className="hover:text-[#7200a2]">Get a Quote</a>}
        <a href="#about" className="hover:text-[#7200a2]">About</a>
        <a href="#contact" className="hover:text-[#7200a2]">Contact</a>
        </nav>
    </header>
}