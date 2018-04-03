import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  List,
  Avatar
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
  Area,
} from '../../components/Charts';
import Trend from '../../components/Trend';
import NumberInfo from '../../components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';

import styles from './Home.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading, home}) => ({
  chart,
  home,
  loading: loading.effects['chart/fetch'],
  activitiesLoading: loading.effects['home/fetchList'],
}))
export default class Home extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('today'),
    chartRangePickerValue: getTimeDistance('7'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
    this.props.dispatch({
      type: 'home/fetchList',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  handleChartRangePickerChange = (chartRangePickerValue) => {
    this.setState({
      chartRangePickerValue,
    });
    let values = {
      trcansationTimeStart:chartRangePickerValue[0],
      trcansationTimeEnd:chartRangePickerValue[1]
    }

    this.props.dispatch({
      type: 'chart/fetchSalesData',
      payload: {
        ...values,
      },
    });
  };

  selectDate = (type,name) => {
    if(name == 'chart'){
      this.setState({
        chartRangePickerValue: getTimeDistance(type),
      });
    }else{
      this.setState({
        rangePickerValue: getTimeDistance(type),
      });
    }


    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });

  };

  isActive(type,name) {
    const value = getTimeDistance(type);
    if(name == 'chart'){
      const { chartRangePickerValue } = this.state;
      if (!chartRangePickerValue[0] || !chartRangePickerValue[1]) {
        return;
      }
      if (
        chartRangePickerValue[0].isSame(value[0], 'day') &&
        chartRangePickerValue[1].isSame(value[1], 'day')
      ) {
        return styles.currentDate;
      }
    }else{
      const { rangePickerValue } = this.state;
      if (!rangePickerValue[0] || !rangePickerValue[1]) {
        return;
      }
      if (
        rangePickerValue[0].isSame(value[0], 'day') &&
        rangePickerValue[1].isSame(value[1], 'day')
      ) {
        return styles.currentDate;
      }
    }

  }

  renderActivities() {
    const {
      home: { infoList },
    } = this.props;
    return infoList.slice(0,5).map((item) => {

      return (
        <List.Item key={item.id} className={styles.infoList}>
          <List.Item.Meta
            title={
              <span>
                <span className={styles.event}>{item.title}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {item.createTimeSt}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading ,activitiesLoading } = this.props;
    const {
      visitData,
      salesData,
      offlineData,
    } = chart;


    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('7')} onClick={() => this.selectDate('7')}>
            近7天
          </a>
          <a className={this.isActive('30')} onClick={() => this.selectDate('30')}>
            近30天
          </a>
        </div>
      </div>
    );

    const salesExtra2 = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('7','chart')} onClick={() => this.selectDate('7','chart')}>
            近7天
          </a>
          <a className={this.isActive('30','chart')} onClick={() => this.selectDate('30','chart')}>
            近30天
          </a>
        </div>
        <RangePicker
          value={this.state.chartRangePickerValue}
          onChange={this.handleChartRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const columns = [
      {
        title: '排名',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '搜索关键词',
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: '用户数',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '周涨幅',
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle="转化率"
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 8,
      style: { marginBottom: 24 },
    };

    return (
      <div>
        <Card bordered={false} bodyStyle={{padding:0,marginBottom:'24px' }}>
          <div className={styles.timeBar}>
            {salesExtra}
          </div>
        </Card>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="交易金额"
              total={yuan(126560)}
              footer={<Field label="交易笔数" value={`${numeral(12423).format('0,0')}`} />}
              contentHeight={46}
            >
              <MiniArea color="#975FE4" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="商户总数"
              total={numeral(8846).format('0,0')}
              footer={<Field label="新增商户" value={numeral(1234).format('0,0')} />}
              contentHeight={46}
            >
              <MiniBar data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="终端总数"
              total={numeral(6560).format('0,0')}
              footer={<Field label="新增终端" value={numeral(1234).format('0,0')} />}
              contentHeight={46}
            >
              <MiniBar data={visitData} color="#13C2C2"/>
            </ChartCard>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
              <div className={styles.salesCard}>
                <Tabs tabBarExtraContent={salesExtra2} size="large" tabBarStyle={{ marginBottom: 24 }}>
                  <TabPane tab="交易金额" key="sales">
                    <div className={styles.salesBar}>
                      <Area line height={347} title="交易金额" data={salesData} />
                    </div>
                  </TabPane>
                  <TabPane tab="交易笔数" key="views">
                    <div className={styles.salesBar}>
                      <Bar height={347} title="交易笔数" data={salesData} />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="系统公告"
              loading={activitiesLoading}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles.activitiesList}>
                  {this.renderActivities()}
                </div>
              </List>
            </Card>
          </Col>
        </Row>


      </div>
    );
  }
}
