import Hero from "@/components/hero";
import Services from "@/components/service_section";
import TickerTape from "@/components/ticker_tape";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Mail, Phone, DollarSign } from "lucide-react";



async function fetchNewsSummary() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || // Use environment variable if set
    "http://localhost:3000"; // Fallback to localhost for development

  try {
    const res = await fetch(`${baseUrl}/api/news`);
    console.log(res);
    const data = await res.json();
    return data.newsSummary || "";
  } catch (error) {
    console.error("Error fetching news summary:", error);
    return "Unable to fetch news summary.";
  }
}

export default async function FinancialServicesSite() {
  const newsSummary = await fetchNewsSummary();

  return (
    <div className=" bg-gray-50 text-gray-900 font-sans">
      <TickerTape text={(new Date()).toDateString() + " - " + newsSummary} />

      <main className="px-6 py-12 max-w-5xl mx-auto">
        <Hero />
        <Services />
        

        <section id="about" className="mb-16">
          <h3 className="text-2xl font-semibold mb-4">About George Anthony</h3>
          <p className="text-gray-700 leading-relaxed">
            At George Anthony, we deliver a full spectrum of financial and insurance services to empower individuals, families, and businesses. Whether you need strategic advice, fintech consulting, managed investments, or tailored life and accident protection, our mission is to guide you with experience, clarity, and care.
          </p>
        </section>

        <section id="contact" className="mb-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
          <form className="grid grid-cols-1 gap-4 max-w-md mx-auto">
            <Input placeholder="Your Name" />
            <Input type="email" placeholder="Your Email" />
            <Input placeholder="What are you looking for?" />
            <Button type="submit" className="bg-[#7200a2] hover:bg-purple-800 text-white">Send Message</Button>
          </form>
        </section>
      </main>

    </div>
  );
}
