import React, { useState, useEffect } from 'react';
import './dashboard/CreateBudget';
import CreateBudget from './dashboard/CreateBudget';
import Budgets from './dashboard/Budgets';
import Total from './dashboard/Total';
import { fetchBudgets } from '../actions/budget_actions';
import Settings from './dashboard/Settings';
import { connect } from 'react-redux';

// ADD ARCHIVING

function Dashboard({ selectBudget, budgets, fetchBudgets }) {
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleShowSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const updateSettingsButton = () => (showSettings) ? 'Close Settings' : 'Show Settings';

  const displaySettings = () => (showSettings) ? <Settings setShowSettings={setShowSettings} /> : '';

  return (
    <div>
      {/* <CreateBudget setBudgets={setBudgets} /> */}
      <Budgets budgets={budgets} />
      {/*<Total budgets={budgets} />
      {displaySettings()}
      <button onClick={handleShowSettingsClick}>{updateSettingsButton()}</button> */}
    </div>
  )
}

const mapStateToProps = state => ({
  budgets: state.budget.budgets
});

export default connect(mapStateToProps, { fetchBudgets })(Dashboard);