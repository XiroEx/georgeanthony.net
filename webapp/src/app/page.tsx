import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Mail, Phone, DollarSign } from "lucide-react";

export default function FinancialServicesSite() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      <main className="px-6 py-12 max-w-5xl mx-auto">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Take Control of Your Financial Future</h2>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive services to protect your family, grow your wealth, and support your business goals.
          </p>
          <Button className="px-6 py-3 text-lg bg-[#7200a2] hover:bg-purple-800 text-white">Get Started</Button>
        </section>

        <section id="services" className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardContent className="p-6">
                <h5 className="font-semibold text-xl mb-2 text-[#7200a2]">For Businesses and Professionals</h5>
                <h2 className="text-sm mb-4 text-[#7200a2] uppercase" > fintech consulting and advisory servcies</h2>
                  <p className="text-gray-600 text-sm mb-2 italic">Consulting. Advising. Investing.</p>
                  <p className="text-gray-600 text-sm">
                    We support businesses and professionals with strategic advice, fintech guidance, and managed investment services tailored to evolving financial needs.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Services for Individuals and Families */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h5 className="font-semibold text-xl mb-2 text-[#7200a2]">For Families and Individuals</h5>
                  <h2 className="text-sm mb-4 text-[#7200a2] uppercase" >financial planning & insurance coverage</h2>
                  <p className="text-gray-600 text-sm mb-2 italic">Protect. Invest. Grow.</p>
                  <p className="text-gray-600 text-sm">
                    Offering term and whole life insurance, accident and disability protection, and hospital benefit products to provide financial security and legacy planning.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

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
            <Input placeholder="Your Message" />
            <Button type="submit" className="bg-[#7200a2] hover:bg-purple-800 text-white">Send Message</Button>
          </form>
        </section>
        
      </main>

      <footer className="bg-white border-t p-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 George Anthony. All rights reserved.</p>
      </footer>
    </div>
  );
}
