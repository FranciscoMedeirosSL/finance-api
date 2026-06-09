const { z } = require('zod');
const prisma = require('../config/prisma');

const expenseSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  amount: z.number().positive('Valor deve ser positivo'),
  date: z.string().datetime(),
  type: z.enum(['income', 'expense']),
  description: z.string().optional(),
  categoryId: z.number().int().optional(),
});

exports.list = async (req, res) => {
  try {
    const { type, categoryId, startDate, endDate, page = 1, limit = 10 } = req.query;

    const where = { userId: req.userId };
    if (type) where.type = type;
    if (categoryId) where.categoryId = Number(categoryId);
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.expense.count({ where }),
    ]);

    return res.json({
      data: expenses,
      meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch {
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

exports.create = async (req, res) => {
  try {
    const data = expenseSchema.parse(req.body);
    const expense = await prisma.expense.create({
      data: { ...data, date: new Date(data.date), userId: req.userId },
      include: { category: true },
    });
    return res.status(201).json(expense);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.expense.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: 'Despesa não encontrada.' });

    const data = expenseSchema.partial().parse(req.body);
    if (data.date) data.date = new Date(data.date);

    const updated = await prisma.expense.update({
      where: { id: Number(id) },
      data,
      include: { category: true },
    });
    return res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.expense.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: 'Despesa não encontrada.' });

    await prisma.expense.delete({ where: { id: Number(id) } });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

exports.summary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const y = Number(year || now.getFullYear());
    const m = Number(month || now.getMonth() + 1);

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId, date: { gte: startDate, lte: endDate } },
      include: { category: true },
    });

    const totalIncome = expenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = expenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const byCategory = expenses
      .filter(e => e.type === 'expense')
      .reduce((acc, e) => {
        const key = e.category?.name || 'Sem categoria';
        acc[key] = (acc[key] || 0) + e.amount;
        return acc;
      }, {});

    return res.json({
      period: `${String(m).padStart(2, '0')}/${y}`,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory,
    });
  } catch {
    return res.status(500).json({ error: 'Erro interno.' });
  }
};
