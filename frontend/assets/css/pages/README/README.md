🛒 Minha Loja
Plataforma de E-commerce Profissional (estilo Amazon)
<p align="center">

Aplicação Full Stack desenvolvida com arquitetura profissional, backend escalável e experiência moderna de usuário inspirada em grandes plataformas de e-commerce.

Projetada para demonstrar habilidades reais de engenharia de software, boas práticas de desenvolvimento e organização de código em nível profissional.

</p>
🚀 Visão Geral

Minha Loja é um sistema completo de e-commerce criado para simular um ambiente real de produção, aplicando conceitos modernos de desenvolvimento backend e frontend.

O projeto demonstra:

arquitetura em camadas
autenticação segura
design de API REST
frontend modular
organização escalável
simulação de regras de negócio reais

Desenvolvido para evidenciar preparo técnico para oportunidades como:

Desenvolvedor Backend
Desenvolvedor Full Stack
Desenvolvedor de APIs REST

✨ Principais Funcionalidades
🔐 Autenticação e Segurança
autenticação com JWT
criptografia de senha com bcrypt
rotas protegidas
controle de acesso por perfil (admin)
📦 Gestão de Produtos
cadastro de produtos
atualização de produtos
exclusão de produtos
listagem de produtos
detalhes do produto
sistema de categorias
produtos em destaque
simulação de avaliações
🛍 Experiência de Compra
carrinho de compras
sistema de favoritos
persistência no navegador (localStorage)
layout moderno estilo marketplace
estrutura preparada para responsividade
🛠 Painel Administrativo
área administrativa protegida
gerenciamento de produtos
endpoint de métricas
comunicação segura com API
🧠 Arquitetura do Sistema

O projeto segue padrões utilizados em empresas de tecnologia:

separação de responsabilidades
organização modular
arquitetura em camadas
código reutilizável
escalabilidade
Backend
src
 ├── config
 │    └── database.js
 │
 ├── controllers
 │    ├── AuthController.js
 │    ├── ProductController.js
 │
 ├── services
 │    ├── AuthService.js
 │    ├── ProductService.js
 │
 ├── repositories
 │    ├── ProductRepository.js
 │    ├── UserRepository.js
 │
 ├── middlewares
 │    ├── auth.middleware.js
 │    ├── error.middleware.js
 │    ├── not-found.middleware.js
 │
 ├── routes
 │    ├── authRoutes.js
 │    ├── productRoutes.js
 │
 ├── utils
 │    ├── async-handler.js
 │    ├── app-error.js
 │
 ├── app.js
 └── server.js
Frontend
frontend
 ├── pages
 │    ├── index.html
 │    ├── products.html
 │    ├── product.html
 │    ├── cart.html
 │    ├── favorites.html
 │    ├── admin.html
 │
 ├── assets
 │    ├── css
 │    ├── js
 │    ├── images
🛠 Tecnologias Utilizadas
Backend
Node.js
Express
SQLite
JWT
bcrypt
dotenv
Frontend
HTML5
CSS3
JavaScript
estrutura modular
Ferramentas
Git
GitHub
VS Code
Postman
📡 Padrão da API

API REST versionada:

/api/v1
Autenticação

POST

/api/v1/auth/register

POST

/api/v1/auth/login
Produtos

GET

/api/v1/products

GET

/api/v1/products/:id

POST

/api/v1/products

PUT

/api/v1/products/:id

DELETE

/api/v1/products/:id
Admin

GET

/api/v1/admin/metrics
🗄 Estrutura do Banco de Dados

Tabela de produtos:

campo	tipo
id	INTEGER
name	TEXT
price	REAL
old_price	REAL
category	TEXT
image	TEXT
description	TEXT
stock	INTEGER
rating	REAL
reviews_count	INTEGER
featured	INTEGER
badge	TEXT
▶️ Como Executar o Projeto

Clonar repositório:

git clone https://github.com/seu-usuario/minha-loja.git

Instalar dependências:

npm install

Executar servidor:

npm run dev

ou

node src/server.js

Abrir frontend:

frontend/pages/index.html

ou utilizar Live Server no VS Code.

🔐 Exemplo de autenticação

Header da requisição:

Authorization: Bearer TOKEN
📊 Destaques de Engenharia
arquitetura profissional
API REST versionada
autenticação segura
organização modular
código escalável
boas práticas de desenvolvimento
projeto pronto para portfólio
padrão utilizado no mercado
🎯 Foco Profissional

Desenvolvimento Backend
APIs REST
Arquitetura de Software
Full Stack

👨‍💻 Autor

Roberson André do Amarante de Oliveira

Estudante de Desenvolvimento de Sistemas com foco em backend, APIs REST e arquitetura profissional.

Experiência anterior na indústria metalúrgica, trazendo disciplina, organização e foco em qualidade para o desenvolvimento de software.

📌 Melhorias Futuras
integração com pagamento online
sistema de pedidos
dashboard analítico
busca avançada
upload de imagens
recomendação inteligente de produtos
deploy em nuvem
CI/CD
testes automatizados
⭐ Objetivo do Projeto

Demonstrar capacidade de desenvolvimento em nível profissional e contribuir para aplicações escaláveis, organizadas e de alto valor.