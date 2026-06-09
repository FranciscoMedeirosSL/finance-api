# 💸 Finance API

Esse projeto nasceu de uma necessidade simples: eu queria entender na prática como funciona uma API REST do zero — autenticação, banco de dados, validação, tudo junto. Então resolvi construir um gerenciador de despesas pessoais, que é um problema real e que qualquer pessoa entende.

É um projeto de estudo, mas feito com cuidado. Cada parte foi pensada para refletir como as coisas funcionam no mundo real.

---

## O que ele faz?

Você cadastra uma conta, faz login e começa a registrar seus gastos e receitas. Dá pra organizar por categoria, filtrar por período, e no final do mês ver um resumo de quanto entrou, quanto saiu e quanto sobrou.

Não tem interface visual — é só a API mesmo. O front-end fica pra uma próxima etapa.

---

## Tecnologias usadas

- **Node.js + Express** — base da aplicação
- **Prisma ORM** — pra conversar com o banco sem escrever SQL na mão
- **SQLite** — banco leve, perfeito pra desenvolvimento
- **JWT** — autenticação com token
- **Zod** — validação dos dados que chegam nas rotas
- **bcryptjs** — pra guardar as senhas de forma segura

---

## Como rodar na sua máquina

```bash
# Clone o projeto
git clone https://github.com/FranciscoMedeirosSL/finance-api.git
cd finance-api

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Abra o .env e coloque uma chave secreta no JWT_SECRET

# Crie o banco de dados
npm run db:migrate

# Suba o servidor
npm run dev
```

Se aparecer `🚀 Servidor rodando em http://localhost:3000`, tá tudo certo.

---

## Estrutura do projeto

```
finance-api/
├── prisma/
│   └── schema.prisma         # Modelos: User, Category, Expense
├── src/
│   ├── config/
│   │   └── prisma.js         # Conexão com o banco
│   ├── controllers/          # Onde fica a lógica de cada recurso
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   └── categoryController.js
│   ├── middlewares/
│   │   └── auth.js           # Verificação do token JWT
│   ├── routes/
│   │   └── index.js          # Todas as rotas em um lugar só
│   └── server.js
├── .env.example
└── package.json
```

---

## Rotas disponíveis

> Todas as rotas abaixo (exceto `/auth`) precisam do token no header:
> `Authorization: Bearer <seu_token>`

### Autenticação
| Método | Rota | O que faz |
|--------|------|-----------|
| POST | `/api/auth/register` | Cria uma conta |
| POST | `/api/auth/login` | Faz login e retorna o token |

### Despesas
| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/api/expenses` | Lista todas as despesas (com filtros) |
| POST | `/api/expenses` | Registra uma despesa ou receita |
| PUT | `/api/expenses/:id` | Atualiza um registro |
| DELETE | `/api/expenses/:id` | Remove um registro |
| GET | `/api/expenses/summary` | Resumo do mês |

**Filtros que você pode usar no GET:**
- `type` → `income` ou `expense`
- `categoryId` → filtra por categoria
- `startDate` / `endDate` → intervalo de datas (formato ISO 8601)
- `page` / `limit` → paginação

### Categorias
| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/api/categories` | Lista suas categorias |
| POST | `/api/categories` | Cria uma categoria |
| DELETE | `/api/categories/:id` | Remove uma categoria |

---

## Exemplos rápidos

**Registrar um gasto:**
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

**Ver o resumo do mês:**
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

---

## O que ainda quero adicionar

- [ ] Testes automatizados com Jest
- [ ] Exportar relatório em CSV
- [ ] Trocar SQLite por PostgreSQL
- [ ] Deploy na Railway ou Render
- [ ] Upload de comprovantes
