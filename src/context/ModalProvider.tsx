'use client';

import React, { createContext, FC, ReactNode, useContext, useState } from 'react';

type EmergencyContextType = {
  isModalOpen: { [key: string]: boolean };
  toggleModal: (id: string, force?: boolean) => void;
};

const EmergencyContext = createContext<EmergencyContextType>({
  isModalOpen: {},
  toggleModal: () => {},
});

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<{ [key: string]: boolean }>({});

  const toggleModal = (id: string, force?: boolean) => {
    setIsModalOpen((prev) => ({
      ...prev,
      [id]: force !== undefined ? force : !prev[id],
    }));
  };

  return <EmergencyContext.Provider value={{ isModalOpen, toggleModal }}>{children}</EmergencyContext.Provider>;
};

export const useModal = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useModal must be used within an EmergencyProvider');
  }
  return context;
};
