import React, { useState, useEffect } from 'react';
import { handleChange, handleAmountChange } from '../../utils/handlers';
import { newBudget } from '../../actions/budget_actions';
import { connect } from 'react-redux';
import Error from '../../shared/Error';

function CreateOptions({ setShowOptions, budgetName, setBudgetName, newBudget, defaultCurrency }) {
  const [currency, setCurrency] = useState('');
  const [limit, setLimit] = useState('');
  const [frequency, setFrequency] = useState('week');

  useEffect(() => {
    setCurrency(defaultCurrency);
  }, []);

  const closeOptions = () => {
    setBudgetName('');
    setShowOptions(false);
  };

  const saveOptions = e => {
    e.preventDefault();

    if (currency && limit && budgetName) {
      const budgetSettings = { currency, frequency, limit: parseFloat(limit) };
      budgetSettings.name = budgetName;
      newBudget(budgetSettings);
      closeOptions();
    }
  };

  const handleLimit = e => {
    handleAmountChange(e, setLimit);
  };

  const showError = () => !(currency && limit && budgetName);

  return (
    <form className="new-budget-options" onSubmit={saveOptions}>
      <h2>{budgetName}</h2>
      <span>I want to spend </span>
      <input 
        type="text"
        placeholder="$" 
        id="new-budget-currency" 
        onChange={e => handleChange(e, setCurrency)}
        value={currency}
        maxLength="2" />
      <input 
        type="text" 
        placeholder="100" 
        id="new-budget-limit"
        onChange={handleLimit}
        value={limit} />
      <span>per </span>
      <select onChange={e => handleChange(e, setFrequency)} value={frequency}>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
      <input type="submit" value="Save Budget" />
      <button onClick={closeOptions}>Cancel</button>
      <Error msg="All details are required" condition={showError()} />
    </form>
  )
}

const mapStateToProps = state => ({
  defaultCurrency: state.settings['default-currency']
});

export default connect(mapStateToProps, { newBudget })(CreateOptions);
