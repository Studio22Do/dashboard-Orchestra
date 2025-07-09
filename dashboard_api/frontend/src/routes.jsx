import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import PRLabsDashboard from './pages/PRLabs/Dashboard';
import PRLabsChat from './pages/PRLabs/Chat';
import PRLabsImage from './pages/PRLabs/Image';
import PRLabsText from './pages/PRLabs/Text';
import PRLabsVoice from './pages/PRLabs/Voice';
import PRLabsChatbot from './pages/PRLabs/Chatbot';
import PRLabsTools from './pages/PRLabs/Tools';
import Dashboard from './pages/Dashboard/Dashboard';
import OpenAITextToSpeech from './pages/OpenAITextToSpeech/OpenAITextToSpeech';
import GoogleReviewLink from './pages/GoogleReviewLink/GoogleReviewLink';
import GoogleNews from './pages/GoogleNews/GoogleNews';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="openai-tts" element={<OpenAITextToSpeech />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* PR Labs Routes */}
                <Route path="/prlabs" element={<PRLabsDashboard />} />
                <Route path="/prlabs/chat" element={<PRLabsChat />} />
                <Route path="/prlabs/image" element={<PRLabsImage />} />
                <Route path="/prlabs/text" element={<PRLabsText />} />
                <Route path="/prlabs/voice" element={<PRLabsVoice />} />
                <Route path="/prlabs/chatbot" element={<PRLabsChatbot />} />
                <Route path="/prlabs/tools" element={<PRLabsTools />} />

                <Route path="/apps/google-review-link" element={<GoogleReviewLink />} />
                <Route path="/apps/google-news" element={<GoogleNews />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes; 