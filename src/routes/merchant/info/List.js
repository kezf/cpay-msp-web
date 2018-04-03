import React, { PureComponent, Fragment} from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Popconfirm, Divider, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './list.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

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
      type: 'merchant/fetchInfoList',
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
      type: 'merchant/fetchInfoList',
      payload: {},
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
        type: 'merchant/fetchInfoList',
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }



  renderForm() {
    return this.renderSimpleForm();
  }



  render() {
    const { merchant: { data,inst }, loading, dispatch } = this.props;

    const { list, pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const deleteMerchant = (id) => {
      dispatch({
        type: 'merchant/remove',
        payload: {merchantId:id},
        callback:(data) => {
          if(data.status+'' === '200'){
            message.success(data.message);
            this.handleSearch();
          }else{
            message.error(data.message);
          }
        }
      });
    }

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
        title: '服务商',
        dataIndex: 'instName',
        filters: inst,
      },
      {
        title: '联系电话',
        dataIndex: 'contactMobilePhone'
      },
      {
        title: '是否开通收银台',
        dataIndex: 'isRegister',
        render:(val) => {
          return val?'是':'否';
        }
      },
      {
        title: '操作',
        dataIndex: 'merchantId',
        render: (val) => (
          <Fragment>
            <a href={`/#/merchant/merchantInfo/view/${val}`}>详情</a>
            <Divider type="vertical" />
            <a href={`/#/merchant/merchantInfo/edit/${val}`}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm placement="topLeft" title="是否确定删除" onConfirm={function () {
              deleteMerchant(val);
            }} okText="是" cancelText="否">
              <a href="javascript:;">删除</a>
            </Popconfirm>

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
