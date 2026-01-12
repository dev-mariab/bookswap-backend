export interface PricingStrategy {
  calculatePrice(basePrice: number): number;
}

export class SalePricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return basePrice;
  }
}

export class TradePricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return 0;
  }
}

export class DonationPricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return 0;
  }
}

export class PricingContext {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  executeCalculation(basePrice: number): number {
    return this.strategy.calculatePrice(basePrice);
  }
}
