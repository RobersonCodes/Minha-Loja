# Arquitetura

O sistema segue arquitetura em camadas.

controller → service → repository

Objetivos:

- separação de responsabilidades
- manutenção facilitada
- escalabilidade
- padronização de código

---

## Estrutura

src/

config
responsável pela conexão com banco

controllers
recebem requisições HTTP

services
regras de negócio

repositories
acesso ao banco de dados

middlewares
autenticação e tratamento de erros

routes
definição de endpoints

utils
funções reutilizáveis