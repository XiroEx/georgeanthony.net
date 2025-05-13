'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function TickerTape({ text }: { text: string }) {
    const tickerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const ticker = tickerRef.current;
        if (ticker) {
            let animationFrame: number;
            let start: number | null = null;

            // Make the text visible after 500ms
            const visibilityTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 500);

            // Set the initial position of the text offscreen to the right
            const containerWidth = ticker.parentElement?.offsetWidth || 0;
            ticker.style.transform = `translateX(${containerWidth}px)`;

            const scroll = (timestamp: number) => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;

                // Calculate the total distance the text needs to travel
                const totalDistance = containerWidth + ticker.scrollWidth;

                // Move the text left and restart when fully offscreen
                const currentPosition = containerWidth - (elapsed / 10) % totalDistance;
                ticker.style.transform = `translateX(${currentPosition}px)`;

                animationFrame = requestAnimationFrame(scroll);
            };

            const startAnimation = () => {
                animationFrame = requestAnimationFrame(scroll);
            };

            // Delay the animation by 2 seconds
            const animationTimeout = setTimeout(startAnimation, 500);

            return () => {
                clearTimeout(visibilityTimeout);
                clearTimeout(animationTimeout);
                cancelAnimationFrame(animationFrame);
            };
        }
    }, []);

    // get users current date formatted as Mon Jan 1 2020
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });
    const formattedDate = currentDate.replace(/,/g, '').charAt(0).toUpperCase() + currentDate.replace(/,/g, '').slice(1);
    console.log('Formatted Date:', formattedDate);

    return (
        <div
            style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '100%',
                height: '42px',
                position: 'relative',
                backgroundColor: '#7200a2',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div
                ref={tickerRef}
                style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    visibility: isVisible ? 'visible' : 'hidden', // Toggle visibility
                    fontVariant: 'small-caps',
                }}
            >
                {formattedDate.toUpperCase()}{' - '}{text.startsWith('"') && text.endsWith('"') ? text.slice(1, -1) : text}
            </div>
        </div>
    );
}