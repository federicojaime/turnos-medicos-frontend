import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || 'Error en la solicitud');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => execute();

  useEffect(() => {
    if (apiFunction && dependencies) {
      execute();
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  };
}