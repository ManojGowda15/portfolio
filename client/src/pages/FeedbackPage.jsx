import React from 'react';
import Header from '../components/Header';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';

const FeedbackPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <div className="pt-20">
        <Feedback />
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackPage;

