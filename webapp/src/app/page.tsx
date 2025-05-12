import RotatingImage from "@/components/rotating_image";
import ServiceDialogue from "@/components/service_dialogue";
import TickerTape from "@/components/ticker_tape";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
//import { Mail, Phone, DollarSign } from "lucide-react";


  const familyImages = [
      'https://media.istockphoto.com/id/1313461844/photo/beautiful-multi-generational-family-sitting-together-on-couch-at-home-and-smiling-at-camera.jpg?s=612x612&w=0&k=20&c=d4e5uOqHr4gnv7H6jAqUD8fsdYUHetuVXrGWHgDNBpw=',
      'https://www.waldenu.edu/sites/g/files/krcnkv446/files/styles/atge_default_md/public/2024-03/SEO-2530-bs-Portrait-Of-Smiling-Multi-Gene-431323901-1200x630.png?itok=c118ljeU',
      'https://s29980.pcdn.co/wp-content/uploads/2016/08/family-multigenerational-parents-children.jpg',
      'https://assets.inman.com/wp-content/uploads/2019/05/GettyImages-916122268.jpg',
      ''
  ];

  const bizImages = [
    'https://www.purdueglobal.edu/blog/business/financial-advisor-career.jpg',
    'https://www.investopedia.com/thmb/0oNO_SAlgKD3LMdsM4W3spJKnZk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/thinkstockphotos-480070051-5bfc34ccc9e77c00519c6414.jpg',
    'https://assets.everspringpartners.com/dims4/default/a947561/2147483647/strip/true/crop/1518x612+0+0/resize/800x323!/format/jpg/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2F1d%2F30%2F93e3c8c4433dab3f70e89babe519%2Fmsfa-what-is-fintech.jpg'
  ]

async function fetchNewsSummary() {
  const baseUrl = "http://localhost:3000"; // Fallback to localhost for development

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
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Take Control of Your Financial Future</h2>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive services to protect your family, grow your wealth, and support your business goals.
          </p>
          <Button className="px-6 py-3 text-lg bg-[#7200a2] hover:bg-purple-800 text-white"><Link href='#contact'>Get Started</Link></Button>
        </section>

        <section id="services" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceDialogue
            cardContent={<>
              <h5 className="font-semibold text-xl mb-2 text-[#7200a2]">For Businesses and Professionals</h5>
              <h2 className="text-sm mb-4 text-[#7200a2] uppercase" > fintech consulting and advisory servcies</h2>
              <p className="text-gray-600 text-sm mb-2 italic">Consulting. Advising. Investing.</p>
              <p className="text-gray-600 text-sm">
                We support businesses and professionals with strategic advice, fintech guidance, and managed investment services tailored to evolving financial needs.
              </p>
            </>}
            title="For Businesses and Professionals"
            slogan="Consulting. Advising. Investing."
            content={
              <div className="text-gray-600 p-0 mt-2 text-center">
                <div className="flex flex-col p-0 gap-4">
                  <RotatingImage {...{images: bizImages}} />
                  <div>
                    <ul className="gap-2 flex flex-col">
                      <li>Fintech consulting and advisory services</li>
                      <li>Managed investment services</li>
                      <li>Strategic financial planning</li>
                      <li>Business growth and development</li>
                      <li>Investment management and analysis</li>
                    </ul>
                  </div>
                    <DialogClose asChild>
                      <Link href="#contact">
                        <Button className="bg-[#7200a2] hover:bg-purple-800 text-white">Get Started</Button>
                      </Link>
                    </DialogClose>
                </div>
              </div>
            }
          />

          <ServiceDialogue
            cardContent={<>
              <h5 className="font-semibold text-xl mb-2 text-[#7200a2]">For Families and Individuals</h5>
              <h2 className="text-sm mb-4 text-[#7200a2] uppercase" >financial planning & insurance coverage</h2>
              <p className="text-gray-600 text-sm mb-2 italic">Protect. Invest. Grow.</p>
              <p className="text-gray-600 text-sm">
                Offering term and whole life insurance, accident and disability protection, and hospital benefit products to provide financial security and legacy planning.
              </p>
            </>}
            title="For Families and Individuals"
            slogan="Protect. Invest. Grow."
            content={
              <div className="text-gray-600 p-0 mt-2 text-center">
                <div className="flex flex-col p-0 gap-4">
                  <RotatingImage {...{images: familyImages}} />
                  <div>
                    <ul className="gap-2 flex flex-col">
                      <li>Term and whole life insurance</li>
                      <li>Accident and disability protection</li>
                      <li>Hospital benefit products</li>
                      <li>Legacy planning and estate management</li>
                      <li>Financial security solutions</li>
                    </ul>
                  </div>
                    <div className="mt-2">
                      <DialogClose asChild>
                        <Link href="#contact">
                          <Button className="bg-[#7200a2] hover:bg-purple-800 text-white">Get Started</Button>
                        </Link>
                      </DialogClose>
                    </div>
                </div>
              </div>
            }
          />

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
            <Input placeholder="What are you looking for?" />
            <Button type="submit" className="bg-[#7200a2] hover:bg-purple-800 text-white">Send Message</Button>
          </form>
        </section>
      </main>

    </div>
  );
}
