import { useState, useRef, useEffect } from 'react';

export default function MultiSelectDropdown({ options, selectedValues, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (value) => {
        const newSelected = selectedValues.includes(value)
            ? selectedValues.filter(item => item !== value)
            : [...selectedValues, value];
        onChange(newSelected);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="select select-bordered select-sm w-[200px] text-left flex justify-between items-center"
            >
                <span className="truncate">
                    {selectedValues.length === 0 ? 'Select Animal Types' :
                        selectedValues.length === options.length ? 'All Types' :
                            `${selectedValues.length} type(s) selected`}
                </span>
                {/* <span className="ml-2">▼</span> */}
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-base-100 shadow-xl rounded-lg border border-base-300">
                    <div className="p-2">
                        <label className="flex items-center p-2 hover:bg-base-200 rounded cursor-pointer">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={selectedValues.length === options.length}
                                onChange={() => {
                                    onChange(selectedValues.length === options.length ? [] : options.map(opt => opt.id));
                                }}
                            />
                            <span className="ml-2">Select All</span>
                        </label>
                        <div className="divider my-1"></div>
                        {options.map(option => (
                            <label
                                key={option.id}
                                className="flex items-center p-2 hover:bg-base-200 rounded cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={selectedValues.includes(option.id)}
                                    onChange={() => handleToggle(option.id)}
                                />
                                <span className="ml-2">{option.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 