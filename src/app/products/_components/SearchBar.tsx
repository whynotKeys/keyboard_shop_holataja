import Input from '@/components/ui/Input';

export default function SearchBar({ searchValue, setSearchValue }: { searchValue: string; setSearchValue: (value: string) => void }) {
  return (
    <div className="w-full flex flex-row">
      <div className="w-full sm:w-80 ml-auto">
        <label htmlFor="search" className="sr-only">
          상품 검색
        </label>
        <Input
          id="search"
          name="search"
          type="text"
          placeholder="검색어를 입력해주세요."
          size="small"
          className="pl-10 pr-3 py-1.5 mb-3 !bg-accent outline-transparent focus:outline-primary focus:ring-0
    bg-[url('/icon/search.svg')] bg-no-repeat bg-[length:1rem_1rem] bg-[position:1rem_center] placeholder:text-[14px]"
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}
