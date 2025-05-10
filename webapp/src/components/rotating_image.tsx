'use client'
import { useEffect, useState } from "react";

export default function RotatingImage({images = []}: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);


    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const interval = setInterval(() => {
            setFade(false); // Start fade-out
            timeoutId = setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Update current image
                setFade(true); // Start fade-in
            }, 500); // Duration of fade-out
        }, 5000); // Change image every 5 seconds

        return () => {
            clearInterval(interval); // Clear interval on unmount
            clearTimeout(timeoutId); // Clear timeout on unmount
        };
    }, [images.length]);

    return (
        <div style={{ position: "relative", width: "100%", height: "300px" }}>
            {/* Current Image */}
            <div
                style={{
                    backgroundImage: `url(${images[currentIndex]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    transition: "opacity 0.5s ease-in-out",
                    opacity: fade ? 1 : 0, // Fade in/out
                }}
            />
        </div>
    );
}