import express from 'express';
import db from '../models';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { curso, precoMin, precoMax, condicao } = req.query as any;
    const where: any = {};

    if (condicao) where.condicao = condicao;
    if (precoMin || precoMax) {
      where.preco = {};
      if (precoMin) where.preco[Op.gte] = precoMin;
      if (precoMax) where.preco[Op.lte] = precoMax;
    }

    const anuncios = await db.Anuncio.findAll({
      include: [{ model: db.Usuario }],
      where
    });
    res.json(anuncios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const anuncio = await db.Anuncio.create(req.body);
    res.status(201).json(anuncio);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;