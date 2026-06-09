# 💸 Expense API

API REST para gerenciamento de despesas pessoais, com autenticação JWT, categorias e resumo mensal.

## 🛠️ Tecnologias

- **Node.js** + **Express**
- **Prisma ORM** (SQLite em desenvolvimento)
- **JWT** para autenticação
- **Zod** para validação de dados
- **bcryptjs** para hash de senhas

## 📁 Estrutura

```
expense-api/
├── prisma/
│   └── schema.prisma       # Modelos do banco de dados
├── src/
│   ├── config/
│   │   └── prisma.js       # Instância do Prisma Client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   └── categoryController.js
│   ├── middlewares/
│   │   └── auth.js         # Verificação do JWT
│   ├── routes/
│   │   └── index.js        # Todas as rotas
│   └── server.js
├── .env.example
└── package.json
```

## 🚀 Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/expense-api.git
cd expense-api

# 2. Instale as dependências
npm install

# 3. Configure o .env
cp .env.example .env
# Edite o .env com sua JWT_SECRET

# 4. Execute as migrations
npm run db:migrate

# 5. Inicie o servidor
npm run dev
```

## 🔐 Autenticação

Todas as rotas (exceto `/auth`) exigem o header:
```
Authorization: Bearer <token>
```

## 📋 Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastrar usuário |
| POST | `/api/auth/login` | Login |

### Despesas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/expenses` | Listar (com filtros) |
| POST | `/api/expenses` | Criar despesa/receita |
| PUT | `/api/expenses/:id` | Atualizar |
| DELETE | `/api/expenses/:id` | Remover |
| GET | `/api/expenses/summary` | Resumo mensal |

#### Filtros disponíveis (GET /expenses)
- `type` — `income` ou `expense`
- `categoryId` — ID da categoria
- `startDate` / `endDate` — intervalo de datas (ISO 8601)
- `page` / `limit` — paginação

### Categorias
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categories` | Listar categorias |
| POST | `/api/categories` | Criar categoria |
| DELETE | `/api/categories/:id` | Remover categoria |

## 📦 Exemplos de requisição

### Criar despesa
```json
POST /api/expenses
{
  "title": "Supermercado",
  "amount": 250.90,
  "date": "2026-06-09T00:00:00.000Z",
  "type": "expense",
  "categoryId": 1
}
```

### Resumo mensal
```
GET /api/expenses/summary?month=6&year=2026
```
```json
{
  "period": "06/2026",
  "totalIncome": 3000.00,
  "totalExpense": 1450.00,
  "balance": 1550.00,
  "byCategory": {
    "Alimentação": 600.00,
    "Transporte": 200.00
  }
}
```

## 🔮 Possíveis melhorias futuras

- [ ] Testes com Jest/Supertest
- [ ] Upload de comprovantes (multer)
- [ ] Exportar relatório em PDF/CSV
- [ ] Trocar SQLite por PostgreSQL em produção
- [ ] Deploy na Railway ou Render
