'use client'
import React, { useEffect, useState } from 'react';

const doodleData = [
    {
        name: 'star',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#ff69b4' d='M12 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z'/></svg>`,
    },
    {
        name: 'spiral',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#ff69b4' d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22c-5.5 0-10-4.5-10-10S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z'/></svg>`,
    },
    {
        name: 'heart',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#ff69b4' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>`,
    },
    {
        name: 'zigzag',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'><path fill='none' stroke='#ff69b4' stroke-width='2' d='M0 10 L20 0 L40 20 L60 0 L80 20 L100 0'/></svg>`,
    },
    {
        name: 'cloud',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#ff69b4' d='M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z'/></svg>`,
    },
    {
        name: 'flower',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#ff69b4' d='M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M12,18A2,2 0 0,1 14,20A2,2 0 0,1 12,22A2,2 0 0,1 10,20A2,2 0 0,1 12,18M4,10A2,2 0 0,1 6,12A2,2 0 0,1 4,14A2,2 0 0,1 2,12A2,2 0 0,1 4,10M20,10A2,2 0 0,1 22,12A2,2 0 0,1 20,14A2,2 0 0,1 18,12A2,2 0 0,1 20,10M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z'/></svg>`,
    },
    {
        name: 'moon',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='#ff69b4' d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z'/></svg>`,
    },
    {
        name: 'wave',
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'><path fill='none' stroke='#ff69b4' stroke-width='2' d='M0 10 Q25 0, 50 10 T100 10'/></svg>`,
    }
];

const positions = [
    { top: '10%', left: '15%' },
    { top: '60%', right: '10%' },
    { bottom: '20%', left: '30%' },
    { top: '40%', left: '70%' },
    { top: '5%', right: '10%' },
];

const RandomDoodles = () => {
    const [selectedDoodles, setSelectedDoodles] = useState([]);

    useEffect(() => {
        // Randomly select 4 doodles
        const shuffled = [...doodleData].sort(() => 0.5 - Math.random());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setSelectedDoodles(shuffled.slice(0, 5));
    }, []);

    return (
        <div className="relative w-full h-full">
            {selectedDoodles.map((doodle, index) => (
                <div
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    key={doodle.name}
                    className="doodle absolute"
                    style={{
                        ...positions[index],
                        width: index === 3 ? '120px' : '80px',
                        height: index === 3 ? '20px' : '80px',
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        background: `url("data:image/svg+xml,${encodeURIComponent(doodle.svg)}")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        animation: 'float 3s ease-in-out infinite',
                        animationDelay: `${index * 0.5}s`
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .doodle {
          filter: drop-shadow(0 0 2px rgba(255, 105, 180, 0.3));
        }
      `}</style>
        </div>
    );
};

export default RandomDoodles;
