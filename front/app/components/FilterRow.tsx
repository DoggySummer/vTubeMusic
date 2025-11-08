"use client";

import { useState } from "react";
import Image from "next/image";

interface FilterRowItem {
  id: string;
  name: string;
  image: string;
}

export default function FilterRow() {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const groups: FilterRowItem[] = [
    { id: "acaxia", name: "아카시아", image: "/acaxia.webp" },
    { id: "aesther", name: "에스더", image: "/aesther.webp" },
    { id: "bluejump", name: "블루점프", image: "/bluejump.webp" },
    { id: "honeyz", name: "허니즈", image: "/honeyz.webp" },
    { id: "isedol", name: "이세돌", image: "/isedol.webp" },
    { id: "meechu", name: "미츄", image: "/meechu.png" },
    { id: "pjx", name: "PJX", image: "/pjx.webp" },
    { id: "vlyz", name: "VLYZ", image: "/vlyz.webp" },
  ];

  const handleGroupToggle = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="w-full py-4 px-6 rounded-lg"
      style={{ backgroundColor: "#1E2022", borderColor: "#2a2d30" }}
    >
      <div className="flex items-center gap-4 overflow-x-auto">
        {groups.map((group) => {
          const isSelected = selectedGroups.includes(group.id);
          return (
            <button
              key={group.id}
              onClick={() => handleGroupToggle(group.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
                isSelected
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={group.image}
                  alt={group.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <span className="text-white text-sm whitespace-nowrap">
                {group.name}
              </span>
              {isSelected && (
                <svg
                  className="w-4 h-4 text-white flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

