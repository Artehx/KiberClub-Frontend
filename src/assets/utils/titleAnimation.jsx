import { useState, useEffect } from 'react';

export function animateTitle(word) {
    const colors = ['red', 'green', 'gray']; 
    const intervalTime = 150; 

    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLetterIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % word.length;
                setCurrentColorIndex(nextIndex === 0 ? (currentColorIndex + 1) % colors.length : currentColorIndex);
                return nextIndex;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [currentColorIndex, word.length]);

    return (
        <span>
            {word.split('').map((letter, index) => (
                <span key={index} style={{ color: index === currentLetterIndex ? colors[currentColorIndex] : 'black' }}>
                    {letter}
                </span>
            ))}
        </span>
    );
}

