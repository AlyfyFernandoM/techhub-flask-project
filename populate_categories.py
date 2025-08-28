from app import app, db, Categoria 

def populate_categories():
    with app.app_context():
        required_categories = [
            'IA & Machine Learning',
            'Desenvolvimento Web',
            'Apps Mobile',
            'Design & UX',
            'Segurança',
            'DevOps & Cloud'
        ]

        print("Verificando e adicionando categorias...")
        for cat_name in required_categories:
            # Verifica se a categoria já existe
            existing_category = Categoria.query.filter_by(nome_categoria=cat_name).first()
            if not existing_category:
                # Se não existir, cria e adiciona
                new_category = Categoria(nome_categoria=cat_name)
                db.session.add(new_category)
                print(f"Adicionando categoria: {cat_name}")
            else:
                print(f"Categoria '{cat_name}' já existe. Pulando.")
        
        try:
            db.session.commit()
            print("Categorias verificadas/adicionadas com sucesso!")
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao adicionar categorias: {e}")

if __name__ == '__main__':
    populate_categories()
