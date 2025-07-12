import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../utils/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Get current user profile from token
  const getCurrentUser = async (token) => {
    try {
      const response = await fetch(`http://localhost:7000/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await handleApiError(response);

      // Since /current returns user profile data, we'll parse it
      const data = await response.json();
      console.log("curr ", data);

      return {
        email: data.data.email,
        name: data.data.fullName,
        role: data.data.role,
      };
    } catch (err) {
      throw new Error("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      const token = localStorage.getItem("token");
      if (token && isMounted) {
        try {
          setLoading(true);
          const userData = await getCurrentUser(token);

          // Set basic user data - you may need to adjust this based on your JWT payload
          setUser(userData ? true : false);
          setUserProfile(userData);
          setAuthError(null);
        } catch (err) {
          setAuthError(err.message || "Failed to load user session");
          localStorage.removeItem("token");
          setUser(null);
          setUserProfile(null);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to handle API errors
  const handleApiError = async (response) => {
    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    return response;
  };

  // Sign in function in AuthContext
  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      setLoading(true);

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

      // await handleApiError(response);

      const result = await response.json();

      console.log(result);

      if (!response.ok || !result.success) {
        setAuthError(result?.message || "Login failed");
        return { success: false, error: result?.message };
      }

      // Save token and user info to localStorage
      localStorage.setItem("token", result.data.token);

      const userData = await getCurrentUser(result.data.token);

      setUser(userData ? true : false);
      setUserProfile(userData);

      console.log(result.data);

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during login. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign in error:", error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  console.log(user);
  console.log(userProfile);

  // Sign up function
  const signUp = async (userData) => {
    try {
      setAuthError(null);
      setLoading(true);

      const signUpRequest = userData;

      const response = await fetch("http://localhost:7000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpRequest),
      });

      await handleApiError(response);

      const result = await response.json();
      console.log("Sign up result:", result);

      console.log(result.data);

      if (!response.ok || !result.success) {
        setAuthError(result?.message || "Signup failed");
        return { success: false, error: result?.message };
      }

      // Save token and user info to localStorage
      localStorage.setItem("token", result.data.token);

      const userProfile = await getCurrentUser(result.data.token);
      console.log(userProfile);

      setUser(userProfile ? true : false);
      setUserProfile(userProfile);

      console.log(user);

      return { success: true, data: userProfile };
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
      localStorage.removeItem("token");
      setUser(null);
      setUserProfile(null);
      console.log("User signed out successfully");
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
    getCurrentUser,
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
