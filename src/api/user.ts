export const getMe = async () => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!res.ok) throw new Error("Failed to fetch user");
  
    return res.json();
  };