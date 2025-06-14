'use client';


import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


export default function Header() {
    const path = usePathname();
    const query = useSearchParams();
    const queryString = query ? '?' + query.toString() : '';
    const queryLinkTitle = query.has('life') ? `Get A Quote` : 
        query.has('accident') ? `Get A Quote` : "Get A Quote";
    const queryExists = query && Array.from(query.keys()).length > 0;

    return <header className="bg-white shadow p-6">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-[#7200a2]"><Link href={`/${queryString}`}>George Anthony</Link></h1>
            <nav className="space-x-6 flex items-center">
            
                {!path.includes('quote') && queryExists && <Link href={`/quote${queryString}`} className="hover:text-[#7200a2]">{queryLinkTitle}</Link>}
                <div className="hidden md:block space-x-4">
                    <Link href={`/about${queryString}`} className="hover:text-[#7200a2]">About</Link>
                    <Link href={`/${queryString}#contact`} className="hover:text-[#7200a2]">Contact</Link>
                </div>
                <div className="md:hidden relative text-2xl">
                    <DropdownMenu>
                        <DropdownMenuTrigger><span className="hover:text-[#7220a2]">☰</span></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link href={`/about${queryString}`} className="block hover:text-[#7200a2] cursor-pointer my-2">About</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/${queryString}#contact`} className="block hover:text-[#7200a2] cursor-pointer my-2">Contact</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </div>
    </header>
}