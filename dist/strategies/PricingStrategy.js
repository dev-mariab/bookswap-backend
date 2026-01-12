"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingContext = exports.DonationPricingStrategy = exports.TradePricingStrategy = exports.SalePricingStrategy = void 0;
class SalePricingStrategy {
    calculatePrice(basePrice) {
        return basePrice;
    }
}
exports.SalePricingStrategy = SalePricingStrategy;
class TradePricingStrategy {
    calculatePrice(basePrice) {
        return 0;
    }
}
exports.TradePricingStrategy = TradePricingStrategy;
class DonationPricingStrategy {
    calculatePrice(basePrice) {
        return 0;
    }
}
exports.DonationPricingStrategy = DonationPricingStrategy;
class PricingContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    executeCalculation(basePrice) {
        return this.strategy.calculatePrice(basePrice);
    }
}
exports.PricingContext = PricingContext;
//# sourceMappingURL=PricingStrategy.js.map