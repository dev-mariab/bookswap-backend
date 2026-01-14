"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("../models"));
const sequelize_1 = require("sequelize");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const { curso, precoMin, precoMax, condicao } = req.query;
        const where = {};
        if (condicao)
            where.condicao = condicao;
        if (precoMin || precoMax) {
            where.preco = {};
            if (precoMin)
                where.preco[sequelize_1.Op.gte] = precoMin;
            if (precoMax)
                where.preco[sequelize_1.Op.lte] = precoMax;
        }
        const anuncios = await models_1.default.Anuncio.findAll({
            include: [{ model: models_1.default.Usuario }],
            where
        });
        res.json(anuncios);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const anuncio = await models_1.default.Anuncio.create(req.body);
        res.status(201).json(anuncio);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=anuncios.js.map