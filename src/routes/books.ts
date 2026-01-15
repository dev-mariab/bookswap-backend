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
  const livros = await repository.findAll();
  res.json(livros);
});


router.get("/:id", async (req, res) => {
  const livro = await repository.findById(req.params.id);

  if (!livro) {
    return res.status(404).json({ error: "Livro não encontrado" });
  }

  res.json(livro);
});


router.post("/", async (req, res) => {
  const { title, author, preco, tipo } = req.body;

  let strategy;
  switch (tipo) {
    case "trade":
      strategy = new TradePricingStrategy();
      break;
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

  res.status(201).json(livro);
});

router.put("/:id", async (req, res) => {
  const { preco, tipo } = req.body;

  if (preco !== undefined && tipo) {
    let strategy;
    switch (tipo) {
      case "trade":
        strategy = new TradePricingStrategy();
        break;
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
    return res.status(404).json({ error: "Livro não encontrado" });
  }

  res.json(livro);
});


router.delete("/:id", async (req, res) => {
  const deleted = await repository.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Livro não encontrado" });
  }

  res.json({ message: "Livro removido com sucesso" });
});


export default router;