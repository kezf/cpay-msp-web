import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table,Steps } from 'antd';
import classNames from 'classnames';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './View.less';

const { Description } = DescriptionList;
const { Step } = Steps;




@connect(({ merchant,terminal, loading }) => ({
  merchant,
  loading: loading.effects['merchant/fetchView'],
}))
export default class View extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'merchant/fetchView',
      payload: {merchantId:id,type:'view'},
    });
  }


  render() {
    const { merchant: { view}, loading } = this.props;
    const terminal = view.terminal?view.terminal:[];
    const review = view.review?view.review:{};

    const nullNode = (<div style={{display:'none'}}>{null}</div>);

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


    return (
      <PageHeaderLayout>
        {
          (view.merchantStatus == 3 || view.merchantStatus == 6)?(
            <Card title="审核历史" style={{ marginBottom: 24 }} bordered={false}>
              <Steps direction="horizontal" progressDot={true} current={view.merchantStatus==6?2:1}>
                <Step title="创建商户" description={(
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <div>{moment(view.applyTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                  </div>
                )} />
                <Step title={view.review.reviewTypeName} description={(
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <div>{view.review.reviewResultName}</div>
                    <div>{view.review.reviewOpinion}</div>
                  </div>
                )} />
                <Step title="完成" />
              </Steps>
            </Card>

          ):nullNode
        }
        <Card bordered={false} title="基本信息" style={{ marginBottom: 24 }} loading={loading}>

          <DescriptionList size="large">
            <Description term="开户类型">
              {view.merchantTypeName}
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
        </Card>
        <Card bordered={false} title="商户法人信息" style={{ marginBottom: 24 }} loading={loading}>
          <DescriptionList size="large">
            <Description term="法人代表姓名">{view.legalPersonName}</Description>
            <Description term="法人代表身份证号 ">{view.legalPersonCertificate}</Description>
          </DescriptionList>
        </Card>
        <Card bordered={false} title="商户联系人信息" style={{ marginBottom: 24 }} loading={loading}>
          <DescriptionList size="large">
            <Description term="联系人姓名">{view.contact}</Description>
            <Description term="联系人手机号码">{view.contactMobilePhone}</Description>
            <Description term="联系人邮箱">{view.contactPhone}</Description>
          </DescriptionList>
        </Card>
          {

            view.isRegister?(
              <Card style={{ marginBottom: 24 }} title="费率及结算信息" bordered={false} loading={loading}>
                <DescriptionList size="large">
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
              </Card>

            ):nullNode

          }


          {
            terminal.length?(
              <Card bordered={false} style={{ marginBottom: 24 }} loading={loading} title="终端管理">
                <Table
                  pagination={false}
                  loading={loading}
                  dataSource={terminal}
                  columns={terminalColumns}
                  rowKey="terminalId"
                />
              </Card>

            ):nullNode
          }




      </PageHeaderLayout>
    );
  }
}
