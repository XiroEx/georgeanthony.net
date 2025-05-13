'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { useSearchParams } from "next/navigation";

export default function Hero() {
    const query = useSearchParams();
    const queryString = query ? '?' + query.toString() : '';
    console.log(query)
    console.log(queryString);

    return (
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Take Control</h2>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive services to protect your family, grow your wealth, and support your business goals.
          </p>
          <Button className="px-6 py-3 text-lg bg-[#7200a2] hover:bg-purple-800 text-white"><Link href={`/${queryString}#contact`}>Get Started</Link></Button>
        </section>
    )
}