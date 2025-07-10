import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Filter, Cpu, Smartphone, Globe, Palette, Brain, Shield, Star } from 'lucide-react';

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
      description: 'Plataforma de análise inteligente com IA avançada para insights em tempo real',
      featured: true,
      tech: ['Python', 'TensorFlow', 'React'],
      longDescription: 'Nossa plataforma de IA Analytics revoluciona a forma como você analisa dados. Com algoritmos de machine learning de última geração, oferece insights preditivos e análises em tempo real que transformam dados brutos em decisões estratégicas.',
    },
    {
      id: 2,
      name: 'Progressive Web App',
      category: 'web',
      price: 'R$ 599,90',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      description: 'Aplicação web progressiva de alta performance com experiência nativa',
      featured: true,
      tech: ['React', 'TypeScript', 'PWA'],
      longDescription: 'Desenvolvemos PWAs que combinam o melhor dos mundos web e mobile. Com performance nativa, funcionalidade offline e instalação direta no dispositivo, oferecemos uma experiência de usuário excepcional.',
    },
    {
      id: 3,
      name: 'Native Mobile App',
      category: 'mobile',
      price: 'R$ 1299,90',
      image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      description: 'App nativo multiplataforma de última geração com performance otimizada',
      featured: false,
      tech: ['React Native', 'Node.js', 'MongoDB'],
      longDescription: 'Aplicativos móveis nativos que funcionam perfeitamente em iOS e Android. Utilizamos as mais modernas tecnologias para garantir performance superior e experiência de usuário fluida.',
    },
    {
      id: 4,
      name: 'Design System Pro',
      category: 'design',
      price: 'R$ 449,90',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      description: 'Sistema de design completo e escalável para equipes modernas',
      featured: false,
      tech: ['Figma', 'Storybook', 'CSS-in-JS'],
      longDescription: 'Um sistema de design robusto que acelera o desenvolvimento e garante consistência visual. Inclui componentes reutilizáveis, tokens de design e documentação completa.',
    },
    {
      id: 5,
      name: 'Cybersecurity Suite',
      category: 'security',
      price: 'R$ 1599,90',
      image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      description: 'Suite completa de segurança cibernética com proteção avançada',
      featured: true,
      tech: ['Blockchain', 'Encryption', 'AI Security'],
      longDescription: 'Proteção completa contra ameaças digitais com tecnologia de ponta. Inclui detecção de intrusão, criptografia avançada e monitoramento em tempo real.',
    },
    {
      id: 6,
      name: 'Smart Dashboard',
      category: 'ai',
      price: 'R$ 699,90',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      description: 'Dashboard inteligente com insights em tempo real e visualizações avançadas',
      featured: false,
      tech: ['Vue.js', 'D3.js', 'Machine Learning'],
      longDescription: 'Dashboard inteligente que transforma dados complexos em visualizações claras e acionáveis. Com IA integrada para insights automáticos e alertas preditivos.',
    },
    {
      id: 7,
      name: 'E-commerce Platform',
      category: 'web',
      price: 'R$ 999,90',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      description: 'Plataforma de e-commerce completa com recursos avançados',
      featured: false,
      tech: ['Next.js', 'Stripe', 'PostgreSQL'],
      longDescription: 'Solução completa de e-commerce com gestão de produtos, pagamentos seguros, analytics avançados e experiência de compra otimizada.',
    },
    {
      id: 8,
      name: 'IoT Management System',
      category: 'ai',
      price: 'R$ 1899,90',
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      description: 'Sistema de gerenciamento IoT com IA para automação inteligente',
      featured: true,
      tech: ['Python', 'MQTT', 'TensorFlow'],
      longDescription: 'Gerencie dispositivos IoT com inteligência artificial. Automação inteligente, monitoramento em tempo real e análise preditiva para otimização de recursos.',
    },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Produtos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Tecnológicos</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Soluções tecnológicas de vanguarda desenvolvidas com as mais modernas 
            ferramentas e frameworks do mercado
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 text-gray-600 mb-4 w-full justify-center">
              <Cpu className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Filtrar por categoria:</span>
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
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  
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
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{product.price}</span>
                    <div className="flex space-x-2">
                      <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>Carregar Mais Produtos</span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;