import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { getRoutes } from '../../../utils/utils';



class Basic extends React.PureComponent {

  render() {
    const { routerData, match } = this.props;
    return (


          <Switch>
            {getRoutes(match.path, routerData).map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )}
            <Redirect exact from="/merchant/review" to="/merchant/review/list" />
          </Switch>
    );
  }
}

export default Basic;
