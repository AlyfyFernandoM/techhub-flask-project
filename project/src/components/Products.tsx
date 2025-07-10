import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Filter, Cpu, Smartphone, Globe, Palette, Brain, Shield } from 'lucide-react';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos os Produtos' },
    { id: 'ai', name: 'IA & Machine Learning', icon: <Brain className="h-4 w-4" /> },
    { id: 'web', name: 'Desenvolvimento Web', icon: <Globe className="h-4 w-4" /> },
    { id: 'mobile', name: 'Apps Mobile', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'design', name: 'Design & UX', icon: <Palette className="h-4 w-4" /> },
    { id: 'security', name: 'Segurança', icon: <Shield className="h-4 w-4" /> },
  ];

  const products = [
    {
      id: 1,
      name: 'AI Analytics Platform',
      category: 'ai',
      price: 'R$ 899,90',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      description: 'Plataforma de análise inteligente com IA avançada',
      featured: true,
      tech: ['Python', 'TensorFlow', 'React'],
    },
    {
      id: 2,
      name: 'Progressive Web App',
      category: 'web',
      price: 'R$ 599,90',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      description: 'Aplicação web progressiva de alta performance',
      featured: true,
      tech: ['React', 'TypeScript', 'PWA'],
    },
    {
      id: 3,
      name: 'Native Mobile App',
      category: 'mobile',
      price: 'R$ 1299,90',
      image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      description: 'App nativo multiplataforma de última geração',
      featured: false,
      tech: ['React Native', 'Node.js', 'MongoDB'],
    },
    {
      id: 4,
      name: 'Design System Pro',
      category: 'design',
      price: 'R$ 449,90',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      description: 'Sistema de design completo e escalável',
      featured: false,
      tech: ['Figma', 'Storybook', 'CSS-in-JS'],
    },
    {
      id: 5,
      name: 'Cybersecurity Suite',
      category: 'security',
      price: 'R$ 1599,90',
      image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      description: 'Suite completa de segurança cibernética',
      featured: true,
      tech: ['Blockchain', 'Encryption', 'AI Security'],
    },
    {
      id: 6,
      name: 'Smart Dashboard',
      category: 'ai',
      price: 'R$ 699,90',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      description: 'Dashboard inteligente com insights em tempo real',
      featured: false,
      tech: ['Vue.js', 'D3.js', 'Machine Learning'],
    },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-6">
            Produtos Tecnológicos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções tecnológicas de vanguarda desenvolvidas com as mais modernas 
            ferramentas e frameworks do mercado
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 text-gray-600 mb-4 w-full justify-center">
            <Cpu className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Filtrar por:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              } flex items-center space-x-2`}
            >
              {category.icon && <span>{category.icon}</span>}
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Destaque
                  </div>
                )}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-full border border-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{product.price}</span>
                  <div className="flex space-x-2">
                    <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span className="flex items-center space-x-2">
              <Cpu className="h-5 w-5" />
              <span>Explorar Mais Tecnologias</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;