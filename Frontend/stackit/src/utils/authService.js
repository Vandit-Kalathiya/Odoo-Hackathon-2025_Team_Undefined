import { use } from "react";
import { supabase } from "./supabase";
import { useAuth } from "contexts/AuthContext";

const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("AuthRetryableFetchError")
      ) {
        return {
          success: false,
          error:
            "Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.",
        };
      }
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  },

  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("AuthRetryableFetchError")
      ) {
        return {
          success: false,
          error:
            "Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.",
        };
      }
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  },

  // Get current session
  getSession: async () => {
    const token = localStorage.getItem("token")
    if (token) {
      return {
        success: true,
        data: {
          session: {
            token,
            user: JSON.parse(user),
          },
        },
      };
    }
    return { success: false, error: "No session found" };
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("NetworkError") ||
        (error?.name === "TypeError" && error?.message?.includes("fetch"))
      ) {
        return {
          success: false,
          error:
            "Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.",
        };
      }
      return { success: false, error: "Failed to load user profile" };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("NetworkError") ||
        (error?.name === "TypeError" && error?.message?.includes("fetch"))
      ) {
        return {
          success: false,
          error:
            "Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.",
        };
      }
      return { success: false, error: "Failed to update profile" };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("AuthRetryableFetchError")
      ) {
        return {
          success: false,
          error:
            "Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.",
        };
      }
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;
