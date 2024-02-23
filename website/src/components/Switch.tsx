import React, { useState } from 'react';

export const Switch = ({ onChange }: any) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    onChange(!isOn);
    setIsOn(!isOn);
  };

  return (
    <div className="flex items-center justify-end z-100 max-w-[100px]">
      {' '}
      {/* Adjusted max width */}
      <label className="inline-flex items-center cursor-pointer">
        {/* Switch container */}
        <div className="relative">
          {/* Switch */}
          <input
            type="checkbox"
            className="sr-only" // Screen-reader only (hidden but accessible)
            checked={isOn}
            onChange={toggleSwitch}
          />
          {/* Switch background */}
          <div
            className={`block w-10 h-5 rounded-full shadow-inner transition-bg duration-300 ${
              isOn ? 'bg-green-400' : 'bg-gray-300'
            }`}
          ></div>
          {/* Switch knob */}
          <div
            className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out ${
              isOn ? 'transform translate-x-full translate-x-[20px]' : '' // Adjusted translation distance
            }`}
          ></div>
        </div>
      </label>
      <p className={`ml-3 text-sm font-bold transition ${isOn ? 'text-green-400' : 'text-black'}`}>
        {' '}
        {/* Adjusted margin and text size */}
        Concierge
      </p>
    </div>
  );
};
