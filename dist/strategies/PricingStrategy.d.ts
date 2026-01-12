export interface PricingStrategy {
    calculatePrice(basePrice: number): number;
}
export declare class SalePricingStrategy implements PricingStrategy {
    calculatePrice(basePrice: number): number;
}
export declare class TradePricingStrategy implements PricingStrategy {
    calculatePrice(basePrice: number): number;
}
export declare class DonationPricingStrategy implements PricingStrategy {
    calculatePrice(basePrice: number): number;
}
export declare class PricingContext {
    private strategy;
    constructor(strategy: PricingStrategy);
    setStrategy(strategy: PricingStrategy): void;
    executeCalculation(basePrice: number): number;
}
//# sourceMappingURL=PricingStrategy.d.ts.map