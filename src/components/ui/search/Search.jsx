import { useQuery } from '@tanstack/react-query';
import SearchMap from '../../features/SearchMap';
import supabase from '../../../supabase/supabase';
import { useRef, useState } from 'react';
import SearchList from './SearchList';
import SearchButtons from './SearchButtons';

const Search = () => {
  const [colorFilter, setColorFilter] = useState('all');
  const [restaurant, setRestaurant] = useState('');
  const inputRef = useRef(null);
  console.log(restaurant);

  const fetchRestaurantData = async () => {
    const { data } = await supabase.from('restaurants').select('*');
    return data;
  };

  const {
    data: restaurants,
    isPending,
    error
  } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurantData
  });

  if (isPending) return <div>로딩 중...</div>;
  if (error) {
    console.error(error);
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  // 버튼 클릭에 따라 컬러 필터 상태(카테고리별 매장 필터링) + 선택된 버튼 상태 변경(선택 버튼 이펙트)
  const handleColorType = (e) => {
    const selectedValue = e.target.value;
    setColorFilter(selectedValue);
  };

  // 상태에 따라 다르게 필터를 돌려 레스토랑 데이터 뽑기
  const filterdRestaurants = () => {
    switch (colorFilter) {
      case 'all':
        return restaurants;
      case 'black':
        return restaurants.filter((restaurant) => restaurant.color === 'black');
      case 'white':
        return restaurants.filter((restaurant) => restaurant.color === 'white');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setRestaurant(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <div className="bg-[#0E0E0E] h-screen">
      <div className="max-w-[1440px] w-full h-full p-[40px] m-auto flex flex-row gap-[40px]">
        <div className="max-w-[520px] bg-[#F9F9F9] border rounded-[24px] h-full p-[20px] flex flex-col">
          <SearchButtons handleColorType={handleColorType} colorFilter={colorFilter} />
          <form
            onSubmit={handleSearch}
            className="w-[480px] h-[40px] p-3 border border-[3px] border-[#3396FF] rounded-[10px] bg-white mt-3 drop-shadow-md flex items-center justify-around"
          >
            <input ref={inputRef} type="text" className="w-10/12 outline-none" />
            <button className="bg-search-icon w-[24px] h-[24px]"></button>
          </form>
          <ul className="mt-[20px] flex flex-col gap-[20px] overflow-auto">
            {filterdRestaurants().map((restaurant) => {
              return <SearchList key={restaurant.id} restaurant={restaurant} />;
            })}
          </ul>
        </div>
        <div className="max-w-[794px] w-[794px] bg-[#F9F9F9] h-full rounded-[24px]">
          <SearchMap />
        </div>
      </div>
    </div>
  );
};

export default Search;
