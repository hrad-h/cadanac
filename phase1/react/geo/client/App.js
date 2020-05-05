import React from 'react';
import ReactDOM from 'react-dom';
import GetnewPersonLocation from './components/GetnewPersonLocation'
import UpdatePersonLocation from './components/UpdatePersonLocation'

'use strict';

const App = () => {
  return (
    <div>
      <div>
        {<GetnewPersonLocation context='geo' />}
      </div>
      <div>
        {<UpdatePersonLocation context='geo' />}
      </div>
    </div>
  );
}
export default App;
