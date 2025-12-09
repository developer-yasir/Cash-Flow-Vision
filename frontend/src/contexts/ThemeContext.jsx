import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    console.log('ThemeContext: Theme changed to:', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('ThemeContext: Added "dark" class to document.documentElement');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('ThemeContext: Removed "dark" class from document.documentElement');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('ThemeContext: Toggling theme from', prevTheme, 'to', newTheme);
      return newTheme;
    });
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};