'use client'

import { checkEmail } from "@/lib/utils";
import { useState } from "react";
import { Loading } from "./loading";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

export default function Contact() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        const { name, message, email } = formData;
        e.preventDefault();
        e.stopPropagation();

        if (email.trim() === "") {
            alert("Please provide an email.");
            return;
        } else if (email.trim() !== "" && !checkEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        } else if (name.trim() === "") {
            alert("Please fill in all required fields.");
            return;
        } 
        try {
            setLoading(true);
            const res = await fetch(`https://quote-ldgqw3kyla-uc.a.run.app`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, message }),

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
    
    return (<>
        <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
        <form className="grid grid-cols-1 gap-4 max-w-md mx-auto"
            onSubmit={handleSubmit}>
            <Input placeholder="Your Name"
                name="name"
                onChange={handleChange} />
            <Input type="email" placeholder="Your Email" 
                name="email"
                onChange={handleChange} />
            <Input placeholder="What are you looking for?" 
                name="message"
                onChange={handleChange} />
            <Button type="submit" className="bg-[#7200a2] hover:bg-purple-800 text-white">
                Send Message
            </Button>
        </form>
        <Dialog open={loading} onOpenChange={setLoading}>
            <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
            { success ? <>
                <DialogTitle className="text-lg font-bold">Success!</DialogTitle>
                <DialogDescription className="mt-2">
                Your request has been sent successfully!
                </DialogDescription>
                <Button 
                onClick={() => {
                    setLoading(false);
                    setSuccess(false);
                    setFormData({
                    name: "",
                    message: "",
                    email: "",
                    });
                }}
                className="mt-4 bg-[#7200a2] hover:bg-purple-800 text-white"
                >
                Close
                </Button>
            </>:<>
                <DialogTitle className="text-lg font-bold">Loading...</DialogTitle>
                <DialogDescription className="mt-2 mx-auto p-12">
                <Loading />
                </DialogDescription>
            </> }
            </DialogContent>
        </Dialog>
    </>)
}

