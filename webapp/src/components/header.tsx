'use client';


import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


export default function Header() {
    const path = usePathname();

    return <header className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#7200a2]"><Link href="/">George Anthony</Link></h1>
        <nav className="space-x-6 flex items-center">
        
            {!path.includes('quote') && <a href="quote" className="hover:text-[#7200a2]">Get a Quote</a>}
            <div className="hidden md:block space-x-4">
                <a href="#about" className="hover:text-[#7200a2]">About</a>
                <a href="#contact" className="hover:text-[#7200a2]">Contact</a>
            </div>
            <div className="md:hidden relative text-2xl">
                <DropdownMenu>
                    <DropdownMenuTrigger><button className="hover:text-[#7220a2]">☰</button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem><a href="about" className="block hover:text-[#7200a2]">About</a></DropdownMenuItem>
                        <DropdownMenuItem><a href="/#contact" className="block hover:text-[#7200a2]">Contact</a></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    </header>
}