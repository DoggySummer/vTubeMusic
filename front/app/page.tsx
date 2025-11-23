import Carousel from "./components/carousel/Carousel";

export default function Home() {
  const baseVtubers = [
    {
      id: "1",
      name: "Isegyebut",
      imageUrl: "/isedol.webp",
      platform: "Twitch",
      group: "Waktverse",
    },
    {
      id: "2",
      name: "Stellive",
      imageUrl: "/stellive.svg",
      platform: "Twitch",
      group: "Stellive",
    },
    {
      id: "3",
      name: "Plave",
      imageUrl: "/pjx.webp",
      platform: "YouTube",
      group: "VLAST",
    },
    {
      id: "4",
      name: "QWER",
      imageUrl: "/bluejump.webp",
      platform: "YouTube",
      group: "Tamago Production",
    },
    {
      id: "5",
      name: "HoneyZ",
      imageUrl: "/honeyz.webp",
      platform: "AfreecaTV",
      group: "AfreecaTV",
    },
    {
      id: "6",
      name: "V-Lyz",
      imageUrl: "/vlyz.webp",
      platform: "AfreecaTV",
      group: "AfreecaTV",
    },
    {
      id: "7",
      name: "Acaxia",
      imageUrl: "/acaxia.webp",
      platform: "Twitch",
      group: "Acaxia",
    },
    {
      id: "8",
      name: "Aesther",
      imageUrl: "/aesther.webp",
      platform: "YouTube",
      group: "Aesther",
    },
  ];

  // 리스트를 2배로 늘림 (ID 충돌 방지 위해 suffix 추가)
  const vtubers = [
    ...baseVtubers,
    ...baseVtubers.map((v) => ({ ...v, id: `${v.id}_duplicate` })),
  ];

  return (
    <>
      {/* 상단 그라데이션 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-[#3b3b3b] to-[#121212] -z-10" />

      <div className="container mx-auto px-4 py-6 min-h-full">
        <section className="my-4">
          <Carousel title="인기 아티스트" isArtist={true} items={vtubers} />
        </section>
        <section className="my-4">
          <Carousel title="인기 그룹" isArtist={false} items={vtubers} />
        </section>
      </div>
    </>
  );
}
