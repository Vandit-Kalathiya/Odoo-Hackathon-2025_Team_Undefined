import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import questionService from "../../utils/questionService";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";
import QuestionTitleInput from "./components/QuestionTitleInput";
import RichTextEditor from "./components/RichTextEditor";
import TagSelector from "./components/TagSelector";
import PostingGuidelines from "./components/PostingGuidelines";
import RelatedQuestions from "./components/RelatedQuestions";
import DraftManager from "./components/DraftManager";
import { useQuestions } from "contexts/QuestionContext";

const AskQuestion = () => {
  const location = useLocation();
  const { user, loading: authLoading, userProfile, getCurrentUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(userProfile || user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { createQuestion } = useQuestions();

  const navigate = useNavigate();
  // const [user, setUser] = useState('');
  console.log(userProfile)
  const token = localStorage.getItem('token')
  
  // Check if user is authenticated
  useEffect( async () => {
    const newUser = await getCurrentUser(token);
    // setUser(newUser)
    console.log(newUser)
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (token && !currentUser) {
          const newUser = await getCurrentUser(token);
          setCurrentUser(newUser);
          console.log(newUser);
        } else if (userProfile || user) {
          setCurrentUser(userProfile || user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [location, token, userProfile, user, getCurrentUser, currentUser]);

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Question title is required";
    } else if (title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    } else if (title.trim().length > 150) {
      newErrors.title = "Title must be less than 150 characters";
    }

    if (
      !content.trim() ||
      content.trim() === "<p></p>" ||
      content.trim() === "<br>"
    ) {
      newErrors.content = "Question details are required";
    } else if (content.trim().length < 30) {
      newErrors.content =
        "Question details must be at least 30 characters long";
    }

    if (selectedTags.length === 0) {
      newErrors.tags = "At least one tag is required";
    } else if (selectedTags.length > 5) {
      newErrors.tags = "Maximum 5 tags allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Use currentUser state instead of userProfile directly
    if (!currentUser?.email && !currentUser?.id) {
      setErrors({ submit: "You must be logged in to post a question" });
      return;
    }

    setIsSubmitting(true);

    try {
      const questionData = {
        userId: currentUser.id,
        title: title.trim(),
        description: content.trim(),
        tags: selectedTags,
      };

      const result = await createQuestion(questionData);
      console.log("Question created:", result);

      if (result) {
        // Clear draft after successful submission
        localStorage.removeItem("ask_question_draft");

        // Redirect to the new question page
        navigate(`/question-detail-answers?id=${result.id}`);
      } else {
        setErrors({
          submit: result?.error || "Failed to post question. Please try again.",
        });
      }
    } catch (error) {
      console.log("Error posting question:", error);
      setErrors({ submit: "Failed to post question. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title || content || selectedTags.length > 0) {
      setShowCancelDialog(true);
    } else {
      navigate("/questions-dashboard");
    }
  };

  const confirmCancel = (saveDraft = false) => {
    if (saveDraft) {
      const draft = {
        title,
        content,
        tags: selectedTags,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("ask_question_draft", JSON.stringify(draft));
    }
    navigate("/questions-dashboard");
  };

  const handleLoadDraft = (draft) => {
    setTitle(draft.title || "");
    setContent(draft.content || "");
    setSelectedTags(draft.tags || []);
    setErrors({});
  };

  const hasContent = title || content || selectedTags.length > 0;

  // Show loading state during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect message for unauthenticated users
  console.log(currentUser);
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Sign In Required
            </h2>
            <p className="text-muted-foreground">
              You need to sign in to ask a question.
            </p>
            <Button onClick={() => navigate("/user-registration")}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button
                onClick={() => navigate("/questions-dashboard")}
                className="hover:text-foreground transition-colors"
              >
                Questions
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Ask Question</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Ask a Question
            </h1>
            <p className="text-muted-foreground mt-2">
              Get help from the community by asking a clear, detailed question
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Draft Manager */}
              <DraftManager
                title={title}
                content={content}
                tags={selectedTags}
                onLoadDraft={handleLoadDraft}
              />

              {/* Question Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <QuestionTitleInput
                    title={title}
                    onChange={setTitle}
                    error={errors.title}
                  />
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    error={errors.content}
                  />
                </div>

                <div className="bg-card border rounded-lg p-6">
                  <TagSelector
                    selectedTags={selectedTags}
                    onChange={setSelectedTags}
                    error={errors.tags}
                  />
                </div>

                {/* Form Actions */}
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        loading={isSubmitting}
                        disabled={!hasContent}
                        iconName="Send"
                        iconPosition="left"
                        iconSize={16}
                        className="sm:min-w-[140px]"
                      >
                        {isSubmitting ? "Posting..." : "Post Question"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        iconName="X"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Users" size={16} />
                      <span>
                        Your question will be visible to all community members
                      </span>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">
                        {errors.submit}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <PostingGuidelines />
              <RelatedQuestions questionTitle={title} />
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-popover border rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-start space-x-3 mb-4">
              <Icon
                name="AlertTriangle"
                size={20}
                className="text-warning mt-0.5 flex-shrink-0"
              />
              <div>
                <h3 className="text-lg font-semibold text-popover-foreground">
                  Discard changes?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You have unsaved changes. What would you like to do?
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => confirmCancel(true)}
                iconName="Save"
                iconPosition="left"
                iconSize={16}
              >
                Save as draft and leave
              </Button>
              <Button
                variant="outline"
                onClick={() => confirmCancel(false)}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Discard and leave
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCancelDialog(false)}
              >
                Continue editing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
