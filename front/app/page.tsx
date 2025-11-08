import Filter from "./components/Filter";
import FilterRow from "./components/FilterRow";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <Filter />
        <div className="flex-1">
          <FilterRow />
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">음악 사이트에 오신 것을 환영합니다</h2>
            <p className="text-gray-400">콘텐츠를 추가해주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
