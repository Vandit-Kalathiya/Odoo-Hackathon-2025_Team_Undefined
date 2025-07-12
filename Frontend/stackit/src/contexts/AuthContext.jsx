import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../utils/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(true);
  const [userProfile, setUserProfile] = useState({
    id: "1",
    username: "john_doe",
    name: "john doe",
    email: "john.doe@example.com",
    avatar: "https://example.com/avatar.jpg"
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setAuthError(null);

        const sessionResult = await authService.getSession();

        if (
          sessionResult?.success &&
          sessionResult?.data?.session?.user &&
          isMounted
        ) {
          const authUser = sessionResult.data.session.user;
          setUser(authUser);

          // Fetch user profile
          const profileResult = await authService.getUserProfile(authUser.id);

          if (profileResult?.success && isMounted) {
            setUserProfile(profileResult.data);
          } else if (isMounted) {
            setAuthError(profileResult?.error || "Failed to load user profile");
          }
        }
      } catch (error) {
        if (isMounted) {
          setAuthError("Failed to initialize authentication");
          console.log("Auth initialization error:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      setAuthError(null);

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);

        // Fetch user profile for signed in user
        authService.getUserProfile(session.user.id).then((profileResult) => {
          if (profileResult?.success && isMounted) {
            setUserProfile(profileResult.data);
          } else if (isMounted) {
            setAuthError(profileResult?.error || "Failed to load user profile");
          }
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserProfile(null);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

 // Sign in function in AuthContext
const signIn = async (email, password) => {
  try {
    setAuthError(null);

    const response = await fetch("http://localhost:7000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: email, // backend expects 'login', not 'email'
        password: password,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setAuthError(result?.message || "Login failed");
      return { success: false, error: result?.message };
    }

    // Save token and user info to localStorage
    localStorage.setItem("token", result.data.token);

    setUser(result.data)
    const user = result.data.username || result.data.email

    console.log(user)

    const profileResult = await authService.getUserProfile(user.id);
    if (profileResult?.success) {
      setUserProfile(profileResult.data);
    }

    return { success: true, data: result.data };
  } catch (error) {
    const errorMsg = "Something went wrong during login. Please try again.";
    setAuthError(errorMsg);
    console.log("Sign in error:", error);
    return { success: false, error: errorMsg };
  }
};


  // Sign up function
  const signUp = async (email, password, userData = {}) => {
  try {
    setAuthError(null);

    const response = await fetch("http://localhost:7000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username || email.split('@')[0], // default if not provided
        email,
        fullName: userData.fullName || "", // provide blank if not passed
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setAuthError(result?.message || "Signup failed");
      return { success: false, error: result?.message };
    }

    console.log(result.data)

    // Save token and user info to localStorage
    localStorage.setItem("token", result.data.token);

    setUser(result.data);
    const user = result.data.user || result.data;

    // Load and set profile
    const profileResult = await authService.getUserProfile(user.id);
    if (profileResult?.success) {
      setUserProfile(profileResult.data);
    }

    console.log(user)


    return { success: true, data: result.data };
  } catch (error) {
    const errorMsg = "Something went wrong during signup. Please try again.";
    setAuthError(errorMsg);
    console.log("Sign up error:", error);
    return { success: false, error: errorMsg };
  }
};


  // Sign out function
  const signOut = async () => {
    try {
      setAuthError(null);
      const result = await authService.signOut();

      if (!result?.success) {
        setAuthError(result?.error || "Logout failed");
        return { success: false, error: result?.error };
      }

      return { success: true };
    } catch (error) {
      const errorMsg = "Something went wrong during logout. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign out error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setAuthError(null);

      if (!user?.id) {
        const errorMsg = "User not authenticated";
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await authService.updateUserProfile(user.id, updates);

      if (!result?.success) {
        setAuthError(result?.error || "Profile update failed");
        return { success: false, error: result?.error };
      }

      setUserProfile(result.data);
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg =
        "Something went wrong updating profile. Please try again.";
      setAuthError(errorMsg);
      console.log("Update profile error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      const result = await authService.resetPassword(email);

      if (!result?.success) {
        setAuthError(result?.error || "Password reset failed");
        return { success: false, error: result?.error };
      }

      return { success: true };
    } catch (error) {
      const errorMsg =
        "Something went wrong sending reset email. Please try again.";
      setAuthError(errorMsg);
      console.log("Reset password error:", error);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    clearError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;