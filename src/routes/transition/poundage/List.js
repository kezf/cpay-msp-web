import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Row, Col,DatePicker, Table, Form, Input, Button } from 'antd';
import { getTimeDistance } from '../../../utils/utils';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles1 from '../style.less';
import styles2 from '../../common/List.less';

const styles = {
  ...styles2,
  ...styles1
}
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ transition, loading }) => ({
  transition,
  loading: loading.models.transition,
}))
@Form.create()
export default class SummaryList extends PureComponent {

  state = {
    rangePickerValue: getTimeDistance('7days'),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'transition/fetchPoundage',
      payload: {
        trcansationTimeStart: this.state.rangePickerValue[0].format('YYYY-MM-DD'),
        trcansationTimeEnd: this.state.rangePickerValue[1].format('YYYY-MM-DD'),
      },
    });
  }

  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
    const { dispatch } = this.props;

    dispatch({
      type: 'transition/fetchPoundage',
      payload: {
        trcansationTimeStart: getTimeDistance(type)[0].format('YYYY-MM-DD'),
        trcansationTimeEnd: getTimeDistance(type)[1].format('YYYY-MM-DD'),
      },
    });

  };

  handleRangePickerChange = (rangePickerValue) => {

    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });
    dispatch({
      type: 'transition/fetchPoundage',
      payload: {
        trcansationTimeStart: rangePickerValue[0].format('YYYY-MM-DD'),
        trcansationTimeEnd: rangePickerValue[1].format('YYYY-MM-DD'),
      },
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
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

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'transition/fetchPoundage',
      payload: {
        trcansationTimeStart: this.state.rangePickerValue[0].format('YYYY-MM-DD'),
        trcansationTimeEnd: this.state.rangePickerValue[1].format('YYYY-MM-DD'),
        ...params
      },
    });
  }

  render() {
    const { rangePickerValue} = this.state;
    const {transition:{poundage}, loading} = this.props;
    const { data:{list, pagination},count } = poundage;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const timeExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('7days')} onClick={() => this.selectDate('7days')}>
            近7天
          </a>
          <a className={this.isActive('30days')} onClick={() => this.selectDate('30days')}>
            近30天
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const columns = [
      {
        title: '交易日期',
        dataIndex: 'trcansationTime',

      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
      },
      {
        title: '商户号',
        dataIndex: 'merchantNo',
      },
      {
        title: '交易笔数',
        dataIndex: 'totalTrcansNum',
      },
      {
        title: '交易金额',
        dataIndex: 'totalTrcansationMoney',
        render(val){
          return <span>{Number(val).toFixed(2)}</span>
        }
      },
      {
        title: '手续费',
        dataIndex: 'totalMerFee',
        render(val){
          return <span>{Number(val).toFixed(2)}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (val,record) => (
          <div>
            <Fragment>
              <a href={`/#/merchant/merchantOpen/view/${val}`}>交易明细</a>
            </Fragment>
          </div>),
      },
    ];


    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false} title="手续费汇总统计"
                extra={timeExtra} style={{ marginTop: 24 }}>
            <Row>
              <Col sm={6} xs={24}>
                <Info title="营业款交易金额" value={Number(count.yyTrcansationMoney)?Number(count.yyTrcansationMoney).toFixed(2):'--'} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="营业款手续费" value={Number(count.yyMerFee)?Number(count.yyMerFee).toFixed(2):'--'} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="预收款交易金额" value={Number(count.ysTrcansationMoney)?Number(count.ysTrcansationMoney).toFixed(2):'--'} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="预收款手续费" value={Number(count.ysMerFee)?Number(count.ysMerFee).toFixed(2):'--'} bordered />
              </Col>
            </Row>
          </Card>

          <Card
            bordered={false}
            title="手续费汇总列表"
            style={{ marginTop: 24 }}
          >
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleStandardTableChange}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
