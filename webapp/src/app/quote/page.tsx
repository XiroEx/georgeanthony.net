'use client'

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { checkData, checkDOB, checkEmail, checkPhone } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

export default function Quote() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    const { name, dob, email, phone } = formData;
    e.preventDefault();
    if (!checkData(formData)) {
      if (email.trim() === "" && phone.trim() === "") {
        alert("Please provide at least one contact method (email or phone).");
        return;
      }else if (email.trim() !== "" && !checkEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      } else if (phone.trim() !== "" && !checkPhone(phone)) {
        alert("Please enter a valid phone number.");
        return;
      } else if (name.trim() === "" || dob.trim() === "") {
        alert("Please fill in all required fields.");
        return;
      } else alert("Please fill in all required fields and provide a valid email or phone number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`https://quote-ldgqw3kyla-uc.a.run.app`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, dob, email, phone }),

      });
      
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      setSuccess(true);
    } catch (error) {
      console.error("Error fetching news summary:", error);
      return "Unable to fetch news summary.";
    }

  };

  return (
    <div className=" bg-gray-50 text-gray-900 font-sans flex py-12 justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <Suspense>
          <QuoteHero />
        </Suspense>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            className={`focus-visible:ring-2 focus-visible:ring-${'[#7200a2]'} focus-visible:border-[#7200a2]`}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            className={`focus-visible:ring-2 focus-visible:ring-${checkDOB(formData.dob) ? '[#7200a2]' : 'red-500'} focus-visible:border-${checkDOB(formData.dob) ? '[#7200a2]' : 'red-500'}`}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email <span className="text-red-500">{formData.phone.trim() === "" ? "*" : ""}</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your Email"
            value={formData.email}
            className={`focus-visible:ring-2 focus-visible:ring-${checkEmail(formData.email) ? '[#7200a2]' : 'red-500'} focus-visible:border-${checkEmail(formData.email) ? '[#7200a2]' : 'red-500'}`}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone <span className="text-red-500">{formData.email.trim() === "" ? "*" : ""}</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your Phone Number"
            value={formData.phone}
            className={`focus-visible:ring-2 focus-visible:ring-${formData.phone.length == 10 ? '[#7200a2]' : 'red-500'} focus-visible:border-${formData.phone.length == 10 ? '[#7200a2]' : 'red-500'}`}
            onChange={(e) => {
              const value = e.target.value; 
              // Allow only digits & max length of 10
              if (/^\d*$/.test(value) && value.length <= 10) {
                handleChange(e);
              }
            }}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#7200a2] hover:bg-purple-800 cursor-pointer text-white"
        >
          Submit
        </Button>
      </form>
      <Dialog open={loading} onOpenChange={setLoading}>
        <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
          { success ? <>
            <DialogTitle className="text-lg font-bold">Success!</DialogTitle>
            <DialogDescription className="mt-2">
              Your quote request has been sent successfully!
            </DialogDescription>
            <Button 
              onClick={() => {
                setLoading(false);
                setSuccess(false);
              }}
              className="mt-4 bg-[#7200a2] hover:bg-purple-800 text-white"
            >
              <Link href='/?life'>Close</Link>
            </Button>
          </>:<>
            <DialogTitle className="text-lg font-bold">Loading...</DialogTitle>
            <DialogDescription className="mt-2 mx-auto p-12">
              <Loading />
            </DialogDescription>
          </>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuoteHero() {
  
  const query = useSearchParams();

  const quoteTitle = query.has('life') ? `Life Insurance Quote` :
    query.has('accident') ? `Accident Insurance Quote` : "Get A Quote";

  const quoteSlogan = (query.has('accident') && query.has('life') ) ?  `Life is unpredictable. Your family's future doesn't have to be. Ease your mind.` :
  query.has('life') ? `When you're no longer there, your love still can be. Ease the burden.` : query.has('accident') ? `Life can be unpredictable. Ease your mind.` : "Get A Quote";

  return (<>
    <h1 className="text-2xl font-bold text-center mb-6 text-[#7200a2]">
      {quoteTitle}
    </h1>
    <h2 className="text-md mb-4 text-[#7200a2] text-center">
      {quoteSlogan}
    </h2>
  </>)
}