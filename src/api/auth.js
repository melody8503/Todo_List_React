import axios from 'axios';

const authURL = 'https://todo-list.alphacamp.io/api/auth';

export const login = async ({ username, password }) => {
  try {
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    });

    const { authToken } = data;

    // 若後端認證成功，會回傳authToken和登入使用者資料
    if (authToken) {
      // success屬性來判斷是否登入成功
      return { success: true, ...data };
    }

    return data;
  } catch (error) {
    console.error('[Login Failed]:', error);
  }
};
