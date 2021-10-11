import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import TradePage from './pages/TradePage';
import OpenOrdersPage from './pages/OpenOrdersPage';
import React from 'react';
import BalancesPage from './pages/BalancesPage';
import ConvertPage from './pages/ConvertPage';
import BasicLayout from './components/BasicLayout';
import ListNewMarketPage from './pages/ListNewMarketPage';
import NewPoolPage from './pages/pools/NewPoolPage';
import PoolPage from './pages/pools/PoolPage';
import PoolListPage from './pages/pools/PoolListPage';
import { getTradePageUrl } from './utils/markets';

export function Routes() {
  return (
    <>
      <HashRouter basename={'/'}>
        <BasicLayout>
          <Switch>
            <Route exact path="/">
              <Redirect to={getTradePageUrl()} />
            </Route>
            <Route exact path="/market/:marketAddress">
              <TradePage />
            </Route>
            <Route exact path="/convert" component={ConvertPage} />
          </Switch>
        </BasicLayout>
      </HashRouter>
    </>
  );
}
