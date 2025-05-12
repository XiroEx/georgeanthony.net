'use client';


import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


export default function Header() {
    const path = usePathname();
    const query = useSearchParams();
    console.log(query.has('quote'));
    console.log(query)

    return <header className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#7200a2]"><Link href="/">George Anthony</Link></h1>
        <nav className="space-x-6 flex items-center">
        
            {!path.includes('quote') && query.has('quote') && <Link href="quote" className="hover:text-[#7200a2]">Get a Quote</Link>}
            <div className="hidden md:block space-x-4">
                <Link href="about" className="hover:text-[#7200a2]">About</Link>
                <Link href="/#contact" className="hover:text-[#7200a2]">Contact</Link>
            </div>
            <div className="md:hidden relative text-2xl">
                <DropdownMenu>
                    <DropdownMenuTrigger><span className="hover:text-[#7220a2]">☰</span></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem><Link href="about" className="block hover:text-[#7200a2]">About</Link></DropdownMenuItem>
                        <DropdownMenuItem><Link href="/#contact" className="block hover:text-[#7200a2]">Contact</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    </header>
}