export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '43679762-df4b6b87cc26b153d88f51051';

export const options = {
  params: {
    key: API_KEY,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};
