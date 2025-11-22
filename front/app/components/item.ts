export interface GroupItem {
  id: string;
  name: string;
  image: string;
  platform: string;
}

export const groups: GroupItem[] = [
  { id: "acaxia", name: "아카시아", image: "/acaxia.webp", platform: "1" },
  { id: "aesther", name: "에스더", image: "/aesther.webp", platform: "2" },
  { id: "bluejump", name: "블루점프", image: "/bluejump.webp", platform: "3" },
  { id: "honeyz", name: "허니즈", image: "/honeyz.webp", platform: "1" },
  { id: "isedol", name: "이세돌", image: "/isedol.webp", platform: "2" },
  { id: "meechu", name: "미츄", image: "/meechu.png", platform: "3" },
  { id: "pjx", name: "PJX", image: "/pjx.webp", platform: "1" },
  { id: "vlyz", name: "VLYZ", image: "/vlyz.webp", platform: "2" },
  { id: "stellive", name: "스텔라이브", image: "/stellive.svg", platform: "3" },
];
