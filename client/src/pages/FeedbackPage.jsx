import React from 'react';
import Header from '../components/Header';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';

const FeedbackPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-blue-50">
      <Header />
      <main className="pt-20">
        <Feedback />
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackPage;

