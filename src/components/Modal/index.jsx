import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  console.log("Modal render:", { isOpen });
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    console.log("Backdrop clicked");
    if (e.target === e.currentTarget) {
      console.log("Closing modal via backdrop");
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]"
        onClick={(e) => {
          console.log("Modal content clicked");
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
