import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Building,
  User,
  Cpu
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    accountType: 'individual' as 'individual' | 'company',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      accountType: 'individual',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Telefone',
      details: ['(11) 99999-9999', '(11) 3333-4444'],
      color: 'blue',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      details: ['contato@techhub.com', 'vendas@techhub.com'],
      color: 'purple',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Endereço',
      details: ['Tech Park, 2000', 'São Paulo, SP - 01234-567'],
      color: 'emerald',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Horário',
      details: ['Segunda à Sexta: 9h às 18h', 'Sábado: 9h às 12h'],
      color: 'orange',
    },
  ];

  const services = [
    'Desenvolvimento de IA',
    'Aplicações Web',
    'Apps Mobile',
    'Cybersecurity',
    'UX/UI Design',
    'DevOps & Cloud',
    'Consultoria Tech',
    'Outro',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Entre em <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Contato</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Estamos prontos para transformar suas ideias em soluções tecnológicas inovadoras. 
            Vamos conversar sobre seu próximo projeto!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-gradient-to-br from-${info.color}-500 to-${info.color}-600 text-white`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <Cpu className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Solicitar Orçamento</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Conta
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.accountType === 'individual' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="accountType"
                        value="individual"
                        checked={formData.accountType === 'individual'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <User className="h-5 w-5 mr-2" />
                      <span className="font-medium">Pessoa Física</span>
                    </label>
                    <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.accountType === 'company' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="accountType"
                        value="company"
                        checked={formData.accountType === 'company'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <Building className="h-5 w-5 mr-2" />
                      <span className="font-medium">Empresa</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome {formData.accountType === 'company' ? 'do Responsável' : 'Completo'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                {formData.accountType === 'company' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serviço de Interesse
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um serviço</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descreva seu projeto ou necessidade..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>Enviar Mensagem</span>
                  </span>
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nossa Localização</h3>
                    <p className="text-gray-600">Tech Park, 2000</p>
                    <p className="text-gray-600">São Paulo, SP - 01234-567</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="h-6 w-6 text-blue-600 mr-2" />
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Qual o prazo médio dos projetos?</h4>
                    <p className="text-gray-600 text-sm">Varia de 2 semanas a 6 meses, dependendo da complexidade e escopo do projeto.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Oferecem suporte pós-entrega?</h4>
                    <p className="text-gray-600 text-sm">Sim, oferecemos suporte e manutenção contínua para todos os nossos projetos.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Trabalham com metodologias ágeis?</h4>
                    <p className="text-gray-600 text-sm">Utilizamos Scrum e Kanban para garantir entregas rápidas e qualidade.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;