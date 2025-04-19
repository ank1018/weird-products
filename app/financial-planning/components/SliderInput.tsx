import React, { useState } from 'react';

interface RangeOption {
    value: string;
    label: string;
}

interface SliderInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    min: number;
    max: number;
    step?: number;
    prefix?: string;
    ranges?: RangeOption[];
}

export default function SliderInput({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 1000,
    prefix = '₹',
    ranges
}: SliderInputProps) {
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleRangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="slider-input-container">
            <label className="slider-label">{label}</label>
            {ranges && (
                <select 
                    value={value} 
                    onChange={handleRangeSelect}
                    className="range-select"
                >
                    {ranges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
            )}
            <div className="slider-wrapper">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleSliderChange}
                    className="slider"
                />
                <div className="input-wrapper">
                    <span className="prefix">{prefix}</span>
                    <input
                        type="number"
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className={`number-input ${isInputFocused ? 'focused' : ''}`}
                        min={min}
                        max={max}
                        step={step}
                    />
                </div>
            </div>
        </div>
    );
} 