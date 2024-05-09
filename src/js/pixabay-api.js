export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '43791514-0c71581f0b67d4acc8f65b528';

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
