import React, { PureComponent, Fragment} from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Popconfirm, Divider, DatePicker, Modal } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
const { RangePicker } = DatePicker;

import styles1 from '../../common/List.less';
import styles2 from '../../common/Edit.less';

const styles = Object.assign({},styles1,styles2);
const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const CashierAddForm = Form.create()(
  class CashierAddForm extends PureComponent{

    handleAdd = (e) => {
      e.preventDefault();
      const { dispatch, form,hideAddModal, handleFormReset,params } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        delete fieldsValue.repassword;
        dispatch({
          type: 'store/addCashier',
          payload: {
            ...fieldsValue,
            merchantId:params.id
          },
          callback:handleFormReset
        })
        hideAddModal();
      });
    }

    render(){
      const { form,hideAddModal,addModalVisible } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="添加收银员"
          visible={addModalVisible}
          onOk={this.handleAdd}
          onCancel={hideAddModal}
          okText="保存"
          cancelText="取消"
        >
          <Form onSubmit={this.handleAdd} layout="horizontal">
            <Form.Item
              {...formItemLayout}
              label="收银员编号"
            >
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入收银员编号' }],
              })(
                <Input placeholder="请输入收银员编号" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="收银员姓名"
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入收银员姓名' }],
              })(
                <Input placeholder="请输入收银员编号" />
              )}
            </Form.Item>
            {/*用于禁止浏览器自动写入密码*/}
            <Input name="password" type="password" style={{display:'none'}} />

            <Form.Item
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input type="password" name="password" placeholder="请输入密码" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="确认密码"
            >
              {getFieldDecorator('repassword', {
                rules: [{ required: true, message: '请重新输入密码' },
                  (rule, value, callback, source, options) =>{
                    const errors = [];
                    if (value !== form.getFieldValue('password')) {
                      errors.push(new Error('密码不一致'))
                    }
                    callback(errors)
                  }],
              })(
                <Input type="password" placeholder="请重新输入密码" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
)
const CashierEditForm = Form.create()(
  class CashierEditForm extends PureComponent{


    handleEdit = (e) => {
      e.preventDefault();
      const { dispatch, form,hideEditModal,editModalId,handleStandardTableChange } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.id = editModalId;
        dispatch({
          type: 'store/editCashier',
          payload: fieldsValue,
          callback:handleStandardTableChange
        })
        hideEditModal();
      });
    }

    render(){
      const { form,hideEditModal,editModalVisible,store:{ cashierObj } } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="添加收银员"
          visible={editModalVisible}
          onOk={this.handleEdit}
          onCancel={hideEditModal}
          okText="保存"
          cancelText="取消"
        >
          <Form onSubmit={this.handleEdit} layout="horizontal">
            <Form.Item
              {...formItemLayout}
              label="收银员编号"
            >
              {getFieldDecorator('code', {
                initialValue:cashierObj.code,
                rules: [{ required: true, message: '请输入收银员编号' }],
              })(
                <Input placeholder="请输入收银员编号" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="收银员姓名"
            >
              {getFieldDecorator('name', {
                initialValue:cashierObj.name,
                rules: [{ required: true, message: '请输入收银员姓名' }],
              })(
                <Input placeholder="请输入收银员编号" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
)
const ChangePwdForm = Form.create()(
  class ChangePwdForm extends PureComponent{

    handleChange = (e) => {
      e.preventDefault();
      const { dispatch, form,hidePwdModal,pwdModalId } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.id = pwdModalId;

        delete fieldsValue.reNewPassword;
        dispatch({
          type: 'store/changePwd',
          payload: fieldsValue,
          callback:function (result) {
            if(result.status !== 'error'){
              hidePwdModal();
            }else{
              form.setFields({
                adminPwd:{
                  errors:[new Error('管理员密码错误')]
                }
              });
            }

          }
        })

      });
    }

    render(){
      const { form,hidePwdModal,pwdModalVisible} = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          title="修改密码"
          visible={pwdModalVisible}
          onOk={this.handleChange}
          onCancel={hidePwdModal}
          okText="保存"
          cancelText="取消"
        >
          <Form onSubmit={this.handleAdd} layout="horizontal">
            <Form.Item
              {...formItemLayout}
              label="管理员密码"
            >
              {getFieldDecorator('adminPwd', {
                rules: [{ required: true, message: '请输入管理员密码' }],
              })(
                <Input placeholder="请输入管理员密码" />
              )}
            </Form.Item>
            {/*用于禁止浏览器自动写入密码*/}
            <Input name="password" type="password" style={{display:'none'}} />

            <Form.Item
              {...formItemLayout}
              label="新密码"
            >
              {getFieldDecorator('newPassword', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input type="password" name="password" placeholder="请输入密码" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="确认密码"
            >
              {getFieldDecorator('reNewPassword', {
                rules: [{ required: true, message: '请重新输入密码' },
                  (rule, value, callback, source, options) =>{
                    const errors = [];
                    if (value !== form.getFieldValue('newPassword')) {
                      errors.push(new Error('密码不一致'))
                    }
                    callback(errors)
                  }],
              })(
                <Input type="password" placeholder="请重新输入密码" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
)

@connect(({ store, loading }) => ({
  store,
  loading: loading.models.store,
}))
@Form.create()
export default class Cashier extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    pwdModalVisible: false,
    pwdModalId:0,
    editModalId:0,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch, match:{params} } = this.props;
    dispatch({
      type: 'store/fetchCashier',
      payload: {merchantId:params.id}
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, match}  = this.props;
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
      type: 'store/fetchCashier',
      payload: {
        ...params,
        merchantId:match.params.id
      },
    });
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  showAddModal = () => {
    this.setState({
      addModalVisible: true,
    });
  }

  showEditModal = (id) => {
    this.setState({
      editModalVisible: true,
      editModalId:id
    });
    this.getCashier(id);
  }

  showPwdModal = (id) => {
    this.setState({
      pwdModalVisible: true,
      pwdModalId:id
    });
  }

  hideAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  }
  hideEditModal = () => {
    this.setState({
      editModalVisible: false,
    });
  }
  hidePwdModal = () => {
    this.setState({
      pwdModalVisible: false,
    });
  }
  getCashier = (id) => {
    this.props.dispatch({
      type: 'store/getCashier',
      payload: {id:id}
    });
  }

  handleFormReset = (o) => {
    const self = o.form?o:this;
    const { form, dispatch,match:{ params } } = self.props;
    form.resetFields();
    self.setState({
      formValues: {},
    });
    dispatch({
      type: 'store/fetchCashier',
      payload: {
        merchantId:params.id,
      },
    });
  }


  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form, match:{ params } } = this.props;

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
        type: 'store/fetchCashier',
        payload: {
          merchantId:params.id,
          ...values
        },
      });
    });
  }




  render() {
    const { store: { cashier }, loading, dispatch, match:{ params } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { list, pagination } = cashier;
    const { showPwdModal,showEditModal,handleStandardTableChange,handleFormReset } = this;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const deleteCashier = (id)=>{
      dispatch({
        type: 'store/deleteCashier',
        payload: {id:id},
        callback: (res) => {
          this.handleStandardTableChange({},{},{})
        }
      });
    }

    const columns = [
      {
        title: '收银员编号',
        dataIndex: 'code',
      },
      {
        title: '收银员姓名',
        dataIndex: 'name',
      },
      {
        title: '交易金额（元）',
        dataIndex: 'trcansationMoney',
        render: (val) => val && Number(val)?Number(val).toFixed(2):0.00
      },
      {
        title: '交易笔数',
        dataIndex: 'trcansationNum'
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (val) => (
          <Fragment>
            <a onClick={function () {
              showPwdModal(val);
            }}>修改密码</a>
            <Divider type="vertical" />
            <a  onClick={function () {
              showEditModal(val);
            }}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm placement="topLeft" title="是否确定删除" onConfirm={function () {
              deleteCashier(val);
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
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={7} sm={24}>
                    <FormItem label="收银员姓名">
                      {getFieldDecorator('searchName')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={7} sm={24}>
                    <FormItem label="收银员编号">
                      {getFieldDecorator('searchCode')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={10} sm={24}>
                    <FormItem label="交易时间区间">
                      {getFieldDecorator('timeRange')(
                        <RangePicker/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
                </div>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showAddModal}>
                添加收银员
              </Button>

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

        <CashierAddForm
          dispatch={dispatch}
          addModalVisible={this.state.addModalVisible}
          params={params}
          handleFormReset={function () {
            handleFormReset(this);
          }}
          hideAddModal={this.hideAddModal}
        />
        <CashierEditForm
          dispatch={dispatch}
          editModalVisible={this.state.editModalVisible}
          hideEditModal={this.hideEditModal}
          editModalId={this.state.editModalId}
          store={this.props.store}
          handleStandardTableChange={function () {
            handleStandardTableChange({
              current:pagination.current,
              pageSize:pagination.pageSize
            },{},{})
          }}
        />
        <ChangePwdForm
          dispatch={dispatch}
          pwdModalVisible={this.state.pwdModalVisible}
          hidePwdModal={this.hidePwdModal}
          pwdModalId={this.state.pwdModalId}

        />
      </PageHeaderLayout>
    );
  }
}
