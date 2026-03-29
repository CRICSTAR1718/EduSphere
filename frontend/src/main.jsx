import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NoticeProvider } from "./context/NoticeContext";
import { EventProvider } from "./context/EventContext";
import { TimetableProvider } from "./context/TimetableContext";
import { CourseProvider } from "./context/CourseContext";
import { FeedbackProvider } from "./context/FeedbackContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <AuthProvider>
        <NoticeProvider>
          <EventProvider>
            <TimetableProvider>
              <CourseProvider>
                <FeedbackProvider>
                  <ThemeProvider>
                    <App />
                  </ThemeProvider>
                </FeedbackProvider>
              </CourseProvider>
            </TimetableProvider>
          </EventProvider>
        </NoticeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}