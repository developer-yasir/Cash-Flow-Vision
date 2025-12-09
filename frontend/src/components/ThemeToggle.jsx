import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="theme-toggle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Dark Mode
      </label>
      <button
        id="theme-toggle"
        onClick={() => {
          console.log('Theme toggle button clicked!');
          toggleTheme();
        }}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:bg-gray-700"
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <span
          aria-hidden="true"
          className={`${
            theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        >
          {theme === 'dark' ? (
            <MoonIcon className="h-5 w-5 text-gray-800" />
          ) : (
            <SunIcon className="h-5 w-5 text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
