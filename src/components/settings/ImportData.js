import React, { useRef, useState, useEffect } from 'react';
import { dbKeys } from '../../constants/general';
import { connect } from 'react-redux';
import { patchSettings } from '../../actions/settings_actions';

function ImportData( {
  patchSettings,
}) {
  const [importedData, setImportedData] = useState({});

  useEffect(() => {
    const validateData = json => {
      for (let i = 0; i < dbKeys.length; ++i) {
        const key = dbKeys[i];

        if (!json[key]) {
          return false;
        }
      }

      return true;
    };

    if (Object.keys(importedData).length) {
      if (validateData(importedData)) {
        patchSettings(importedData.settings[0]);
      } else {
        console.log('invalid data');
      }
    }
  }, [importedData, patchSettings]);

  const filePicker = useRef(null);

  const handleClick = e => {
    filePicker.current.click();
  };

  const handleFile = e => {
    const file = filePicker.current.files[0];

    file.text()
    .then(str => JSON.parse(str))
    .then(json => setImportedData(json));
  };

  return <>
    <button onClick={handleClick}>
      Import Data
    </button>
    <input 
      type="file" 
      accept=".json" 
      ref={filePicker} 
      onChange={handleFile} />
  </>
}

export default connect(null, {
  patchSettings
})(ImportData);
