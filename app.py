import os
import traceback
from flask import Flask, request, render_template, jsonify, session, redirect, url_for, flash, Response
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.orm import joinedload 
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from sqlalchemy import func, extract
from sqlalchemy.sql import exists
import io
import csv

try:
    print("DEBUG: app.py está a ser executado!")

    app = Flask(__name__)

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login'

    @login_manager.user_loader
    def load_user(user_id):
        # Por padrão, o Flask-Login armazena o ID como string. Converta para int se o ID no DB for int.
        try:
            user_id = int(user_id)
        except ValueError:
            return None

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/TechHUB'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'ddgfjhgg456973hfjhfn3u4555ghhgkmnbvvqpp' #Chave de segurança
    app.config['SECURITY_PASSWORD_SALT'] = 'bbggphjessvee456193nepzxqlknd98s6j'

    # Configurações para upload de arquivos
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads', 'profile_pics')
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

    # Garante que o diretório de upload existe
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # --- Configurações do Flask-Mail ---
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587 # Porta 
    app.config['MAIL_USE_TLS'] = True # Usar TLS
    app.config['MAIL_USERNAME'] = 'techhub.business25@gmail.com' # Endereço de email 
    app.config['MAIL_PASSWORD'] = 'jxdmldlgicnmtwbi' # Senha
    app.config['MAIL_DEFAULT_SENDER'] = 'techhub.business25@gmail.com' # Email remetente

    s = URLSafeTimedSerializer(app.config['SECRET_KEY'], salt=app.config['SECURITY_PASSWORD_SALT'])

    print("DEBUG: Configurações do Flask definidas.")

    db = SQLAlchemy(app)
    mail = Mail(app) 

    print("DEBUG: SQLAlchemy e Flask-Mail inicializados.")

    def allowed_file(filename):
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

    # Email do administrador
    ADMIN_EMAIL = 'techhub.business25@gmail.com'

    # Classes do banco de dados
    class Empresa(db.Model):
        __tablename__ = 'empresas'
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        nome_empresa = db.Column(db.String(150), nullable=False)
        nome_responsavel = db.Column(db.String(150), nullable=False)
        email_corporativo = db.Column(db.String(150), unique=True, nullable=False)
        cnpj = db.Column(db.String(14), unique=True, nullable=False)
        senha_hash = db.Column(db.String(255), nullable=False)
        data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
        telefone_empresa = db.Column(db.String(15), nullable=False)
        descricao_empresa = db.Column(db.Text, nullable=True)
        imagem_perfil_url = db.Column(db.String(255), default='/static/img/user (2).png')
        last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        def __repr__(self):
            return f"<Empresa {self.nome_empresa}>"

        def set_password(self, password):
            self.senha_hash = generate_password_hash(password)

        def check_password(self, password):
            if self.senha_hash is None:
                return False
            return check_password_hash(self.senha_hash, password)

    class Servico(db.Model):
        __tablename__ = 'servicos'
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        nome_servico = db.Column(db.String(150), nullable=False)
        categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=False)
        descricao_curta = db.Column(db.String(500), nullable=False)
        descricao_servico = db.Column(db.Text, nullable=False)
        empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=False)
        tecnologias = db.Column(db.String(500), nullable=True)
        imagem_url = db.Column(db.String(500), nullable=True)
        projeto_url = db.Column(db.String(500), nullable=True)
        data_publicacao = db.Column(db.DateTime, default=datetime.utcnow)

        empresa = db.relationship('Empresa', backref=db.backref('servicos', lazy=True))
        categoria = db.relationship('Categoria', backref=db.backref('servicos', lazy=True))

        def __repr__(self):
            return f"<Servico {self.nome_servico}>"


    class SolicitacaoPersonalizada(db.Model):
        __tablename__ = 'solicitacao_personalizada'
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)

        nome_solicitante = db.Column(db.String(150), nullable=True)
        email_contato = db.Column(db.String(150), nullable=False)
        telefone_contato = db.Column(db.String(15), nullable=False)

        titulo_projeto = db.Column(db.String(255), nullable=False) 
        descricao_projeto = db.Column(db.Text, nullable=False)
        preco_orcamento = db.Column(db.Float, nullable=True) 
        data_limite = db.Column(db.Date, nullable=True) 

        data_solicitacao = db.Column(db.DateTime, default=datetime.utcnow)
        
        empresa_solicitante_id = db.Column(db.Integer, db.ForeignKey('empresas.id'), nullable=True) 
        categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.id'), nullable=True) 

        empresa_solicitante = db.relationship('Empresa', backref=db.backref('solicitacoes_feitas', lazy=True))
        categoria = db.relationship('Categoria', backref=db.backref('solicitacoes_personalizadas', lazy=True))

        def __repr__(self):
            return f"<SolicitacaoPersonalizada {self.id} - Título: {self.titulo_projeto}>"


    class Categoria(db.Model):
        __tablename__ = 'categorias'
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        nome_categoria = db.Column(db.String(150), unique=True, nullable=False)
        # Adicione uma coluna slug_categoria para consistência com o JS e URLs amigáveis
        slug_categoria = db.Column(db.String(150), unique=True, nullable=True) 

        def __repr__(self):
            return f"<Categoria {self.nome_categoria}>"

    # --- FUNÇÃO AUXILIAR PARA VERIFICAR/CRIAR CATEGORIA 'OUTRO' ---
    # Coloque esta função em um local acessível, por exemplo, logo após suas classes de modelo
    def verificar_ou_criar_categoria_outros():
        """
        Verifica se a categoria 'Outro' existe no banco de dados.
        Se não existir, ela é criada.
        Retorna o objeto Categoria 'Outro'.
        """
        try:
            categoria_outros = Categoria.query.filter_by(nome_categoria='Outro').first()

            if not categoria_outros:
                print("DEBUG: Categoria 'Outro' não encontrada, criando...")
                # Certifique-se de que o slug_categoria também seja definido
                categoria_outros = Categoria(nome_categoria='Outro', slug_categoria='outro') # slug em minúsculas
                db.session.add(categoria_outros)
                db.session.commit()
                print("DEBUG: Categoria 'Outro' criada com sucesso.")
            else:
                print("DEBUG: Categoria 'Outro' já existe.")
            
            return categoria_outros
        except Exception as e:
            db.session.rollback()
            print(f"ERRO ao verificar/criar categoria 'Outro': {e}")
            traceback.print_exc()
            return None

    # --- NOVA FUNÇÃO ADICIONADA ---
    def parse_budget_to_float(budget_str):
        """Tenta converter uma string de orçamento para float.
        Se a string for texto como 'A negociar' ou contiver caracteres não numéricos,
        retorna None.
        """
        if not budget_str:
            return None
        try:
            # Tenta a conversão direta primeiro
            return float(budget_str)
        except ValueError:
            # Se falhar, significa que é um texto como "A negociar" ou "R$1.000 - R$5.000"
            # Nesses casos, não temos um valor numérico para salvar.
            return None

    def get_current_logged_in_empresa():
        empresa_id = session.get('empresa_id')
        if empresa_id:
            try:
                empresa = Empresa.query.get(int(empresa_id))
                if not empresa:
                    session.pop('empresa_id', None)
                    return None
                return empresa
            except ValueError:
                session.pop('empresa_id', None)
                return None
        return None

    def is_admin(empresa):
        return empresa and empresa.email_corporativo == ADMIN_EMAIL
    
    def admin_required_custom(f):
        from functools import wraps
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_empresa = get_current_logged_in_empresa()
            if not current_empresa or not is_admin(current_empresa):
                flash('Acesso negado. Você não tem permissão de administrador.', 'danger')
                return redirect(url_for('login'))
            return f(*args, **kwargs)
        return decorated_function

    def login_required_custom(f):
        from functools import wraps
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not session.get('empresa_id'):
                flash('Por favor, faça login para acessar esta página.', 'warning')
                return redirect(url_for('login', next=request.url))
            return f(*args, **kwargs)
        return decorated_function

    # Rotas
    @app.route('/')
    def index():
        current_logged_in_empresa = get_current_logged_in_empresa()
        return render_template('index.html',
                                current_empresa=current_logged_in_empresa,
                                is_admin=is_admin(current_logged_in_empresa))

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if 'empresa_id' in session:
            current_empresa = get_current_logged_in_empresa()
            if current_empresa:
                if is_admin(current_empresa):
                    return redirect(url_for('admin_dashboard'))
                else:
                    return redirect(url_for('client_profile'))
            else:
                session.pop('empresa_id', None)
                flash('Sua sessão era inválida. Por favor, faça login novamente.', 'warning')

        if request.method == 'POST':
            email = request.form.get('email')
            senha = request.form.get('password')

            empresa = Empresa.query.filter_by(email_corporativo=email).first()

            if empresa and empresa.check_password(senha):
                session['empresa_id'] = empresa.id
                flash('Login realizado com sucesso!', 'success')
                next_page = request.args.get('next')

                if is_admin(empresa):
                    return redirect(next_page or url_for('admin_dashboard'))
                else:
                    return redirect(next_page or url_for('client_profile'))
            else:
                flash('Email ou senha inválidos.', 'danger')
                return render_template('login.html')

        return render_template('login.html')
    
    @app.route('/reset_password_request', methods=['GET', 'POST'])
    def reset_password_request():
        """
        Rota para o usuário solicitar um link de redefinição de senha.
        O usuário informa o e-mail, e um link é enviado para ele.
        """
        if request.method == 'POST':
            email = request.form.get('email') # Nome do campo 'email' no formulário HTML

            # Busca a empresa pelo email corporativo
            empresa = Empresa.query.filter_by(email_corporativo=email).first()

            if empresa:
                try:
                    # Gera um token único e seguro com tempo de expiração (1 hora = 3600 segundos)
                    # O 'reset-password-salt' é um salt específico para este tipo de token, tornando-o mais seguro.
                    token = s.dumps(empresa.email_corporativo, salt='reset-password-salt')
                    
                    # Constrói o link completo para o formulário de redefinição de senha
                    # _external=True é crucial para que o link funcione fora do servidor (no e-mail)
                    reset_url = url_for('reset_password_form', token=token, _external=True)

                    # Cria a mensagem de e-mail
                    msg = Message(
                        subject="Redefinição de Senha - TechHUB",
                        sender=app.config['MAIL_DEFAULT_SENDER'],
                        recipients=[empresa.email_corporativo]
                    )
                    # Renderiza o template HTML para o corpo do e-mail
                    msg.html = render_template('reset_password_email.html',
                                               empresa_nome=empresa.nome_empresa,
                                               reset_url=reset_url,
                                               validity_minutes=60) # Informa ao usuário que o link é válido por 60 minutos
                    
                    # Envia o e-mail
                    mail.send(msg)
                    print(f"DEBUG: Link de redefinição enviado para: {empresa.email_corporativo}")
                    flash('Um link para redefinir sua senha foi enviado para o seu e-mail. Verifique sua caixa de entrada e spam.', 'info')
                except Exception as e:
                    # Captura e imprime erros no envio do e-mail
                    print(f"ERRO: Falha ao enviar e-mail de redefinição para {empresa.email_corporativo}: {e}")
                    traceback.print_exc() # Imprime o stack trace completo para depuração
                    flash('Ocorreu um erro ao enviar o e-mail de redefinição de senha. Tente novamente mais tarde.', 'danger')
            else:
                # Por segurança, não informamos se o e-mail não existe no sistema.
                # Isso evita que pessoas mal-intencionadas descubram e-mails válidos.
                flash('Se este e-mail estiver em nosso sistema, um link de redefinição foi enviado para ele.', 'info')
                print(f"DEBUG: Tentativa de redefinição de senha para e-mail não encontrado: {email}")

            # Redireciona de volta para a página de solicitação, mesmo em caso de sucesso ou e-mail não encontrado
            return render_template('reset_password_request.html') # Ou redirect(url_for('login')) se preferir

        # Para requisições GET, simplesmente renderiza o formulário de solicitação
        return render_template('reset_password_request.html')


    @app.route('/reset_password_form/<token>', methods=['GET', 'POST'])
    def reset_password_form(token):
        """
        Rota para o formulário de redefinição de senha.
        Recebe o token do link de e-mail e permite ao usuário definir uma nova senha.
        """
        email = None
        try:
            # Tenta carregar o e-mail do token, verificando sua validade (max_age) e salt
            email = s.loads(token, salt='reset-password-salt', max_age=3600) # Token válido por 1 hora (3600 segundos)
        except Exception as e:
            # Se o token for inválido (corrompido, expirado, salt incorreto, etc.)
            print(f"ERRO: Token de redefinição inválido ou expirado: {e}")
            traceback.print_exc()
            flash('O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo.', 'danger')
            return redirect(url_for('reset_password_request'))

        # Busca a empresa associada ao e-mail do token
        empresa = Empresa.query.filter_by(email_corporativo=email).first()
        if not empresa:
            # Se por algum motivo a empresa não for encontrada (ex: deletada após a solicitação)
            flash('Nenhuma conta encontrada para redefinir a senha. Por favor, solicite um novo link.', 'danger')
            print(f"ERRO: Empresa não encontrada para o e-mail do token: {email}")
            return redirect(url_for('reset_password_request'))

        if request.method == 'POST':
            new_password = request.form.get('new_password')
            confirm_password = request.form.get('confirm_new_password') 
            # Validação básica das senhas
            if not new_password or not confirm_password:
                flash('Por favor, preencha todos os campos de senha.', 'danger')
                return render_template('reset_password_form.html', token=token)

            if new_password != confirm_password:
                flash('As novas senhas não coincidem. Por favor, tente novamente.', 'danger')
                return render_template('reset_password_form.html', token=token)

            # Atualiza a senha da empresa no banco de dados
            try:
                empresa.set_password(new_password)
                db.session.commit() # Salva a alteração no banco de dados
                flash('Sua senha foi redefinida com sucesso! Você já pode fazer login com sua nova senha.', 'success')
                print(f"DEBUG: Senha redefinida com sucesso para {empresa.email_corporativo}")
                return redirect(url_for('login')) 
            except Exception as e:
                # Captura e imprime erros ao salvar a nova senha
                db.session.rollback() 
                print(f"ERRO: Falha ao salvar nova senha para {empresa.email_corporativo}: {e}")
                traceback.print_exc()
                flash(f'Ocorreu um erro ao salvar a nova senha: {str(e)}', 'danger')
                return render_template('reset_password_form.html', token=token)

        return render_template('reset_password_form.html', token=token)
    
    @app.route('/api/dashboard/metrics', methods=['GET'])
    @admin_required_custom 
    def dashboard_metrics():
        """
        Retorna as métricas principais do dashboard em JSON.
        Inclui total de solicitações de orçamento, empresas, cadastros mensais e serviços.
        """
        try:
            total_budget_requests = SolicitacaoPersonalizada.query.count()

            total_companies = Empresa.query.count()

            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            monthly_registrations = Empresa.query.filter(Empresa.data_criacao >= thirty_days_ago).count()

            total_services = Servico.query.count()

            metrics = {
                'total_budget_requests': total_budget_requests,
                'total_companies': total_companies,
                'monthly_registrations': monthly_registrations,
                'total_services': total_services
            }
            return jsonify(metrics)
        except Exception as e:
            print(f"ERRO ao buscar métricas do dashboard: {e}")
            traceback.print_exc() 
            return jsonify({'error': 'Erro ao carregar métricas'}), 500

    @app.route('/api/dashboard/budget_by_category', methods=['GET'])
    @admin_required_custom 
    def dashboard_budget_by_category():
        """
        Retorna a contagem de solicitações de orçamento por categoria em JSON para o gráfico.
        """
        try:
            budget_counts = db.session.query(
                Categoria.nome_categoria,
                func.count(SolicitacaoPersonalizada.id)
            ).join(
                Categoria, SolicitacaoPersonalizada.categoria_id == Categoria.id
            ).group_by(
                Categoria.nome_categoria
            ).all()

            category_data = {name: count for name, count in budget_counts}

            return jsonify(category_data)
        except Exception as e:
            print(f"ERRO ao buscar orçamentos por categoria: {e}")
            traceback.print_exc()
            return jsonify({'error': 'Erro ao carregar dados de orçamentos por categoria'}), 500

    @app.route('/api/dashboard/monthly_registrations', methods=['GET'])
    @admin_required_custom 
    def dashboard_monthly_registrations():
        """
        Retorna a contagem de cadastros de empresas por mês nos últimos 6 meses em JSON para o gráfico.
        """
        try:
            six_months_ago = datetime.utcnow() - timedelta(days=30 * 6) 

            monthly_counts_raw = db.session.query(
                extract('year', Empresa.data_criacao),
                extract('month', Empresa.data_criacao),
                func.count(Empresa.id)
            ).filter(
                Empresa.data_criacao >= six_months_ago
            ).group_by(
                extract('year', Empresa.data_criacao),
                extract('month', Empresa.data_criacao)
            ).order_by(
                extract('year', Empresa.data_criacao),
                extract('month', Empresa.data_criacao)
            ).all()

            monthly_data = {}
            for year, month, count in monthly_counts_raw:
                month_name = datetime(2000, int(month), 1).strftime('%b') 
                monthly_data[f"{month_name} {int(year)}"] = count
            
            current_date = datetime.utcnow()
            all_months = {}
            for i in range(6):
                month_date = current_date - timedelta(days=30 * i)
                month_name = month_date.strftime('%b')
                year = month_date.year
                all_months[f"{month_name} {year}"] = 0 
            
            for key, value in monthly_data.items():
                if key in all_months: 
                    all_months[key] = value
            
            ordered_months_keys = []
            for i in range(6):
                month_date = current_date - timedelta(days=30 * i)
                ordered_months_keys.append((month_date, month_date.strftime('%b %Y')))
            ordered_months_keys.sort(key=lambda x: x[0]) 
            
            final_monthly_data = {key_name: all_months.get(key_name, 0) for _, key_name in ordered_months_keys}


            return jsonify(final_monthly_data)
        except Exception as e:
            print(f"ERRO ao buscar cadastros mensais: {e}")
            traceback.print_exc()
            return jsonify({'error': 'Erro ao carregar dados de cadastros mensais'}), 500
        
    @app.route('/api/dashboard/popular_services', methods=['GET'])
    @admin_required_custom
    def dashboard_popular_services():
        """
        Retorna os serviços mais populares (com base no número de solicitações de orçamento) em JSON.
        """
        try:
            popular_services = db.session.query(
                Servico.nome_servico,
                Empresa.nome_empresa, 
                func.count(SolicitacaoPersonalizada.id).label('total_solicitacoes')
            ).join(
                SolicitacaoPersonalizada, SolicitacaoPersonalizada.categoria_id == Servico.categoria_id 
            ).join(
                Empresa, Servico.empresa_id == Empresa.id 
            ).group_by(
                Servico.id, Servico.nome_servico, Empresa.nome_empresa 
            ).order_by(
                func.count(SolicitacaoPersonalizada.id).desc() 
            ).limit(10).all() 

            data = [
                {'nome_servico': s.nome_servico, 'nome_empresa': s.nome_empresa, 'total_solicitacoes': s.total_solicitacoes}
                for s in popular_services
            ]
            return jsonify(data)
        except Exception as e:
            print(f"ERRO ao buscar serviços mais populares: {e}")
            traceback.print_exc()
            return jsonify({'error': 'Erro ao carregar serviços mais populares'}), 500

    @app.route('/api/dashboard/active_companies', methods=['GET'])
    @admin_required_custom
    def dashboard_active_companies():
        """
        Retorna as empresas mais ativas (com base no número de serviços publicados) em JSON.
        """
        try:
            active_companies = db.session.query(
                Empresa.nome_empresa,
                Empresa.email_corporativo,
                func.count(Servico.id).label('total_servicos_publicados')
            ).join(
                Servico, Empresa.id == Servico.empresa_id
            ).group_by(
                Empresa.id, Empresa.nome_empresa, Empresa.email_corporativo
            ).order_by(
                func.count(Servico.id).desc()
            ).limit(10).all() 

            data = [
                {'nome_empresa': c.nome_empresa, 'email_corporativo': c.email_corporativo, 'total_servicos_publicados': c.total_servicos_publicados}
                for c in active_companies
            ]
            return jsonify(data)
        except Exception as e:
            print(f"ERRO ao buscar empresas mais ativas: {e}")
            traceback.print_exc()
            return jsonify({'error': 'Erro ao carregar empresas mais ativas'}), 500
        
    @app.route('/admin/export/empresas_csv', methods=['GET'])
    @admin_required_custom
    def export_empresas_csv():
        """
        Exporta todos os dados das empresas para um arquivo CSV.
        """
        try:
            si = io.StringIO()
            cw = csv.writer(si)

            # Cabeçalho do CSV
            header = ['ID', 'Nome da Empresa', 'Nome do Responsável', 'Email Corporativo', 'CNPJ', 'Telefone', 'Data de Criação']
            cw.writerow(header)

            empresas = Empresa.query.all()
            for empresa in empresas:
                row = [
                    empresa.id,
                    empresa.nome_empresa,
                    empresa.nome_responsavel,
                    empresa.email_corporativo,
                    empresa.cnpj,
                    empresa.telefone_empresa,
                    empresa.data_criacao.strftime('%Y-%m-%d %H:%M:%S') # Formata a data
                ]
                cw.writerow(row)
            
            output = si.getvalue()
            response = Response(output, mimetype='text/csv')
            response.headers["Content-Disposition"] = "attachment; filename=empresas.csv"
            return response
        except Exception as e:
            print(f"ERRO ao exportar empresas para CSV: {e}")
            traceback.print_exc()
            flash('Erro ao exportar dados de empresas.', 'danger')
            return redirect(url_for('admin_dashboard'))

    @app.route('/admin/export/servicos_csv', methods=['GET'])
    @admin_required_custom
    def export_servicos_csv():
        """
        Exporta todos os dados dos serviços para um arquivo CSV.
        """
        try:
            si = io.StringIO()
            cw = csv.writer(si)

            header = ['ID', 'Nome do Serviço', 'Categoria', 'Empresa Publicadora', 'Descrição Curta', 'Descrição Completa', 'Tecnologias', 'URL do Projeto', 'Data de Publicação']
            cw.writerow(header)

            servicos = Servico.query.options(joinedload(Servico.categoria), joinedload(Servico.empresa)).all()
            for servico in servicos:
                row = [
                    servico.id,
                    servico.nome_servico,
                    servico.categoria.nome_categoria if servico.categoria else 'N/A',
                    servico.empresa.nome_empresa if servico.empresa else 'N/A',
                    servico.descricao_curta,
                    servico.descricao_servico,
                    servico.tecnologias,
                    servico.projeto_url,
                    servico.data_publicacao.strftime('%Y-%m-%d %H:%M:%S')
                ]
                cw.writerow(row)
            
            output = si.getvalue()
            response = Response(output, mimetype='text/csv')
            response.headers["Content-Disposition"] = "attachment; filename=servicos.csv"
            return response
        except Exception as e:
            print(f"ERRO ao exportar serviços para CSV: {e}")
            traceback.print_exc()
            flash('Erro ao exportar dados de serviços.', 'danger')
            return redirect(url_for('admin_dashboard'))

    @app.route('/admin/export/solicitacoes_csv', methods=['GET'])
    @admin_required_custom
    def export_solicitacoes_csv():
        """
        Exporta todos os dados das solicitações de orçamento para um arquivo CSV.
        """
        try:
            si = io.StringIO()
            cw = csv.writer(si)

            header = ['ID', 'Nome Solicitante', 'Email Contato', 'Telefone Contato', 'Título do Projeto', 'Descrição do Projeto', 'Preço Orçamento', 'Data Limite', 'Data da Solicitação', 'Empresa Solicitante', 'Categoria']
            cw.writerow(header)

            solicitacoes = SolicitacaoPersonalizada.query.options(joinedload(SolicitacaoPersonalizada.empresa_solicitante), joinedload(SolicitacaoPersonalizada.categoria)).all()
            for solicitacao in solicitacoes:
                row = [
                    solicitacao.id,
                    solicitacao.nome_solicitante,
                    solicitacao.email_contato,
                    solicitacao.telefone_contato,
                    solicitacao.titulo_projeto,
                    solicitacao.descricao_projeto,
                    solicitacao.preco_orcamento,
                    solicitacao.data_limite.strftime('%Y-%m-%d') if solicitacao.data_limite else '',
                    solicitacao.data_solicitacao.strftime('%Y-%m-%d %H:%M:%S'),
                    solicitacao.empresa_solicitante.nome_empresa if solicitacao.empresa_solicitante else 'N/A (Visitante)',
                    solicitacao.categoria.nome_categoria if solicitacao.categoria else 'N/A (Personalizado)'
                ]
                cw.writerow(row)
            
            output = si.getvalue()
            response = Response(output, mimetype='text/csv')
            response.headers["Content-Disposition"] = "attachment; filename=solicitacoes.csv"
            return response
        except Exception as e:
            print(f"ERRO ao exportar solicitações para CSV: {e}")
            traceback.print_exc()
            flash('Erro ao exportar dados de solicitações.', 'danger')
            return redirect(url_for('admin_dashboard'))
        
    @app.route('/admin/send_bulk_email', methods=['POST'])
    @admin_required_custom
    def send_bulk_email():
        """
        Envia um e-mail para todas as empresas cadastradas.
        """
        try:
            data = request.get_json()
            subject = data.get('subject')
            body = data.get('body')

            if not subject or not body:
                return jsonify({'success': False, 'message': 'Assunto e corpo do e-mail são obrigatórios.'}), 400

            empresas = Empresa.query.all()
            
            # Lista para armazenar e-mails que falharam
            failed_emails = []
            sent_count = 0

            for empresa in empresas:
                try:
                    msg = Message(
                        subject,
                        recipients=[empresa.email_corporativo],
                        body=body
                    )
                    mail.send(msg)
                    sent_count += 1
                except Exception as e:
                    print(f"ERRO ao enviar e-mail para {empresa.email_corporativo}: {e}")
                    failed_emails.append(empresa.email_corporativo)
            
            if not failed_emails:
                return jsonify({'success': True, 'message': f'E-mail enviado para {sent_count} empresas com sucesso!'})
            else:
                return jsonify({
                    'success': False, 
                    'message': f'E-mail enviado para {sent_count} empresas. Falha ao enviar para: {", ".join(failed_emails)}'
                }), 500

        except Exception as e:
            print(f"ERRO geral ao processar envio de e-mail em massa: {e}")
            traceback.print_exc()
            return jsonify({'success': False, 'message': 'Erro interno do servidor ao enviar e-mail.'}), 500
        
    @app.route('/empresas_cadastradas')
    def empresas_cadastradas():
        try:
            empresas = Empresa.query.all()
        except Exception as e:
            print(f"Erro ao buscar empresas do banco de dados: {e}")
            empresas = [] 

        return render_template('empresas_cadastradas.html', empresas=empresas)
    
    @app.route('/empresas/<int:company_id>')
    @admin_required_custom 
    #@login_required 
    def company_profile_admin(company_id):
        print(f"DEBUG: Acessando company_profile_admin para empresa ID: {company_id}")

        empresa = Empresa.query.get_or_404(company_id)
        try:
            servicos_publicados = empresa.servicos
        except AttributeError:
            print(f"DEBUG: Relacionamento 'servicos' não encontrado no modelo Empresa para ID {company_id}. Buscando manualmente.")
            servicos_publicados = Servico.query.filter_by(empresa_id=company_id).all()
        except Exception as e:
            print(f"ERRO ao buscar serviços para a empresa {company_id}: {e}")
            traceback.print_exc() 
            servicos_publicados = [] 

        return render_template('company_profile_admin.html', empresa=empresa, servicos_publicados=servicos_publicados)

    @app.route('/admin/empresa/delete/<int:company_id>', methods=['POST'])
    @admin_required_custom
    @login_required
    def delete_company_account(company_id):

        empresa = Empresa.query.get(company_id)
        if not empresa:
            return jsonify(success=False, message='Empresa não encontrada.'), 404

        try:
            msg = Message(
                'Notificação de Encerramento de Conta - techHUB',
                sender=os.getenv('MAIL_USERNAME'), 
                recipients=[empresa.email_corporativo]
            )
            msg.html = render_template(
                'emails/company_deletion_notification.html', 
                nome_empresa=empresa.nome_empresa
            )
            mail.send(msg)
            db.session.delete(empresa)
            db.session.commit()

            flash(f'A conta da empresa "{empresa.nome_empresa}" foi apagada e notificada.', 'success')
            return jsonify(success=True, message='Empresa apagada com sucesso.'), 200

        except Exception as e:
            db.session.rollback() 
            print(f"ERRO ao apagar empresa ou enviar e-mail: {e}")
            traceback.print_exc()
            return jsonify(success=False, message=f'Erro ao apagar a empresa: {str(e)}'), 500

    @app.route('/admin/send_company_email/<int:company_id>', methods=['POST'])
    @admin_required_custom
    @login_required
    def send_company_email(company_id):

        empresa = Empresa.query.get(company_id)
        if not empresa:
            return jsonify(success=False, message='Empresa não encontrada.'), 404

        data = request.get_json()
        subject = data.get('subject')
        body = data.get('body')

        if not subject or not body:
            return jsonify(success=False, message='Assunto e corpo do e-mail são obrigatórios.'), 400

        try:
            msg = Message(
                subject=subject,
                sender=os.getenv('MAIL_USERNAME'), 
                recipients=[empresa.email_corporativo]
            )
            msg.body = body 
            mail.send(msg)

            return jsonify(success=True, message='E-mail enviado com sucesso!'), 200

        except Exception as e:
            print(f"ERRO ao enviar e-mail para {empresa.email_corporativo}: {e}")
            traceback.print_exc()
            return jsonify(success=False, message=f'Erro ao enviar e-mail: {str(e)}'), 500

    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if 'empresa_id' in session: 
            current_empresa = get_current_logged_in_empresa()
            if current_empresa:
                flash('Você já está logado. Faça logout para criar uma nova conta.', 'info')
                return redirect(url_for('client_profile')) 
            else:
                session.pop('empresa_id', None)

        if request.method == 'POST':
            nome_empresa = request.form.get('companyName')
            nome_responsavel = request.form.get('responsibleName')
            email_corporativo = request.form.get('email') 
            senha = request.form.get('password') 
            telefone_empresa = request.form.get('telefone')
            cnpj = request.form.get('cnpj')

            if not nome_empresa or not nome_responsavel or not email_corporativo or not senha or not cnpj or not telefone_empresa:
                flash('Todos os campos obrigatórios (Nome da Empresa, Responsável, Email, Senha, CNPJ, Telefone) devem ser preenchidos.', 'danger')
                return render_template('register.html')

            existing_email = Empresa.query.filter_by(email_corporativo=email_corporativo).first()
            if existing_email:
                flash('Este email corporativo já está cadastrado. Faça login ou use outro email.', 'danger')
                return render_template('register.html')
            
            existing_cnpj = Empresa.query.filter_by(cnpj=cnpj).first()
            if existing_cnpj:
                flash('Este CNPJ já está cadastrado. Verifique seus dados ou faça login.', 'danger')
                return render_template('register.html')

            try:
                new_empresa = Empresa(
                    nome_empresa=nome_empresa,
                    nome_responsavel=nome_responsavel,
                    email_corporativo=email_corporativo,
                    cnpj=cnpj,
                    telefone_empresa=telefone_empresa,
                )
                new_empresa.set_password(senha)
                db.session.add(new_empresa)
                db.session.commit()
                
                # --- INÍCIO DO BLOCO DE DEBUG ---
                print(f"DEBUG: Tentando enviar email de boas-vindas para: {new_empresa.email_corporativo}")
                print(f"DEBUG: Nome da Empresa: {new_empresa.nome_empresa}")
                print(f"DEBUG: Email do Destinatário: {new_empresa.email_corporativo}")
                print(f"DEBUG: Remetente configurado: {app.config['MAIL_DEFAULT_SENDER']}")
                # --- FIM DO BLOCO DE DEBUG ---

                try:
                    msg = Message(
                        subject=f"Bem-vindo(a) ao TechHUB, {new_empresa.nome_empresa}!",
                        sender=app.config['MAIL_DEFAULT_SENDER'],
                        recipients=[new_empresa.email_corporativo]
                    )
                    msg.html = render_template('welcome_email.html', empresa=new_empresa, now=datetime.utcnow())
                    mail.send(msg)
                    print(f"Email de boas-vindas enviado para: {new_empresa.email_corporativo}")
                except Exception as e:
                    print(f"ERRO ao enviar email de boas-vindas para {new_empresa.nome_empresa} ({new_empresa.email_corporativo}): {e}")
                    traceback.print_exc() 
                flash('Cadastro realizado com sucesso! Faça login para continuar.', 'success')
                return redirect(url_for('login'))
            except Exception as e:
                db.session.rollback()
                flash(f'Erro ao cadastrar: {str(e)}', 'danger')
                print(f"Erro de cadastro: {e}")
                return render_template('register.html')

        return render_template('register.html')

    @app.route('/logout')
    def logout():
        session.pop('empresa_id', None)
        flash('Você foi desconectado.', 'info')
        return redirect(url_for('index'))

    @app.route('/sobre')
    def sobre():
        return render_template('sobre.html')

    @app.route('/servicos')
    def servicos():
        categorias = Categoria.query.all()
        # Adicione esta linha para carregar todos os serviços
        servicos = Servico.query.options(joinedload(Servico.empresa)).all() # CORREÇÃO: Adicionado carregamento de serviços
        current_logged_in_empresa = get_current_logged_in_empresa()
        return render_template('servicos.html',
                                categorias=categorias,
                                servicos=servicos, # <-- Agora passando os serviços
                                empresa=current_logged_in_empresa)

    @app.route('/servicos_por_categoria')
    def servicos_por_categoria():
        selected_category_name = request.args.get('category', 'all')
        
        if selected_category_name == 'all':
            servicos = Servico.query.options(joinedload(Servico.empresa)).all()
        else:
            categoria = Categoria.query.filter_by(nome_categoria=selected_category_name).first()
            if categoria:
                servicos = Servico.query.filter_by(categoria_id=categoria.id).options(joinedload(Servico.empresa)).all()
            else:
                servicos = []

        categorias = Categoria.query.all() 
        current_logged_in_empresa = get_current_logged_in_empresa()

        return render_template('servicos_por_categoria.html', 
                                servicos=servicos, 
                                categorias=categorias, 
                                selected_category=selected_category_name,
                                empresa=current_logged_in_empresa)


    @app.route('/detalhes_servico/<int:servico_id>')
    def detalhes_servico(servico_id):
        servico = Servico.query.options(db.joinedload(Servico.categoria), db.joinedload(Servico.empresa)).get_or_404(servico_id)
        empresa_publicadora = servico.empresa
        current_logged_in_empresa = get_current_logged_in_empresa()
        return render_template('detalhes_servico.html',
                                servico=servico,
                                empresa_publicadora=empresa_publicadora,
                                empresa=current_logged_in_empresa)

    @app.route('/comunidade')
    def comunidade():
        try:
            empresas = Empresa.query.all()
        except Exception as e:
            print(f"Erro ao buscar empresas do banco de dados: {e}")
            empresas = [] 

        return render_template('comunidade.html', empresas=empresas)
    
    @app.route('/comunidade/<int:company_id>')
    def company_profile(company_id):
        empresa = Empresa.query.get_or_404(company_id)
        try:
            servicos_publicados = empresa.servicos
        except AttributeError:
            servicos_publicados = Servico.query.filter_by(empresa_id=company_id).all()
        except Exception as e:
            print(f"Erro ao buscar serviços para a empresa {company_id}: {e}")
            servicos_publicados = [] 

        return render_template('company_profile.html', empresa=empresa, servicos_publicados=servicos_publicados)
    
    @app.route('/contato', methods=['GET']) 
    def contato():
        current_logged_in_empresa = get_current_logged_in_empresa()
        # Renderiza o template de contato, que conterá o formulário para solicitar_orcamento_personalizado
        return render_template('contato.html', empresa=current_logged_in_empresa)

    @app.route('/api/empresas-por-categoria')
    def api_empresas_por_categoria():
        # Esta rota não será mais chamada pelo novo fluxo de contato/orçamento personalizado.
        # Mantida para compatibilidade se outros lugares ainda a utilizarem.
        category_name = request.args.get('category')
        empresas_list = []

        if category_name and category_name != 'Outro':
            categoria = Categoria.query.filter_by(nome_categoria=category_name).first()
            if categoria:
                # Subquery para encontrar IDs de empresas que oferecem serviços na categoria
                empresa_ids_com_servico = db.session.query(Servico.empresa_id).filter_by(categoria_id=categoria.id).distinct().all()
                empresa_ids_com_servico = [id[0] for id in empresa_ids_com_servico]
                empresas = Empresa.query.filter(Empresa.id.in_(empresa_ids_com_servico)).all()
                empresas_list = [{'id': emp.id, 'nome_empresa': emp.nome_empresa} for emp in empresas]
        elif category_name == 'Outro':
            # Se a categoria for 'Outro', retorna todas as empresas
            empresas = Empresa.query.all()
            empresas_list = [{'id': emp.id, 'nome_empresa': emp.nome_empresa} for emp in empresas]
        
        return jsonify(empresas=empresas_list)
    
    # --- Rota para exibir o formulário de "Contratar Empresa" (GET) ---
    @app.route('/solicitar_orcamento', methods=['GET'])
    def solicitar_orcamento():
        selected_category_name = request.args.get('category', 'Geral')
        
        # Buscar todas as empresas que oferecem serviços nesta categoria
        categoria = Categoria.query.filter_by(nome_categoria=selected_category_name).first()
        empresas_na_categoria = []

        if categoria:
            # Encontra os IDs das empresas que publicaram serviços nesta categoria
            empresa_ids_com_servico = db.session.query(Servico.empresa_id).filter_by(categoria_id=categoria.id).distinct().all()
            empresa_ids_com_servico = [id[0] for id in empresa_ids_com_servico] # Extrai os IDs

            # Busca as empresas usando os IDs
            empresas_na_categoria = Empresa.query.filter(Empresa.id.in_(empresa_ids_com_servico)).all()
        
        current_logged_in_empresa = get_current_logged_in_empresa()

        return render_template('solicitar_orcamento.html', 
                                selected_category_name=selected_category_name,
                                empresas_na_categoria=empresas_na_categoria,
                                empresa=current_logged_in_empresa)


    # --- Rota para processar o formulário de "Serviços Personalizados" (POST) ---
    @app.route('/submit_orcamento_servico_personalizado', methods=['POST'])
    def submit_orcamento_servico_personalizado(): # NOME DA FUNÇÃO RENOMEADO AQUI
        nome_solicitante = request.form.get('contact_name')
        email_contato = request.form.get('contact_email')
        telefone_contato = request.form.get('contact_phone')
        titulo_projeto = request.form.get('project_title')
        descricao_projeto = request.form.get('project_description')
        budget_range = request.form.get('budget_range')
        deadline_str = request.form.get('deadline') # data_limite virá como string

        if not nome_solicitante or not email_contato or not telefone_contato or not titulo_projeto or not descricao_projeto:
            flash('Por favor, preencha todos os campos obrigatórios (Nome, Email, Telefone, Título do Projeto, Descrição).', 'danger')
            return redirect(url_for('contato'))

        # Tenta converter a data limite, se fornecida
        data_limite = None
        if deadline_str:
            try:
                data_limite = datetime.strptime(deadline_str, '%Y-%m-%d').date() # Apenas a data
            except ValueError:
                flash('Formato de data inválido para o prazo. Use YYYY-MM-DD.', 'warning')
                # Continuar sem a data se for inválida, ou retornar erro. Decidi continuar.

        # Pega a empresa logada, se houver
        current_logged_in_empresa = get_current_logged_in_empresa()
        empresa_solicitante_id = current_logged_in_empresa.id if current_logged_in_empresa else None

        # --- NOVO: Obter/Criar a categoria 'Outro' para orçamentos personalizados ---
        categoria_outros_obj = verificar_ou_criar_categoria_outros()

        if not categoria_outros_obj:
            flash('Erro interno: Não foi possível obter a categoria padrão para orçamentos personalizados.', 'danger')
            return redirect(url_for('contato'))

        # Salva a solicitação personalizada no banco de dados
        try:
            nova_solicitacao = SolicitacaoPersonalizada(
                nome_solicitante=nome_solicitante,
                email_contato=email_contato,
                telefone_contato=telefone_contato,
                titulo_projeto=titulo_projeto,
                descricao_projeto=descricao_projeto,
                preco_orcamento=parse_budget_to_float(budget_range), # <-- ALTERAÇÃO APLICADA AQUI
                data_limite=data_limite,
                empresa_solicitante_id=empresa_solicitante_id,
                categoria_id=categoria_outros_obj.id
            )
            db.session.add(nova_solicitacao)
            db.session.commit()
            flash('Sua solicitação personalizada foi registrada!', 'info') # Flash para o solicitante
        except Exception as e:
            db.session.rollback()
            print(f"ERRO ao salvar solicitação personalizada no DB: {e}")
            flash('Ocorreu um erro ao registrar sua solicitação. Por favor, tente novamente.', 'danger')
            return redirect(url_for('contato'))

        # Busca TODAS as empresas cadastradas para enviar o e-mail
        target_companies = Empresa.query.all()

        if not target_companies:
            flash('Nenhuma empresa cadastrada para receber a solicitação no momento.', 'warning')
            return redirect(url_for('contato'))

        # Corpo do e-mail usando o template orcamento_email.html
        # Os nomes das variáveis no template devem corresponder aos novos nomes aqui (nome_solicitante, titulo_projeto etc.)
        email_body_html = render_template('orcamento_email.html',
            contact_name=nome_solicitante,
            contact_email=email_contato,
            contact_phone=telefone_contato,
            project_title=titulo_projeto,
            project_description=descricao_projeto,
            budget_range=budget_range,
            deadline=deadline_str # Mantém como string para o template
        )

        # Enviar e-mail para cada empresa selecionada
        for company in target_companies:
            try:
                msg = Message(
                    subject=f"Nova Solicitação de Projeto Personalizado: {titulo_projeto}",
                    sender=app.config['MAIL_DEFAULT_SENDER'],
                    recipients=[company.email_corporativo] 
                )
                msg.html = email_body_html 
                mail.send(msg) 
                print(f"Email de solicitação personalizada enviado para: {company.nome_empresa} ({company.email_corporativo})")
            except Exception as e:
                print(f"ERRO ao enviar email para {company.nome_empresa} ({company.email_corporativo}): {e}")
                traceback.print_exc() 

        flash('Sua solicitação de orçamento personalizado foi enviada para todas as empresas!', 'success')
        return redirect(url_for('contato')) 


    # --- Rota para processar o formulário de "Contratar Empresa" (POST) ---
    @app.route('/submit_orcamento', methods=['POST'])
    def processar_orcamento_empresa(): # NOME DA FUNÇÃO RENOMEADO AQUI
        category_name = request.form.get('category_name')
        selected_company_ids = request.form.getlist('selected_companies')
        project_title = request.form.get('project_title')
        project_description = request.form.get('project_description')
        budget_range = request.form.get('budget_range')
        deadline = request.form.get('deadline')
        contact_name = request.form.get('contact_name')
        contact_email = request.form.get('contact_email')
        contact_phone = request.form.get('contact_phone')

        if not selected_company_ids:
            flash('Por favor, selecione pelo menos uma empresa.', 'danger')
            return redirect(url_for('solicitar_orcamento', category=category_name))
        
        # Buscar as empresas selecionadas
        target_companies = Empresa.query.filter(Empresa.id.in_(selected_company_ids)).all()

        if not target_companies:
            flash('Nenhuma empresa válida selecionada.', 'danger')
            return redirect(url_for('solicitar_orcamento', category=category_name))

        # --- NOVO: Salvar a solicitação de orçamento no banco de dados ---
        categoria_obj = Categoria.query.filter_by(nome_categoria=category_name).first()
        categoria_id_para_salvar = categoria_obj.id if categoria_obj else None

        data_limite_obj = None
        if deadline:
            try:
                data_limite_obj = datetime.strptime(deadline, '%Y-%m-%d').date()
            except ValueError:
                print(f"DEBUG: Formato de data inválido para o prazo: {deadline}")

        empresa_solicitante_id = None
        current_logged_in_empresa = get_current_logged_in_empresa()
        if current_logged_in_empresa:
            empresa_solicitante_id = current_logged_in_empresa.id

        try:
            nova_solicitacao_empresas = SolicitacaoPersonalizada(
                nome_solicitante=contact_name,
                email_contato=contact_email,
                telefone_contato=contact_phone,
                titulo_projeto=project_title,
                descricao_projeto=project_description,
                preco_orcamento=parse_budget_to_float(budget_range), # <-- ALTERAÇÃO APLICADA AQUI
                data_limite=data_limite_obj,
                empresa_solicitante_id=empresa_solicitante_id,
                categoria_id=categoria_id_para_salvar # Associa a categoria correta
            )
            db.session.add(nova_solicitacao_empresas)
            db.session.commit()
            print(f"DEBUG: Solicitação de orçamento para empresas salva no DB: {project_title}")
        except Exception as e:
            db.session.rollback()
            print(f"ERRO ao salvar solicitação de orçamento para empresas no DB: {e}")
            traceback.print_exc()
            # Decida se quer retornar um erro ou apenas logar e continuar o envio de email
        # --- FIM DO NOVO CÓDIGO ---

        # Corpo do e-mail
        email_body = f"""
        Olá,

        Você recebeu uma nova solicitação de orçamento através do TechHUB para a categoria: {category_name}.

        Detalhes do Projeto:
        Título: {project_title}
        Descrição:
        {project_description}

        Orçamento Estimado: {budget_range if budget_range else 'Não informado'}
        Prazo Desejado: {deadline if deadline else 'Não informado'}

        Informações de Contato do Solicitante:
        Nome: {contact_name}
        Email: {contact_email}
        Telefone: {contact_phone if contact_phone else 'Não informado'}

        Por favor, entre em contato com o solicitante para discutir os detalhes e enviar sua proposta.

        Atenciosamente,
        Equipe TechHUB
        """

        # Enviar e-mail para cada empresa selecionada
        for company in target_companies:
            try:
                msg = Message(
                    subject=f"Nova Solicitação de Orçamento TechHUB: {project_title}",
                    sender=app.config['MAIL_DEFAULT_SENDER'],
                    recipients=[company.email_corporativo] 
                )
                msg.body = email_body
                mail.send(msg) 
                print(f"Email de solicitação enviado para: {company.email_corporativo}")
            except Exception as e:
                print(f"ERRO ao enviar email para {company.nome_empresa} ({company.email_corporativo}): {e}")
                traceback.print_exc() 

        flash('Sua solicitação de orçamento foi enviada com sucesso para as empresas selecionadas!', 'success')
        return redirect(url_for('servicos'))

    @app.route('/admin_dashboard')
    @admin_required_custom
    def admin_dashboard():
        return render_template('admin_dashboard.html', user_email=session.get('user_email'))

    @app.route('/client_profile')
    @login_required_custom
    def client_profile():
        empresa = get_current_logged_in_empresa()
        if not empresa:
            flash('Você precisa estar logado para ver seu perfil.', 'warning')
            return redirect(url_for('login'))

        # Se o usuário logado for um admin, redireciona para o dashboard de admin
        if is_admin(empresa):
            return redirect(url_for('admin_dashboard'))

        meus_servicos = Servico.query.filter_by(empresa_id=empresa.id).all()

        return render_template('client_profile.html', empresa=empresa, meus_servicos=meus_servicos)

    @app.route('/empresas/<int:empresa_id>')
    def perfil_empresa_publico(empresa_id):
        empresa = Empresa.query.get_or_404(empresa_id)
        servicos_da_empresa = Servico.query.filter_by(empresa_id=empresa.id).all()
        current_logged_in_empresa = get_current_logged_in_empresa() # Passando current_logged_in_empresa
        return render_template('public_company_profile.html', empresa=empresa, servicos_da_empresa=servicos_da_empresa, current_empresa=current_logged_in_empresa)

    @app.route('/edit_profile', methods=['POST'])
    @login_required_custom
    def edit_profile():
        empresa = get_current_logged_in_empresa() 

        if not empresa:
            return jsonify({'success': False, 'message': 'Empresa não encontrada ou não autenticada.'}), 401

        # Salvar valores originais para checar se houve alteração
        original_email = empresa.email_corporativo
        original_cnpj = empresa.cnpj # Adicionado para validação de CNPJ

        empresa.nome_empresa = request.form.get('nome_empresa', empresa.nome_empresa)
        empresa.nome_responsavel = request.form.get('nome_responsavel', empresa.nome_responsavel)
        empresa.email_corporativo = request.form.get('email_corporativo', empresa.email_corporativo)
        empresa.telefone_empresa = request.form.get('telefone_empresa', empresa.telefone_empresa)
        empresa.descricao_empresa = request.form.get('descricao_empresa', empresa.descricao_empresa)

        # Validação de email e CNPJ se alterados
        if empresa.email_corporativo != original_email:
            existing_email = Empresa.query.filter_by(email_corporativo=empresa.email_corporativo).first()
            if existing_email and existing_email.id != empresa.id:
                return jsonify({'success': False, 'message': 'Este email corporativo já está cadastrado para outra empresa.'}), 400

        if empresa.cnpj != original_cnpj: # Validação de CNPJ
            existing_cnpj = Empresa.query.filter_by(cnpj=empresa.cnpj).first()
            if existing_cnpj and existing_cnpj.id != empresa.id:
                return jsonify({'success': False, 'message': 'Este CNPJ já está cadastrado para outra empresa.'}), 400

        if 'imagem_perfil' in request.files:
            file = request.files['imagem_perfil']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_extension = filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{empresa.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.{file_extension}"

                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)

                try:
                    file.save(filepath)
                    empresa.imagem_perfil_url = url_for('static', filename=f'uploads/profile_pics/{unique_filename}')
                    flash('Foto de perfil atualizada com sucesso!', 'success')
                except Exception as e:
                    print(f"Erro ao salvar o ficheiro de imagem: {e}")
                    return jsonify({'success': False, 'message': f'Erro ao salvar a imagem: {str(e)}'}), 500
            elif file.filename == '':
                pass
            else:
                return jsonify({'success': False, 'message': 'Tipo de ficheiro de imagem não permitido.'}), 400

        current_password = request.form.get('current_password')
        new_password = request.form.get('new_password')
        confirm_new_password = request.form.get('confirm_new_password')

        if new_password:
            if not current_password or not empresa.check_password(current_password):
                return jsonify({'success': False, 'message': 'Senha atual incorreta. As alterações de senha não foram salvas.'}), 400

            if new_password != confirm_new_password:
                return jsonify({'success': False, 'message': 'A nova senha e a confirmação da nova senha não coincidem. As alterações de senha não foram salvas.'}), 400

            empresa.set_password(new_password)
            flash('Sua senha foi alterada com sucesso!', 'success')
        elif current_password or confirm_new_password:
            return jsonify({'success': False, 'message': 'Para alterar a senha, preencha todos os campos de senha (atual, nova e confirmação).'}), 400

        empresa.last_updated = datetime.utcnow()

        try:
            db.session.commit()
            return jsonify({
                'success': True,
                'message': 'Perfil atualizado com sucesso!',
                'new_image_url': empresa.imagem_perfil_url
            })
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao salvar perfil no banco de dados: {e}")
            return jsonify({'success': False, 'message': f'Erro ao salvar perfil: {str(e)}'}), 500

    @app.route('/publicar_projeto', methods=['GET', 'POST'])
    @login_required_custom
    def publicar_projeto():
        empresa = get_current_logged_in_empresa()
        if not empresa: 
            flash('Sua sessão expirou. Faça login novamente.', 'danger')
            return redirect(url_for('login'))

        categorias = Categoria.query.all()

        if request.method == 'POST':
            nome_servico = request.form.get('projectName')
            descricao_curta = request.form.get('shortDescription')
            descricao_completa = request.form.get('fullDescription')
            categoria_nome = request.form.get('category')
            tecnologias = request.form.get('tech')

            imagem_url = empresa.imagem_perfil_url

            projeto_url = request.form.get('projectUrl')

            if not nome_servico or not descricao_curta or not descricao_completa or not categoria_nome:
                flash('Por favor, preencha todos os campos obrigatórios.', 'danger')
                return render_template('publicar-projeto.html', categorias=categorias)

            categoria = Categoria.query.filter_by(nome_categoria=categoria_nome).first()
            if not categoria:
                # Se a categoria não existe, cria uma nova
                categoria = Categoria(nome_categoria=categoria_nome, slug_categoria=categoria_nome.lower().replace(" ", "-"))
                db.session.add(categoria)
                db.session.commit()

            novo_servico = Servico(
                nome_servico=nome_servico,
                descricao_curta=descricao_curta,
                descricao_servico=descricao_completa,
                categoria_id=categoria.id,
                empresa_id=empresa.id,
                tecnologias=tecnologias,
                imagem_url=imagem_url,
                projeto_url=projeto_url
            )

            try:
                db.session.add(novo_servico)
                db.session.commit()
                flash('Serviço/Projeto publicado com sucesso!', 'success')
                return redirect(url_for('client_profile'))
            except Exception as e:
                db.session.rollback()
                flash(f'Ocorreu um erro ao publicar o serviço/projeto: {str(e)}', 'danger')
                print(f"Erro ao publicar serviço/projeto: {e}")
                return render_template('publicar-projeto.html', categorias=categorias)

        return render_template('publicar-projeto.html', categorias=categorias)

    @app.route('/editar_servico/<int:servico_id>', methods=['GET', 'POST'])
    @login_required_custom
    def editar_servico(servico_id):
        servico = Servico.query.get_or_404(servico_id)
        current_empresa = get_current_logged_in_empresa()

        if not servico.empresa_id == current_empresa.id:
            flash('Você não tem permissão para editar este serviço.', 'danger')
            return redirect(url_for('client_profile'))

        categorias = Categoria.query.all()

        if request.method == 'POST':
            servico.nome_servico = request.form.get('projectName')
            servico.descricao_curta = request.form.get('shortDescription')
            servico.descricao_servico = request.form.get('fullDescription')

            categoria_nome = request.form.get('category')
            categoria = Categoria.query.filter_by(nome_categoria=categoria_nome).first()
            if not categoria:
                # Se a categoria não existe, cria uma nova
                categoria = Categoria(nome_categoria=categoria_nome, slug_categoria=categoria_nome.lower().replace(" ", "-")) # Adicionado slug
                db.session.add(categoria)
                db.session.commit()
            servico.categoria_id = categoria.id

            servico.tecnologias = request.form.get('tech')
            servico.projeto_url = request.form.get('projectUrl')

            try:
                db.session.commit()
                flash('Serviço/Projeto atualizado com sucesso!', 'success')
                return redirect(url_for('client_profile'))
            except Exception as e:
                db.session.rollback()
                flash(f'Ocorreu um erro ao atualizar o serviço/projeto: {str(e)}', 'danger')
                print(f"Erro ao atualizar serviço/projeto: {e}")
                return render_template('editar_servico.html', servico=servico, categorias=categorias)

        return render_template('editar_servico.html', servico=servico, categorias=categorias)

    @app.route('/deletar_servico/<int:servico_id>', methods=['POST'])
    @login_required_custom
    def deletar_servico(servico_id):
        servico = Servico.query.get_or_404(servico_id)
        current_empresa = get_current_logged_in_empresa()

        if not servico.empresa_id == current_empresa.id:
            flash('Você não tem permissão para deletar este serviço.', 'danger')
            return redirect(url_for('client_profile'))

        try:
            db.session.delete(servico)
            db.session.commit()
            flash('Serviço/Projeto deletado com sucesso!', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Ocorreu um erro ao deletar o serviço/projeto: {str(e)}', 'danger')
            print(f"Erro ao deletar serviço/projeto: {e}")

        return redirect(url_for('client_profile'))

    # --- NOVAS ROTAS DA API DE CATEGORIAS ---
    @app.route('/api/categorias', methods=['GET'])
    @login_required_custom
    def get_categorias():
        """Retorna todas as categorias em formato JSON."""
        categorias = Categoria.query.all()
        return jsonify([{'id': c.id, 'name': c.nome_categoria} for c in categorias])

    @app.route('/api/categorias', methods=['POST'])
    @login_required_custom
    def add_categoria():
        """Adiciona uma nova categoria."""
        data = request.get_json()
        if not data or 'name' not in data or not data['name'].strip():
            return jsonify({'error': 'Nome da categoria é obrigatório.'}), 400

        nome_categoria = data['name'].strip()
        
        # Verifica se a categoria já existe (ignorando maiúsculas/minúsculas)
        existing_category = Categoria.query.filter(func.lower(Categoria.nome_categoria) == func.lower(nome_categoria)).first()
        if existing_category:
            return jsonify({'error': 'Esta categoria já existe.'}), 409 # 409 Conflict

        nova_categoria = Categoria(nome_categoria=nome_categoria)
        db.session.add(nova_categoria)
        db.session.commit()
        return jsonify({'id': nova_categoria.id, 'name': nova_categoria.nome_categoria}), 201

    @app.route('/api/categorias/<int:categoria_id>', methods=['DELETE'])
    @login_required_custom
    def delete_categoria(categoria_id):
        """Remove uma categoria pelo ID."""
        categoria = Categoria.query.get(categoria_id)
        if not categoria:
            return jsonify({'error': 'Categoria não encontrada.'}), 404

        # Opcional: Adicionar lógica para não permitir deletar categorias em uso
        servicos_usando_categoria = Servico.query.filter_by(categoria_id=categoria_id).first()
        if servicos_usando_categoria:
            return jsonify({'error': 'Não é possível remover. Esta categoria está sendo usada por um ou mais serviços.'}), 400

        db.session.delete(categoria)
        db.session.commit()
        return jsonify({'message': 'Categoria removida com sucesso.'}), 200
    # --- FIM DAS NOVAS ROTAS ---

    if __name__ == '__main__':
        print("DEBUG: Entrando no bloco __main__.")
        with app.app_context():
            #db.create_all()
            print("DEBUG: Contexto da aplicação ativado.")
            print("As tabelas já foram criadas ou serão criadas se descomentar db.create_all().")

        print("DEBUG: Iniciando o servidor Flask.")
        app.run(debug=True)

except Exception as outer_e:
    print(f"ERRO FATAL GERAL: Ocorreu um erro crítico que impediu o script de iniciar: {outer_e}")
    traceback.print_exc()