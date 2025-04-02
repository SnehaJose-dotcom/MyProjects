// "use client";
// import { createContext, useState, useEffect, useContext } from "react";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext<any>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [user, setUser] = useState(null);
//     const router = useRouter();

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const res = await fetch("/api/user/profile", { credentials: "include" });
//                 if (res.ok) {
//                     const data = await res.json();
//                     console.log("User data received:", data);
//                     setUser(data);
//                 } else {
//                     setUser(null);
//                 }
//             } catch (error) {
//                 console.error("Auth check error:", error);
//                 setUser(null);
//             }
//         };
//         checkAuth();
//     }, []);


//     const login = async (email: string, password: string) => {
//       const res = await fetch("/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       });
    
//       if (res.ok) {
//         const profileRes = await fetch("/api/user/profile", {
//           credentials: "include",
//         });
    
//         if (profileRes.ok) {
//           const user = await profileRes.json();
//           setUser(user);
//           router.push("/profile");
//         }
//       } else {
//         const errorData = await res.json();
//         console.error("Login failed:", errorData);
//       }
//     };

//     const logout = async () => {
//         await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
//         setUser(null);
//         router.push("/signin");
//     };

//     return <AuthContext.Provider value={{ user, login,  logout }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/profile", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          console.log("User data received:", data);
          setUser({ ...data, userId: data._id }); 
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      const profileRes = await fetch("/api/user/profile", {
        credentials: "include",
      });

      if (profileRes.ok) {
        const user = await profileRes.json();
        setUser({ ...user, userId: user._id }); 
        router.push("/profile");
      }
    } else {
      const errorData = await res.json();
      console.error("Login failed:", errorData);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/signin");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
