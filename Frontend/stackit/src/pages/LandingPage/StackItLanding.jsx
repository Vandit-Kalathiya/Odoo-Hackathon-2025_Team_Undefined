import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  MessageCircle,
  Users,
  Award,
  Bell,
  Shield,
  ArrowRight,
  Menu,
  X,
  Star,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

const StackItLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Rich Question Editor",
      description:
        "Create detailed questions with formatting, images, and code snippets",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Connect with experts and learners in your field",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Smart Voting",
      description: "Upvote quality answers and build reputation",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Real-time Notifications",
      description: "Stay updated on answers and mentions instantly",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Content Moderation",
      description: "Maintain quality with advanced moderation tools",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Tag System",
      description: "Organize and discover content with smart tagging",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Questions Asked",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      number: "25K+",
      label: "Answers Provided",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      number: "5K+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">StackIt</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              {["Features", "How It Works", "Roles", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {!loading && !user && (
                <>
                  <button
                    onClick={() => navigate("/user-registration")}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigate("/user-registration")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {["Features", "How It Works", "Roles", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-2xl text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col space-y-4">
              <button className="text-xl text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Log In
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-xl">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Knowledge Sharing
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Made Beautiful
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the most elegant Q&A platform where learning meets community.
              Ask questions, share knowledge, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() =>
                  (window.location.href = user
                    ? "/questions-dashboard"
                    : "/user-registration")
                }
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Get Started Free
                <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </button>

              {/* <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, share, and discover knowledge in
              one beautiful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  activeFeature === index ? "ring-2 ring-blue-500" : ""
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is simple. Follow these steps to join our
              community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your free account in seconds",
              },
              {
                step: "2",
                title: "Ask Questions",
                description: "Post detailed questions with our rich editor",
              },
              {
                step: "3",
                title: "Get Answers",
                description: "Receive expert answers from the community",
              },
              {
                step: "4",
                title: "Share Knowledge",
                description: "Help others by answering their questions",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto group-hover:scale-110 transition-transform duration-200">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-8 left-16 w-full h-0.5 bg-gray-200">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of learners and experts already sharing knowledge on
            StackIt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
              Create Free Account
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">StackIt</span>
              </div>
              <p className="text-gray-400">
                The most beautiful Q&A platform for collaborative learning.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: ["Features", "How It Works", "Pricing", "API"],
              },
              {
                title: "Community",
                links: [
                  "Guidelines",
                  "Code of Conduct",
                  "Help Center",
                  "Contact",
                ],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Privacy", "Terms"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 StackIt. All rights reserved. Built with ❤️ for the
              community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StackItLanding;
