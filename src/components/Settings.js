import React, { useState } from 'react';
import '../styles/settings.css';
import { patchSettings } from '../actions/settings_actions';
import { connect } from 'react-redux';
import BackButton from '../shared/BackButton';
import { chooseDashboard } from '../actions/ui_actions';
import Form from '../shared/Form';
import SubmitButton from '../shared/SubmitButton';
import TextInput from '../shared/TextInput';
import TextInputWithRegex from '../shared/TextInputWithRegex';
import Error from '../shared/Error';
import ExportData from './settings/ExportData';
import ImportData from './settings/ImportData';
import Button from '../shared/Button';
import CurrencyInput from '../shared/CurrencyInput';
import useJumpToTop from '../hooks/useJumpToTop';

function Settings({ 
  settings, 
  patchSettings, 
  chooseDashboard
}) {
  const [currency, setCurrency] = useState(settings['default-currency']);
  const [maxItems, setMaxItems] = useState(settings['max-length']);
  const [quickAdd, setQuickAdd] = useState(settings['quick-add']);

  useJumpToTop([settings]);

  const parseMaxItems = () => parseInt(maxItems, 10);

  const isValidLineItems = () => parseMaxItems() >= 10;

  const handleSubmit = e => {
    if (isValidLineItems()) {
      patchSettings({
        "default-currency": currency,
        "max-length": parseMaxItems(),
        "quick-add": quickAdd
      })
      .then(_ => chooseDashboard());
    }
  };

  const handleQuickAdd = e => {
    e.preventDefault();
    setQuickAdd(!quickAdd);
  };

  return <>
    <div className="banner">
      <BackButton callback={chooseDashboard} />

      <h2>Settings</h2>
    </div>

  <div className="settings">    
    <Form callback={handleSubmit}>
      <div>
        <label htmlFor="default-currency">
          Default Currency
        </label>

        <CurrencyInput callback={setCurrency} value={currency} id="default-currency" />
      </div>

      <div>
        <label htmlFor="max-items">
          Maximum Number of Line Items
        </label>
          <TextInputWithRegex
            value={maxItems}
            expr={/^\d+$/}
            callback={setMaxItems}
            id="max-items" />
      </div>
      <p className="explainer">
        Once a budget goes over the maximum, items will be deleted in first-in-first-out order, 
        one whole period at a time.
      </p>

      <div>
        <label htmlFor="quick-add">
          Enable Quick Add
        </label>
        <Button display={quickAdd ? 'On' : 'Off'} callback={handleQuickAdd} className="quick-add" />
      </div>
      <p className="explainer">
        When Quick Add is On, clicking the "+" button to add a new expense to a budget will 
        immediately add the expense without a title.
      </p>

      <div>
        <label htmlFor="notification">
          Notification
        </label>
        <TextInput
          placeholder="Native Only"
          id="notification"
          disabled={true} />
      </div>

      <Error 
        msg="Maximum number of line items must be 10 or more" 
        condition={!isValidLineItems()} />

      <SubmitButton value="Save" className="large-submit" />
    </Form>    

    <div className="buttons">
      <ExportData />
      <ImportData />
    </div>
  </div>
  </>
}

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(mapStateToProps, { patchSettings, chooseDashboard })(Settings);
