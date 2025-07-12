import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UserRegistration from "pages/user-registration";
import QuestionsDashboard from "pages/questions-dashboard";
import QuestionDetailAnswers from "pages/question-detail-answers";
import UserProfile from "pages/user-profile";
import AskQuestion from "pages/ask-question";
import AdminDashboard from "pages/admin-dashboard";
import NotFound from "pages/NotFound";
import StackItLanding from "pages/LandingPage/StackItLanding";

const Routes = () => {
  return (
    <BrowserRouter>
      {/* <ErrorBoundary> */}
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<StackItLanding />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/questions-dashboard" element={<QuestionsDashboard />} />
        <Route path="/question-detail-answers" element={<QuestionDetailAnswers />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/ask-question" element={<AskQuestion />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </RouterRoutes>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  );
};

export default Routes;