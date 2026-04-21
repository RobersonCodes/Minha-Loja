# 🛒 Minha Loja  
### Plataforma de E-commerce Profissional (estilo Amazon)

Aplicação Full Stack desenvolvida com arquitetura profissional, backend escalável e experiência moderna inspirada em grandes plataformas de e-commerce.

Projeto criado para demonstrar boas práticas de desenvolvimento utilizadas no mercado.

---

## 🚀 Visão Geral

Minha Loja é um sistema completo de e-commerce desenvolvido para portfólio profissional.

O projeto simula uma loja online moderna com:

- autenticação segura
- arquitetura escalável
- API REST profissional
- frontend moderno
- organização de código corporativa

---

## ✨ Funcionalidades

### 🔐 Autenticação
- login com JWT
- senha criptografada com bcrypt
- rotas protegidas

### 📦 Produtos
- cadastro de produtos
- edição de produtos
- exclusão de produtos
- listagem de produtos
- categorias
- produtos em destaque

### 🛍 Loja
- carrinho de compras
- favoritos
- layout moderno
- armazenamento local

### 🛠 Admin
- painel administrativo
- métricas do sistema
- gerenciamento de produtos

---

## 🧠 Arquitetura

Arquitetura em camadas seguindo padrão profissional:

controller → service → repository

---

## 🛠 Tecnologias

Backend
- Node.js
- Express
- SQLite
- JWT
- bcrypt
- dotenv

Frontend
- HTML
- CSS
- JavaScript

Ferramentas
- Git
- GitHub
- VS Code

---

## 📡 API

Base URL

/api/v1

Auth
POST /auth/register  
POST /auth/login  

Produtos
GET /products  
GET /products/:id  
POST /products  
PUT /products/:id  
DELETE /products/:id  

Admin
GET /admin/metrics  

---

## ▶️ Como executar

instalar dependências

npm install

executar servidor

npm run dev

abrir frontend

frontend/pages/index.html

---

## 🎯 Objetivo

Demonstrar capacidade de desenvolvimento profissional utilizando arquitetura organizada, boas práticas e API REST.

---

## 👨‍💻 Autor

Roberson André do Amarante de Oliveira

Desenvolvedor focado em backend, APIs REST e arquitetura de software.

---

## ⭐ Melhorias futuras

- pagamentos online
- pedidos
- dashboard
- busca avançada
- upload de imagens
- deploy em nuvem
