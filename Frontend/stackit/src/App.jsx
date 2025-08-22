import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "contexts/AppProvider";
import { Toaster } from "react-hot-toast";
import "./utils/init";
import { QuestionProvider } from "contexts/QuestionContext";
import { NotificationProvider } from "contexts/NotificationContext";
import { AnswerProvider } from "contexts/AnswerContext";
import { ApiConfigProvider } from "contexts/ApiConfig";

function App() {
  return (
    <AuthProvider>
      <ApiConfigProvider>
        <NotificationProvider>
          <QuestionProvider>
            <AnswerProvider>
              <AppProvider>
                <Toaster
                  position="bottom-right"
                  toastOptions={{ duration: 5000 }}
                />
                <Routes />
              </AppProvider>
            </AnswerProvider>
          </QuestionProvider>
        </NotificationProvider>
      </ApiConfigProvider>
    </AuthProvider>
  );
}

export default App;
