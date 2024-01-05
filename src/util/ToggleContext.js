import { createContext, useContext, useState } from 'react';

const ToggleContext = createContext();

export function ToggleProvider({ children }) {
  const [isToggled, setToggled] = useState(false);

  const toggle = () => {
    setToggled((prevToggled) => !prevToggled);
  };

  return (
    <ToggleContext.Provider value={{ isToggled, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
}

export function useToggle() {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('useToggle must be used within a ToggleProvider');
  }
  return context;
}
