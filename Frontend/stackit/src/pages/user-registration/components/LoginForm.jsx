import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const { signIn, loading: authLoading, authError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        // Redirect to dashboard on successful login
        if (result.data.role === "ADMIN" || result.data.role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/questions-dashboard");
        }
        toast.success("Welcome back! Login Successful");
      } else {
        throw new Error(result.error || "Login failed");
      }
      console.log(result);
    } catch (error) {
      toast.error(`Login Failed. ${error.message}`);
      // console.log('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8"
    >
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          disabled={isLoading || authLoading}
          icon="Mail"
        />

        <Input
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          error={errors.password}
          disabled={isLoading || authLoading}
          icon="Lock"
        />
      </div>

      {(authError || errors.submit) && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon
              name="AlertCircle"
              size={16}
              className="text-destructive flex-shrink-0"
            />
            <p className="text-sm text-destructive">
              {authError || errors.submit}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          fullWidth
          loading={isLoading || authLoading}
          disabled={!formData.email || !formData.password}
          iconName="LogIn"
          iconPosition="left"
          iconSize={16}
        >
          Sign In
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <span>Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
