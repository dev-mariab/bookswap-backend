import { Router } from 'express';
import { Book } from '../models/Livro';
import {
  BookRepository,
  CachedBookRepository,
  IBookRepository,
} from "../repositories/BookRepository";
import {
  PricingContext,
  SalePricingStrategy,
  TradePricingStrategy,
  DonationPricingStrategy,
} from "../strategies/PricingStrategy";

const router = Router();

const repository: IBookRepository = new CachedBookRepository(
  new BookRepository()
);

router.get("/", async (req, res) => {
  try {
    const livros = await repository.findAll();
    res.json({ success: true, data: livros });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro no servidor' });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const livro = await repository.findById(req.params.id);

    if (!livro) {
      return res.status(404).json({ success: false, error: "Livro não encontrado" });
    }

    res.json({ success: true, data: livro });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro no servidor' });
  }
});

router.post("/", async (req, res) => {
  try {
    const { preco, tipo, listingType } = req.body;
    const type = tipo || listingType || 'venda';

    let strategy;
    switch (String(type).toLowerCase()) {
      case "troca":
      case "trade":
        strategy = new TradePricingStrategy();
        break;
      case "doacao":
      case "donation":
        strategy = new DonationPricingStrategy();
        break;
      default:
        strategy = new SalePricingStrategy();
    }

    const context = new PricingContext(strategy);
    const precoFinal = context.executeCalculation(preco);

    const livro = await repository.create({
      ...req.body,
      preco: precoFinal,
    });

    res.status(201).json({ success: true, data: livro });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao criar livro' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { preco, tipo, listingType } = req.body;
    const type = tipo || listingType;

    if (preco !== undefined && type) {
      let strategy;
      switch (String(type).toLowerCase()) {
        case "troca":
        case "trade":
          strategy = new TradePricingStrategy();
          break;
        case "doacao":
        case "donation":
          strategy = new DonationPricingStrategy();
          break;
        default:
          strategy = new SalePricingStrategy();
      }

      const context = new PricingContext(strategy);
      req.body.preco = context.executeCalculation(preco);
    }

    const livro = await repository.update(req.params.id, req.body);

    if (!livro) {
      return res.status(404).json({ success: false, error: 'Livro não encontrado' });
    }

    res.json({ success: true, data: livro });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao atualizar livro' });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await repository.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Livro não encontrado" });
    }

    res.json({ success: true, data: { message: "Livro removido com sucesso" } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erro ao remover livro' });
  }
});

export default router;