import { useState, useEffect } from 'react';

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T = unknown>(url: string, options?: RequestInit): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setData(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
