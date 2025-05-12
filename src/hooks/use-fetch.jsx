// hooks/use-fetch.js
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const useFetch = (cb, options = {}) => {
  const { getToken } = useAuth();
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken({ template: "supabase" });
      console.log("Fetched Clerk Token:", token); // Debug token
      if (!token) throw new Error("No valid token available");
      const response = await cb(token, { ...options, ...args[0] }); // Merge options and args
      setData(response);
    } catch (err) {
      setError(err);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cb, JSON.stringify(options)]); // Use JSON.stringify for object dependencies

  return { data, loading, error, fn: fetchData };
};

export default useFetch;
