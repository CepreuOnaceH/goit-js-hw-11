import axios from 'axios';

const API_KEY = '38934946-e5c499d2b8363eeb7af4782b0';

export async function searchImages(query, page, perPage) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: perPage,
      },
    });

    return response.data.hits;
  } catch (error) {
    console.error(error);
    return [];
  }
}
