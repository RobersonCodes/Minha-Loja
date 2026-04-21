# Autenticação

O sistema utiliza JWT para autenticação.

Fluxo:

1 usuário realiza login
2 servidor gera token
3 cliente envia token nas requisições protegidas

Header:

Authorization: Bearer TOKEN

---

Rotas protegidas:

POST /products
PUT /products/:id
DELETE /products/:id
GET /admin/metrics