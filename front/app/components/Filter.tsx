"use client";

import { useState } from "react";
import Image from "next/image";
import { FaMusic, FaCopy, FaMicrophone } from "react-icons/fa";

interface FilterItem {
  id: string;
  name: string;
  image?: string;
  icon?: React.ReactNode;
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selectedItems: string[];
  onToggle: (id: string) => void;
}

function FilterSection({
  title,
  items,
  selectedItems,
  onToggle,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className="mb-4 rounded-lg"
      style={{ backgroundColor: "#1E2022", borderColor: "#2a2d30" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
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
        <div className="px-4 pb-4 space-y-2">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
              >
                <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain rounded"
                    />
                  ) : item.icon ? (
                    <div className="text-white text-xl">{item.icon}</div>
                  ) : null}
                </div>
                <span className="text-white text-sm flex-1 text-left">
                  {item.name}
                </span>
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-white"
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
      )}
    </div>
  );
}

export default function Filter() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const platforms: FilterItem[] = [
    { id: "soop", name: "숲", image: "/soop.png" },
    { id: "chzzk", name: "치지직", image: "/chzzk.svg" },
    { id: "youtube", name: "유튜브", image: "/youtube.svg" },
  ];

  const types: FilterItem[] = [
    { id: "original", name: "오리지널", icon: <FaMusic /> },
    { id: "cover", name: "커버곡", icon: <FaCopy /> },
    { id: "concert", name: "콘서트", icon: <FaMicrophone /> },
  ];

  const handlePlatformToggle = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTypeToggle = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-xs">
      <FilterSection
        title="타입"
        items={types}
        selectedItems={selectedTypes}
        onToggle={handleTypeToggle}
      />
      <FilterSection
        title="플랫폼"
        items={platforms}
        selectedItems={selectedPlatforms}
        onToggle={handlePlatformToggle}
      />
    </div>
  );
}

