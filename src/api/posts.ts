const baseUrl = 'https://jsonplaceholder.typicode.com';

export const fetchPosts = async (page = 1, limit = 20) => {
    const response = await fetch(`${baseUrl}/posts?_page=${page}&_limit=${limit}`);
    const data = await response.json();
    return data;
}