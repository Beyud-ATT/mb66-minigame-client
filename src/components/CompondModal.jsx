import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

function ModalProvider({ children }) {
  const [open, setOpen] = useState(false);

  function openModal() {
    console.log("Open modal");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <ModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

function Trigger({ children }) {
  const { openModal } = useModal();
  return React.cloneElement(children, {
    onClick: children.onClick || openModal,
  });
}

function Content({ render }) {
  const { open, closeModal } = useModal();
  return <>{render(open, closeModal)}</>;
}

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

ModalProvider.Trigger = Trigger;
ModalProvider.Content = Content;

export { ModalProvider, useModal };
