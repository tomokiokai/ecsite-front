"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/cookies`, {
          withCredentials: true,
        });

        if (response.status !== 200) {
          console.error('Response not OK:', response.status);
          return;
        }

        const cookieMap = response.data;
        const userInfoEncoded = cookieMap.userInfo;
        if (!userInfoEncoded) {
          console.log('No userInfo cookie found');
          return;
        }

        const userInfoDecoded = decodeURIComponent(userInfoEncoded);
        const userInfo = JSON.parse(userInfoDecoded);
        setUserInfo(userInfo);
      } catch (error) {
        console.error('Error fetching or parsing userInfo:', error);
      }
    }

    fetchUserInfo();
  }, []);

  return userInfo;
};
