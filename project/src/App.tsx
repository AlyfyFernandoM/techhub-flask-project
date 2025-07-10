import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import About from './components/About';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <Products />
        <Services />
        <About />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;