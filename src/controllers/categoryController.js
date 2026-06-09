const { z } = require('zod');
const prisma = require('../config/prisma');

const categorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (use hex, ex: #ff5733)').optional(),
});

exports.list = async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { userId: req.userId },
    include: { _count: { select: { expenses: true } } },
  });
  return res.json(categories);
};

exports.create = async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({
      data: { ...data, userId: req.userId },
    });
    return res.status(201).json(category);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    if (err.code === 'P2002') return res.status(409).json({ error: 'Categoria já existe.' });
    return res.status(500).json({ error: 'Erro interno.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.category.findFirst({
      where: { id: Number(id), userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: 'Categoria não encontrada.' });

    await prisma.category.delete({ where: { id: Number(id) } });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: 'Erro interno.' });
  }
};
