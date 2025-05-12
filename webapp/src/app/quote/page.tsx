'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export default function Quote() {
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
    if (!checkData()) {
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

    const baseUrl = "https://us-central1-georgeanthonycrm.cloudfunctions.net/quote";

    try {
      const res = await fetch(`${baseUrl}/api/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, dob, email, phone }),
      });
      
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      alert("Quote request sent successfully!");
    } catch (error) {
      console.error("Error fetching news summary:", error);
      return "Unable to fetch news summary.";
    }

  };

  function checkData() {
    const { name, dob, email, phone } = formData;
    return (
      name.trim() !== "" &&
      dob.trim() !== "" &&
      (email.trim() !== "" || phone.trim() !== "") &&
      (email.trim() === "" || checkEmail(email)) &&
      (phone.trim() === "" || checkPhone(phone))
    );
  }

  function checkEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  function checkPhone(phone: string) {
    const re = /^\d{10}$/;
    return re.test(phone);
  }
  function checkDOB(dob: string) {
    const re = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD format
    if (!re.test(dob)) {
      return false;
    }
    const [year, month, day] = dob.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  return (
    <div className=" bg-gray-50 text-gray-900 font-sans flex py-12 justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-[#7200a2]">
          Get a Quote
        </h1>
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
    </div>
  );
}
