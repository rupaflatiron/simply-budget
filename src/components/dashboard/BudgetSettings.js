import React, { useState } from 'react';
import Close from '../../shared/Close';
import UpdateBudget from './UpdateBudget';
import DeleteWrapper from '../../shared/DeleteWrapper';
import { destroyBudget } from '../../actions/budget_actions';
import Archive from './Archive';

/** DELETING A BUDGET DELETES ALL DEPENDENT RECORDS **/
/** THIS IS DEFAULT BEHAVIOR WITH JSON-SERVER BUT NOT **/
/** FOR OTHER FORMS OF DATA STORAGE **/

const Delete = DeleteWrapper(destroyBudget);

function BudgetSettings({ 
  setShowBudgetSettings, 
  budget,
  budget: { name, id }
}) {
  const [remove, setRemove] = useState(false);
  const [archive, setArchive] = useState(false);

  const close = () => setShowBudgetSettings(false);

  return <div className="modal-background budget-settings">
    <div className="modal">
      <Close callback={close} display='X' className="close" />

      <h2>Edit {name}</h2>
      
      <UpdateBudget {...{ budget, close }} />

      <div className="special-buttons">
        <button onClick={() => setArchive(true)} className="archive">
          Archive
        </button>
        <button onClick={() => setRemove(true)} className="delete">
          Delete
        </button>
      </div>
      
      {remove ? <Delete deletable={id} {...{name, setRemove}} /> : null}
      {archive ? <Archive {...{ budget, setArchive }} /> : null}
    </div>
  </div>
}

export default BudgetSettings;
