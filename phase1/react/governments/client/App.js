import React from 'react';
import ReactDOM from 'react-dom';
import AddPersonLocation from './components/AddPersonLocation'
import ReadPersonLocation from './components/ReadPersonLocation'
import HistoryPersonHealth from './components/HistoryPersonHealth'
import HistoryPersonLocation from './components/HistoryPersonLocation'
import AddHealthFinance from './components/AddHealthFinance'
import UpdateHealthFinance from './components/UpdateHealthFinance'
import HistoryHealthFinance from './components/HistoryHealthFinance'

'use strict';

const App = () => {
  return (
    <div>
      <div>
        {<AddPersonLocation context='government' />}
      </div>
      <div>
        {<ReadPersonLocation context='government' />}
      </div>
      <div>
        {<HistoryPersonLocation context='government' />}
      </div>
      <br />
      <div>
        {<HistoryPersonHealth context='government' />}
      </div>
      <br />
      <div>
        {<AddHealthFinance context='government' />}
      </div>
      <div>
        {<UpdateHealthFinance context='government' msg1='Add additional money into a specific account' msg2='As new viruses or treatments are discovered, Governments and NGOs may wish to prioritize funding.' />}
      </div>
      <div>
        {<HistoryHealthFinance context='government' />}
      </div>
    </div>
  );
}
export default App;
