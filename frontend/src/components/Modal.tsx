import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0  bg-black/30 z-40" onClick={onClose}></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 text-yellow-800 rounded-full p-2 mr-3">
              ⚠️
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>

          <p className="text-gray-700 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
