import React from 'react';
import { 
  Code,
  Palette,
  Brain,
  Shield,
  Smartphone,
  Globe,
  ArrowRight,
  CheckCircle,
  Cpu
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Inteligência Artificial',
      description: 'Soluções de IA e Machine Learning para automatizar e otimizar processos',
      features: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP'],
      price: 'A partir de R$ 5.000',
      color: 'blue',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Desenvolvimento Web',
      description: 'Aplicações web modernas e responsivas com tecnologias de ponta',
      features: ['React/Vue/Angular', 'Node.js', 'Progressive Web Apps', 'API REST'],
      price: 'A partir de R$ 3.000',
      color: 'purple',
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Desenvolvimento Mobile',
      description: 'Apps nativos e híbridos para iOS e Android com performance superior',
      features: ['React Native', 'Flutter', 'Swift/Kotlin', 'Cross-platform'],
      price: 'A partir de R$ 4.000',
      color: 'emerald',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Cybersecurity',
      description: 'Proteção avançada contra ameaças digitais e vulnerabilidades',
      features: ['Penetration Testing', 'Blockchain Security', 'Encryption', 'Monitoring'],
      price: 'A partir de R$ 6.000',
      color: 'red',
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: 'UX/UI Design',
      description: 'Design de experiência centrado no usuário com interfaces modernas',
      features: ['Design System', 'Prototipagem', 'User Research', 'Usability Testing'],
      price: 'A partir de R$ 2.500',
      color: 'orange',
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'DevOps & Cloud',
      description: 'Infraestrutura escalável e automação de deploy na nuvem',
      features: ['CI/CD', 'Docker/Kubernetes', 'AWS/Azure', 'Monitoring'],
      price: 'A partir de R$ 4.500',
      color: 'indigo',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700',
      purple: 'from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700',
      emerald: 'from-emerald-500 to-emerald-600 group-hover:from-emerald-600 group-hover:to-emerald-700',
      red: 'from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700',
      orange: 'from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700',
      indigo: 'from-indigo-500 to-indigo-600 group-hover:from-indigo-600 group-hover:to-indigo-700',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent mb-6">
            Serviços Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Serviços de desenvolvimento e consultoria tecnológica com foco em inovação 
            e performance de última geração
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
            >
              <div className="p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${getColorClasses(service.color)} text-white mb-6 transition-all duration-300`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {service.price}
                  </span>
                  <button className="group/btn inline-flex items-center space-x-2 text-blue-600 hover:text-purple-600 font-medium transition-colors">
                    <span>Saiba mais</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Cpu className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-4">
              Projeto Customizado?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Desenvolvemos soluções tecnológicas sob medida utilizando as mais 
              avançadas ferramentas e metodologias do mercado
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Solicitar Orçamento Tech</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;