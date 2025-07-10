import React from 'react';
import { ArrowRight, Star, Users, Award, Zap, Code, Cpu } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="border border-cyan-400/20 rounded animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Inovação Tecnológica em Primeiro Lugar</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Conecte-se ao Futuro com o
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              {' '}techHUB{' '}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Sua plataforma completa para produtos e serviços tecnológicos de vanguarda. 
            Transforme ideias em realidade digital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="flex items-center justify-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Explorar Tecnologias</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-medium border-2 border-white/20 hover:bg-white/20 transition-all duration-200">
              <span className="flex items-center justify-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>Solicitar Demo</span>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-cyan-400 mb-2">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-gray-300">Clientes Conectados</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-purple-400 mb-2">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-white">4.9</div>
              <div className="text-gray-300">Rating de Inovação</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-blue-400 mb-2">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-white">15+</div>
              <div className="text-gray-300">Anos de Inovação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;