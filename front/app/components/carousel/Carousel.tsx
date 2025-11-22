"use client";

import Image from "next/image";

interface VTuber {
  id: string;
  name: string;
  imageUrl: string;
  group?: string;
}

interface CarouselProps {
  title: string;
  isArtist: boolean;
  items: VTuber[];
}

export default function Carousel({ title, isArtist, items }: CarouselProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
          {title}
        </h2>
        <span className="text-sm font-bold text-gray-400 hover:text-white cursor-pointer uppercase tracking-widest">
          모두 보기
        </span>
      </div>

      <div className="flex overflow-x-auto pb-4 px-4 space-x-6 scrollbar-hide snap-x snap-mandatory">
        {items.map((item) => (
          <div
            key={item.id}
            className="shrink-0 flex flex-col items-center p-4 rounded-md hover:bg-[#181818] transition-colors duration-300 cursor-pointer group w-44 snap-start"
          >
            <div className="relative w-36 h-36 mb-4 shadow-lg shadow-black/40 rounded-full">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#333]">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
            </div>
            <div className="text-center w-full">
              <span className="block text-white font-bold text-base line-clamp-1 group-hover:underline mb-1">
                {item.name}
              </span>
              {isArtist && item.group && (
                <span className="block text-sm text-gray-400 line-clamp-1">
                  {item.group}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
