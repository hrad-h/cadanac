import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';

'use strict';

export const Routes = () => (
  <Switch>
    <Route exact path='/' component={App} />
    <Route exact path='/#/' component={App} />
  </Switch>
);
export default Routes;
