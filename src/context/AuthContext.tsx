import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  
  type User = {
    name: string;
    email: string;
  };
  
  type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  type AuthProviderProps = {
    children: ReactNode;
  };
  
  export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchUser = async () => {
            try {
              const token = localStorage.getItem("token");
          
              console.log("TOKEN:", token); // DEBUG
          
              if (!token) {
                setLoading(false);
                return;
              }
          
              const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
          
              const data = await res.json();
          
              console.log("ME RESPONSE:", data); // DEBUG
          
              if (!res.ok) {
                setUser(null);
                return;
              }
          
              // 🔥 SAFE MAPPING (IMPORTANT FIX)
              setUser({
                name: data.name ?? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
                email: data.email,
              });
          
            } catch (error) {
              console.error("Auth load error:", error);
              setUser(null);
            } finally {
              setLoading(false);
            }
          };
  
      fetchUser();
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuth must be used inside AuthProvider");
    }
  
    return context;
  };