import { useQuery } from '@tanstack/react-query';
import supabase from '../supabase/supabase';
import Swal from 'sweetalert2';

const useDetailMap = (id) => {
  // 해당 식당 주소, 이름, 설명을 가져온다.
  const getRestorantAddress = async (restaurantId) => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('name, address, description')
      .eq('id', restaurantId)
      .single();

    if (error) {
      Swal.fire({
        icon: 'error',
        title: '데이터를 가져오는데 실패했습니다..',
        text: '잠시 후 다시 시도해 주세요.'
      });

      return;
    }

    return data;
  };

  const {
    data: mapData,
    isPending,
    isError
  } = useQuery({
    queryKey: ['map', id],
    queryFn: () => getRestorantAddress(id)
  });

  return { mapData, isPending, isError };
};

export default useDetailMap;
