function sum(array, selector) {
  return array.reduce((sum, el) => sum + el[selector], 0);
}

function sumExpenditures(expenditures) {
  return sum(expenditures, 'amount');
}

// Overall tracking for a single budget
export function calculateTracking({
  expenditures, 
  budget: { id, limit, currentPeriod, truncated }
}) {
  // const spent = (expenditures[id]) ? 
  //   expenditures[id].reduce((sum, exp) => sum + exp.amount, 0) : 0;

  const spent = expenditures[id] ? sumExpenditures(expenditures[id]) : 0;

  return limit * currentPeriod - truncated - spent;
};

// Overall tracking for many budgets
export function calculateTotalTracking(budgets, expenditures) {
  return budgets.reduce((sum, budget) => 
    sum + calculateTracking({ expenditures, budget }), 
    0);
};

function getCurrentExpenditures(budgetId, currentPeriod, expenditures) {
  const budgetExpenditures = expenditures[budgetId] || [];
  return budgetExpenditures.filter(exp => 
    exp.period === currentPeriod);
}

export function calculatePeriodSpent({
  expenditures, 
  budget: { id, currentPeriod }
}) {
  const currentExpenditures = getCurrentExpenditures(
    id,
    currentPeriod,
    expenditures
  );

  return sumExpenditures(currentExpenditures);
};

// Tracking for a single budget during the current period
// get all expenditures for current period, sum them
// subtract sum from limit
export function calculateRemainingSpend({
  expenditures, 
  budget: { id, limit, currentPeriod }
}) {
  const currentExpenditures = getCurrentExpenditures(
    id,
    currentPeriod,
    expenditures
  );

  return (currentExpenditures.length === 0) ? 
    limit : limit - sumExpenditures(currentExpenditures);
};
