"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const health_1 = __importDefault(require("./routes/health"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', health_1.default);
app.get('/', (req, res) => {
    res.json({
        message: '📚 BookSwap Academy API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            docs: 'Em breve...',
        },
        environment: process.env.NODE_ENV,
        database: process.env.DB_NAME,
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.originalUrl,
        availableRoutes: ['/', '/api/health'],
    });
});
app.listen(PORT, () => {
    console.log(`
  BOOKSWAP ACADEMY
  ====================
  Servidor rodando na porta: ${PORT}
  Ambiente: ${process.env.NODE_ENV}
  Banco: ${process.env.DB_NAME}
  
  Health Check: http://localhost:${PORT}/api/health
  Página inicial: http://localhost:${PORT}/
  `);
});
exports.default = app;
//# sourceMappingURL=server.js.map