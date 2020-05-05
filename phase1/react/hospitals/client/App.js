import React from 'react';
import ReactDOM from 'react-dom';
import AddPersonHealth from './components/AddPersonHealth'
import UpdatePersonHealth from './components/UpdatePersonHealth'
import HistoryPersonHealth from './components/HistoryPersonHealth'
import ReadPersonHealth from './components/ReadPersonHealth'
import UpdateHealthFinance from './components/UpdateHealthFinance'
import ReadHealthFinance from './components/ReadHealthFinance'
import HistoryHealthFinance from './components/HistoryHealthFinance'

'use strict';

const App = () => {
  return (
    <div>
      <div>
        {<AddPersonHealth context='hospital' />}
      </div>
      <div>
        {<UpdatePersonHealth context='hospital' />}
      </div>
      <div>
        {<ReadPersonHealth context='hospital' />}
      </div>
      <div>
        {<HistoryPersonHealth context='hospital' />}
      </div>
      <br />
      <div>
        {<ReadHealthFinance context='hospital' />}
      </div>
      <div>
        {<UpdateHealthFinance context='hospital' msg1='Consume money from a specific account' msg2='Money can be consumed for a specific Virus, or specific Remediation, or a combination of both.' />}
      </div>
      <div>
        {<HistoryHealthFinance context='hospital' />}
      </div>
    </div>
  );
}
export default App;
