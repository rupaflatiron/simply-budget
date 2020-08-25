import { calculatePeriod } from './calculate';
import { formatDate } from './format';

const baseUrl = 'http://localhost:8000';
const budgetsUrl = `${baseUrl}/budgets`;
const settingsUrl = `${baseUrl}/settings/1`;
const expendituresUrl = `${baseUrl}/expenditures`;
const budgetExpendituresUrl = id => `${baseUrl}/budgets/${id}/expenditures`;

function createOptions(method, body={}) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

function generalFetch(url, options) {
  return fetch(url, options)
    .then(res => res.json());
}

function changeData(url, method, body={}) {
  const options = createOptions(method, body);

  return generalFetch(url, options);
}

function makeDate() {
  const date = new Date();

  return formatDate(date);

  // return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function getBudgets() {
  return generalFetch(budgetsUrl);
};

export function createBudget({ name, currency, frequency, limit, date = null }) {
  const startDate = date || makeDate();

  const budgetObj =  {
    name,
    currency,
    frequency,
    limit,
    startDate,
    truncated: 0,
    currentPeriod: calculatePeriod(makeDate(), startDate, frequency)
  };

  return changeData(budgetsUrl, 'POST', budgetObj);
};

export function updateBudget(id, budget) {
  const patchUrl = `${budgetsUrl}/${id}`;
  return changeData(patchUrl, 'PATCH', budget);
};

export function deleteBudget(id) {
  const deleteUrl = `${budgetsUrl}/${id}`;
  return changeData(deleteUrl, 'DELETE');
};

export function getSettings() {
  return generalFetch(settingsUrl);
};

export function updateSettings(settings) {
  return changeData(settingsUrl, 'PATCH', settings);
};

export function getExpenditures() {
  return generalFetch(expendituresUrl);
};

export function getBudgetExpenditures(id) {
  return generalFetch(budgetExpendituresUrl(id));
};

export function updateExpenditure(id, expenditure) {
  return changeData(`${expendituresUrl}/${id}`, 'PATCH', expenditure);
};

export function deleteExpenditure(id) {
  const deleteUrl = `${expendituresUrl}/${id}`;
  return changeData(deleteUrl, 'DELETE');
};

// needs a budget
export function createExpenditure(expenditure, { id, startDate, frequency }) {
  const options = {
    ...expenditure,
    budgetId: id,
    date: makeDate()
  };

  options.period = calculatePeriod(options.date, startDate, frequency);
  
  return makeExpenditure(options);
};

export function makeExpenditure(expenditure) {
  return changeData(expendituresUrl, 'POST', expenditure);
};

export function updateBudgetCurrentPeriod(budget) {
  budget.currentPeriod =  calculatePeriod(
    makeDate(), 
    budget.startDate, 
    budget.frequency
  );

  return updateBudget(budget.id, budget);
};