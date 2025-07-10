import React from 'react';
import { Target, Users, Award, TrendingUp, Star, Quote, Cpu, Code, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '500+', label: 'Clientes Atendidos' },
    { icon: <Award className="h-6 w-6" />, value: '150+', label: 'Projetos Concluídos' },
    { icon: <TrendingUp className="h-6 w-6" />, value: '98%', label: 'Taxa de Satisfação' },
    { icon: <Star className="h-6 w-6" />, value: '15+', label: 'Anos de Experiência' },
  ];

  const testimonials = [
    {
      name: 'Carlos Mendes',
      role: 'CTO, StartupTech',
      content: 'O techHUB revolucionou nossa infraestrutura tecnológica. Soluções de IA que realmente funcionam!',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'Ana Rodriguez',
      role: 'Head of Engineering, DevCorp',
      content: 'Expertise técnica incomparável. O time do techHUB domina as tecnologias mais avançadas do mercado.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'Roberto Silva',
      role: 'Tech Lead, InnovateLab',
      content: 'Transformação digital real. O techHUB entrega soluções que realmente impactam o negócio.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  const values = [
    {
      icon: <Cpu className="h-8 w-8" />,
      title: 'Inovação Tecnológica',
      description: 'Utilizamos as mais avançadas tecnologias e frameworks para criar soluções de ponta.',
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'Código de Qualidade',
      description: 'Desenvolvemos com as melhores práticas, testes automatizados e arquitetura escalável.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Performance',
      description: 'Otimização constante para entregar soluções rápidas, eficientes e confiáveis.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-6">
            Sobre o techHUB
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos especialistas em tecnologias emergentes, desenvolvendo soluções 
            que conectam o presente ao futuro digital
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Conectando Você ao Futuro
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Há mais de 15 anos desenvolvendo tecnologias de ponta, o techHUB é 
              referência em inovação digital, inteligência artificial e desenvolvimento 
              de software de alta performance.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nossa equipe de engenheiros e cientistas de dados trabalha com as 
              tecnologias mais avançadas do mercado, desde Machine Learning até 
              arquiteturas de microserviços na nuvem.
            </p>
            
            {/* Values */}
            <div className="space-y-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 p-2 rounded-lg">
                    {value.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Equipe techHUB"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="text-blue-600 flex justify-center mb-3 transform hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
              Depoimentos de Tech Leaders
            </h3>
            <p className="text-lg text-gray-600">
              Feedback de CTOs e engenheiros que revolucionaram suas empresas com nossas soluções
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-blue-600 mx-auto mb-4 transform hover:scale-110 transition-transform" />
                  <p className="text-gray-600 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;