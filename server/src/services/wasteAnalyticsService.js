import InventoryTransaction from "../models/InventoryTransaction.js";
import Sale from "../models/Sale.js";

export const getWasteAnalytics = async (shopId) => {
  const transactions = await InventoryTransaction.find({ shopId });

  let totalWasteValue = 0;
  let discountRecovery = 0;
  let exchangeRecovery = 0;
  const wastedProductMap = {};

  transactions.forEach((tx) => {
    if (tx.type === "WASTE") {
      totalWasteValue += tx.costValue || 0;
      wastedProductMap[tx.productName] = (wastedProductMap[tx.productName] || 0) + (tx.costValue || 0);
    } else if (tx.type === "DISCOUNT_SALE") {
      discountRecovery += tx.recoveredValue || 0;
    } else if (tx.type === "EXCHANGE") {
      exchangeRecovery += tx.recoveredValue || 0;
    }
  });

  const totalRecovered = discountRecovery + exchangeRecovery;
  const totalPotentialLoss = totalWasteValue + totalRecovered;
  const wasteReductionPercent = totalPotentialLoss > 0
    ? Math.round((totalRecovered / totalPotentialLoss) * 100)
    : 0;

  const topWastedProducts = Object.entries(wastedProductMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return {
    totalWasteValue,
    totalRecovered,
    discountRecovery,
    exchangeRecovery,
    wasteReductionPercent,
    topWastedProducts,
    impactSummary: `You prevented ₹${totalRecovered.toLocaleString()} worth of inventory from becoming waste this month.`,
  };
};
