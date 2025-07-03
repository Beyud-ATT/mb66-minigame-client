import { useState } from "react";

export default function UserDropDown({ userData }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("resetToken");
    window.location.reload();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //   if (userData === null) {
  //     return null;
  //   }

  return (
    <div className="relative inline-block text-left w-[150px]">
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium  rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition-colors duration-200"
      >
        <span className="mr-2 text-[#3A5177] font-bold uppercase">
          {userData?.username || "User"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
