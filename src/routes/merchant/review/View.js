import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, message, Form, Input, Button, Radio, Row, Col,Divider } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './View.less';
import DescriptionList from '../../../components/DescriptionList';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Description } = DescriptionList;

const tabList = [{
  key: 'detail',
  tab: '详情',
}, {
  key: 'review',
  tab: '审核',
}];


@connect(({ merchant,user, loading,terminal }) => ({
  merchant,
  terminal,
  currentUser: user.currentUser,
  loading: loading.effects['merchant/fetchReview'],
  submitting: loading.effects['merchant/add']
}))
@Form.create()
export default class View extends Component {
  state = {
    operationkey: 'detail',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'merchant/fetchView',
      payload: {merchantId:id,type:'view'},
    });
    dispatch({
      type: 'merchant/fetchReview',
      payload: {merchantId:id},
    });
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'terminal/fetch',
      payload: {merchantId:id},
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const {userid,name} = this.props.currentUser;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'merchant/addReview',
          payload: {
            merchantId:id,
            reviewUserId:userid,
            reviewUserName:name,
            ...values
          },
          callback:(data)=>{
            if(data.status == 200){
              message.success(data.message);
              routerRedux.push('/#/merchant/review/list')
            }else{
              message.error(data.message);
            }
          }
        });
      }
    });
  }

  onTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {
    const { merchant: { review,view },terminal:{data}, loading } = this.props;

    const reviewData = review;

    const nullNode = (<div style={{display:'none'}}>{null}</div>);
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const description = (
      <Col xl={16} lg={18} md={24}>
        <DescriptionList className={styles.headerList} size="small" col="2">
          <Description term="申请时间">{moment(view.applyTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
          <Description term="状态">{view.merchantStatusName}</Description>
        </DescriptionList>
      </Col>

    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const terminalColumns = [{
      title: '终端号',
      dataIndex: 'terminalNo',
    }, {
      title: '终端序列号',
      dataIndex: 'deviceSerial',

    }, {
      title: '类型',
      dataIndex: 'businessTypeName',
    }, {
      title: '厂商',
      dataIndex: 'manufName',
    }, {
      title: '终端型号',
      dataIndex: 'terminalModel',

    }, {
      title: '服务商',
      dataIndex: 'instName',

    }, {
      title: '商户名称',
      dataIndex: 'merchantName',

    }, {
      title: '商户号',
      dataIndex: 'merchantNo',

    }];

    const goodsColumns = [{
      title: '审核类型',
      dataIndex: 'reviewTypeName',
    }, {
      title: '申请时间',
      dataIndex: 'applyTime',
      render:val => moment(val).format('YYYY-MM-DD HH:mm:ss')

    }, {
      title: '审核人',
      dataIndex: 'reviewUserName',
    }, {
      title: '审核时间',
      dataIndex: 'reviewTime',
      render:val => val?moment(val).format('YYYY-MM-DD HH:mm:ss'):''
    }, {
      title: '审核结果',
      dataIndex: 'reviewResultName',

    }, {
      title: '审核意见',
      dataIndex: 'reviewOpinion',

    }];

    const contentList = {
      detail:
        <div>
          <Card title="商户信息" style={{ marginBottom: 24 }} bordered={false}>
            <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
              <Description term="开户类型">
                {view.merchantType}
              </Description>
              <Description term="商户全称">{view.merchantName}</Description>
              <Description term="商户简称">{view.merchantShortName}</Description>
              {
                view.merchantType&&Number(view.merchantType) === 3?(
                  <Description term="所属总店">{view.parentMerchantName}</Description>
                ):nullNode
              }
              <Description term="所属服务商">{view.instName}</Description>
              {
                view.merchantType&&Number(view.merchantType) === 2?(
                  <Description term="所属运营机构">{view.operatorName}</Description>
                ):nullNode
              }
              {
                view.merchantType&&Number(view.merchantType) !== 2?(
                  <Description term="商户地址">
                    {view.businessProvinceName + view.businessCityName + view.businessDistrictName + view.businessAddress}
                  </Description>
                ):nullNode
              }

              <Description term="经营类目">{view.managementContent}</Description>
              {
                view.businessLicense?(
                  <Description term="营业执照号">{view.businessLicense}</Description>
                ):nullNode
              }
              {
                view.organizationCode?(
                  <Description term="组织机构代码">{view.organizationCode}</Description>
                ):nullNode
              }
              <Description term="是否开通收银台">{view.isRegisterName}</Description>
              {
                view.businessLicenseUrl?(
                  <Description term="营业执照">1234123421</Description>
                ):nullNode
              }
              {
                view.merchantType&&Number(view.merchantType) !== 3 && view.storeLogoUrl?(
                  <Description term="商户logo">1234123421</Description>
                ):nullNode
              }
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="商户联系人信息" style={{ marginBottom: 32 }}>
              <Description term="法人代表姓名">{view.legalPersonName}</Description>
              <Description term="法人代表身份证号 ">{view.legalPersonCertificate}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="商户法人信息" style={{ marginBottom: 32 }}>
              <Description term="联系人姓名">{view.contact}</Description>
              <Description term="联系人手机号码">{view.contactMobilePhone}</Description>
              <Description term="联系人邮箱">{view.contactPhone}</Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            {
              view.isRegister?(
                <DescriptionList size="large" title="费率及结算信息" style={{ marginBottom: 32 }}>
                  <Description term="账户类型">{view.accountTypeName}</Description>
                  <Description term="开户地">{view.accountProvinceName + ' ' + view.accountCityName}</Description>
                  <Description term="所属银行">{view.accountBankNameId}</Description>
                  <Description term="开户行支行">{view.accountBankBranchName}</Description>
                  <Description term="开户人姓名">{view.accountName}</Description>
                  <Description term="开户银行卡号">{view.account}</Description>
                  <Description term="单笔最小（元）">{view.singleMinimum}</Description>
                  <Description term="单笔最大(元)">{view.singleMaxnum}</Description>
                  <Description term="日累计最大（元）">{view.dayMaxnum}</Description>
                  <Description term="月累积最大(元)">{view.monthMaxnum}</Description>
                  <Description term="结算周期">{view.settlementPeriodName}</Description>
                </DescriptionList>
              ):nullNode

            }

            {
              view.isRegister?(
                <Divider style={{ marginBottom: 32 }} />
              ):nullNode
            }
          </Card>


          {
            data.list.length?(
              <Card title="终端信息" style={{ marginBottom: 24 }} bordered={false}>
                <Table
                  style={{ marginBottom: 24 }}
                  pagination={false}
                  loading={loading}
                  dataSource={data.list}
                  columns={terminalColumns}
                  rowKey="terminalId"
                />
              </Card>

            ):nullNode

          }
          {
            reviewData.length?(
              <Card title="历史审核意见" style={{ marginBottom: 24 }} bordered={false}>
                <Table
                  style={{ marginBottom: 24 }}
                  pagination={false}
                  loading={loading}
                  dataSource={reviewData}
                  columns={goodsColumns}
                  rowKey="reviewId"
                />
              </Card>

            ):nullNode

          }


        </div>,
      review: <Card bordered={false} loading={loading}>
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
        >
          <FormItem
            {...formItemLayout}
            label="审核结果"
          >
            <div>
              {getFieldDecorator('reviewResult', {
                initialValue: '2',
              })(
                <Radio.Group>
                  <Radio value="2">通过</Radio>
                  <Radio value="3">不通过</Radio>
                </Radio.Group>
              )}

            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="审核意见"
          >
            {getFieldDecorator('reviewOpinion', {
              rules: [{
                required: true, message: '请输入审核意见',
              }],
            })(
              <TextArea style={{ minHeight: 32 }} placeholder="请输入审核意见" rows={4} />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交
            </Button>
            <Button style={{ marginLeft: 8 }} href="/#/merchant/review/list">返回</Button>
          </FormItem>
        </Form>
      </Card>,
    };


    return (
      <PageHeaderLayout
        title={`商户号：${view.merchantNo}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={description}
        tabList={tabList}
        onTabChange={this.onTabChange}>

        {contentList[this.state.operationkey]}
      </PageHeaderLayout>
    );
  }
}
