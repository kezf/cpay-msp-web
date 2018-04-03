import React, { PureComponent, Fragment} from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './list.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const { RangePicker } = DatePicker;

@connect(({ merchant, loading }) => ({
  merchant,
  loading: loading.models.merchant,
}))
@Form.create()
export default class List extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'merchant/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'merchant/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'merchant/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      if(values.serachTimeStart &&  values.serachTimeEnd){
        values.serachTimeStart = moment(values.timeRange[0]).format('YYYY-MM-DD');
        values.serachTimeEnd = moment(values.timeRange[1]).format('YYYY-MM-DD');
      }

      delete values.timeRange;

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'merchant/fetch',
        payload: values,
      });
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="商户名称">
              {getFieldDecorator('merchantName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="商户号">
              {getFieldDecorator('merchantNo')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="商户名称">
              {getFieldDecorator('merchantName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="商户号">
              {getFieldDecorator('merchantNo')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="申请时间区间">
              {getFieldDecorator('timeRange')(
                <RangePicker
                  onChange={this.handleChartRangePickerChange}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { merchant: { data,operator,inst }, loading } = this.props;

    const { list, pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const columns = [
      {
        title: '商户名称',
        dataIndex: 'merchantName',
      },
      {
        title: '商户号',
        dataIndex: 'merchantNo',
      },
      {
        title: '状态',
        dataIndex: 'merchantStatus',
        filters: [
          {
            text: '开户申请审核中',
            value: 2,
          },
          {
            text: '信息变更审核中',
            value: 4,
          },
        ],
        render(val) {
          return Number(val) === 2?'开户申请审核中':'信息变更审核中';
        },
      },
      {
        title: '运营机构',
        dataIndex: 'operatorName',
        filters: operator,
      },
      {
        title: '服务商',
        dataIndex: 'instName',
        filters: inst,
      },
      {
        title: '联系电话',
        dataIndex: 'contactMobilePhone'
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        sorter: true,
      },
      {
        title: '操作',
        dataIndex: 'merchantId',
        render: (val) => (
          <Fragment>
            <a href={`/#/merchant/review/view/${val}`}>审核</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>

            <Table
              loading={loading}
              rowKey={record => record.key}
              dataSource={list}
              columns={columns}
              pagination={paginationProps}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
