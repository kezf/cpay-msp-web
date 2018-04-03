import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Icon, List, Tag } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './List.less';

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.list,
}))
export default class StoreList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'store/fetch',

    });
  }

  goView = (id) => {
    this.props.dispatch(routerRedux.push(`/store/view/${id}`));
  }

  handleFormSubmit = (value) => {
    if(value === ''){
      this.props.dispatch({
        type: 'store/fetch',

      });
    }else{
      this.props.dispatch({
        type: 'store/fetch',
        payload: {merchantName:value}
      });
    }
  }

  render() {
    const { store: { list }, loading } = this.props;
    const { goView } = this;
    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入门店名称"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmit}
          style={{ width: 522 }}
        />
      </div>
    );


    return (
      <PageHeaderLayout
        content={mainSearch}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.merchantId}>
                <Card hoverable className={styles.card}
                      actions={[
                        <a href={`/#/store/edit/${item.merchantId}`}>修改</a>,
                        <a href={`/#/store/cashier/${item.merchantId}`}>收银员管理</a>,
                        <a href={`/#/store/bindMp/${item.merchantId}`}>绑定公众号</a>
                      ]}>
                  <Card.Meta
                    onClick={function () {
                      goView(item.merchantId);
                    }}
                    avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    title={(<div>
                      <a href="#">{`${item.merchantName}${item.merchantType==2?'（总店）':''}`}</a>
                      {item.isRegister?(<Tag color="green" style={{float:'right'}}><Icon type="check-circle" />  收银台</Tag>):
                        null}
                    </div>)}
                    description={(
                      <div>

                        <div className={styles.item}>
                          <div>
                            <Icon type="phone" /> {item.contactMobilePhone}
                          </div>
                          <div>
                            <Icon type="environment-o" />
                            {`  ${item.businessProvinceName}${item.businessCityName}${item.businessDistrictName}${item.businessAddress}`}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
