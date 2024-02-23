import React, { useState } from 'react';

const Switch = ({ onChange }: any) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    onChange(!isOn);
    setIsOn(!isOn);
  };

  return (
    <div className="flex items-center justify-center p-4">
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
            className={`block w-14 h-8 rounded-full shadow-inner transition-bg duration-300 ${
              isOn ? 'bg-green-400' : 'bg-gray-300'
            }`}
          ></div>
          {/* Switch knob */}
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow transition-transform duration-300 ease-in-out ${
              isOn ? 'transform translate-x-full translate-x-[24px]' : ''
            }`}
          ></div>
        </div>
      </label>
      <p className={`ml-4 font-bold transition ${isOn ? 'text-green-400' : 'text-black'}`}>Concierge</p>
    </div>
  );
};

export default Switch;
