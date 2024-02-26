import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

const fetchData = async (url, token) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const useDataFetching = (url, token) => {
  return useQuery('data', () => fetchData(url, token));
};

export default useDataFetching;
