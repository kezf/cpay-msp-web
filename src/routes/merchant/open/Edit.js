import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Radio, Input, Select, Popover, Switch, Cascader } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import ImgUpload from '../../../components/ImgUpload';
import styles from './Edit.less';

const { Option } = Select;

const fieldLabels = {
  merchantType: '开户类型',
  merchantName: '商户全称',
  merchantShortName: '商户简称',
  businessAddr: '商户地址省市区',
  businessAddress: '商户详细地址',
  parentMerchantName: '所属总店',//3
  instName: '所属服务商',
  operatorName: '所属运营机构',//2
  managementContent: '经营类目',
  businessLicense: '营业执照号',//!1
  legalPersonName: '法人代表姓名',
  legalPersonCertificate: '法人代表身份证号',
  contact: '联系人姓名',
  contactMobilePhone: '联系人手机号码',
  contactPhone: '联系人邮箱',
};

const otherLabels = {
  accountTypeName: '账户类型',
  accountCityName: '开户地',
  accountBankNameId: '所属银行',
  accountBankBranchName: '开户行支行',
  accountName: '开户人姓名',
  account: '开户银行卡号',
  singleMinimum: '单笔最小（元)',
  singleMaxnum: '单笔最大(元)',
  dayMaxnum: '日累计最大（元）',
  monthMaxnum: '月累积最大(元)',
  settlementPeriodName: '结算周期'
};


class Edit extends PureComponent {
  state = {
    width: '100%',
    isRegister: null,
  };
  common = {
    city:null,
    bank:null
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    window.addEventListener('resize', this.resizeFooterToolbar);
    dispatch({
      type: 'merchant/fetchView',
      payload: {merchantId:id,type:'edit'},
    });


  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
    this.props.dispatch({
      type: 'merchant/clear',
    });
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }

  handleIsRegister = (value) => {
    this.setState({
      isRegister:value?1:0
    });
  }

  changeAccountCity = (value,bank,city) => {
    if(!value[1]){
      return;
    }
    this.common.city = value;
    if(this.common.bank === null){
      this.common.bank = bank;
    }
    const  {dispatch} = this.props;
    dispatch({
      type: 'merchant/getSubBranch',
      payload: {localBankCode:this.common.bank,province:this.common.city[0],city:this.common.city[1]},
    });

  }
  changeAccountBank = (value,bank,city) => {
    this.common.bank = value;
    if(this.common.city === null){
      this.common.city = city;
    }
    const  {dispatch} = this.props;
    dispatch({
      type: 'merchant/getSubBranch',
      payload: {localBankCode:this.common.bank,province:this.common.city[0],city:this.common.city[1]},
    });

  }

  cityLoad = (selectedOptions) => {

    const  {dispatch} = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'citys/fetch',
      payload: {parentCode:targetOption.value},
      callback:(data) => {
        targetOption.loading = false;
        targetOption.children = data;
        dispatch({
          type:'merchant/setCitysList',
          payload: {citysList:this.props.merchant.citysList}
        });
      }
    });

  }

  accountCityLoad = (selectedOptions) => {

    const  {dispatch} = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'citys/fetchCity',
      payload: {parentCode:targetOption.value},
      callback:(res) => {
        targetOption.loading = false;
        targetOption.children = res;
        dispatch({
          type:'merchant/setAccountCitysList',
          payload: {accountCitysList:this.props.merchant.accountCitysList}
        });
      }
    });

  }


  render() {
    const { changeAccountCity,changeAccountBank } = this;
    const { id } = this.props.match.params;
    const { form, dispatch, submitting, loading,
      merchant: { view,parent,detail,name,citysList,accountCitysList,bankList,subBranch}}  = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const nullNode = (<div style={{display:'none'}}>{null}</div>);

    const displayRender = (label) => {
      return label[1];
    };
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          values.isRegister = this.state.isRegister;
          if(this.state.isRegister){
            values.accountProvinceCode = values.accountAddr[0];
            values.accountCityCode = values.accountAddr[1];
            delete values.accountAddr;
          }
          values.businessProvinceCode = values.businessAddr[0];
          values.businessCityCode = values.businessAddr[1];
          values.businessDistrictCode = values.businessAddr[2];
          delete values.businessAddr;

          values.managementContent = values.managementContent[1];
          values.merchantId = id;
          // submit the values
          dispatch({
            type: 'merchant/edit',
            payload: values,
          });
        }
      });
    };

    const loadData = (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      this.props.dispatch({
        type: 'merchant/fetchDetail',
        payload: {name:targetOption.label,nameType:view.merchantType},
        callback: (data) =>{
          targetOption.loading = false;
          targetOption.children = data;
          dispatch({
            type:'merchant/setName',
            payload: {name:this.props.merchant.name}
          });
        }
      });

    }


    let formList = [
      {type:[],node:(
        <Form.Item label={fieldLabels.merchantType}>
          {getFieldDecorator('merchantType', {
            initialValue: view.merchantType + '',
            rules: [{ required: true, message: '请选择商户类型' }],
          })(
            <Select placeholder="请选择商户类型" disabled>
              <Option value="1">普通店</Option>
              <Option value="2">总店</Option>
              <Option value="3">分店</Option>
            </Select>
          )}
        </Form.Item>
      )},
      {type:[],node:(
        <Form.Item label={fieldLabels.merchantName}>
          {getFieldDecorator('merchantName', {
            initialValue: view.merchantName,
            rules: [{ required: true, message: '请输入商户名称' }],
          })(
            <Input placeholder="请输入商户名称" />
          )}
        </Form.Item>
      )},
      {type:[],node:(
        <Form.Item label={fieldLabels.merchantShortName}>
          {getFieldDecorator('merchantShortName', {
            initialValue: view.merchantShortName,
            rules: [{ required: true, message: '请选择商户简称' }],
          })(
            <Input placeholder="请输入商户简称" />
          )}
        </Form.Item>
      )},
      {type:[],node:(
        <Form.Item label={fieldLabels.instName}>
          {getFieldDecorator('instName', {
            initialValue: view.instName,
            rules: [{ required: true, message: '请输入服务商' }],
          })(
            <Input placeholder="请输入服务商" disabled/>
          )}
        </Form.Item>
      )},
      {type:[],node:(
        <Form.Item label="商户地址">
          {getFieldDecorator('businessAddr', {
            initialValue: [view.businessProvinceCode,view.businessCityCode,view.businessDistrictCode],
            rules: [(rule, value, callback, source, options) => {

              const errors = [];
              if (!value || !value[0] || !value[1]|| !value[2]) {
                errors.push(new Error('请选择商户地址省市区'))
              }
              callback(errors)
            }],
          })(
            <Cascader
              options={citysList}
              loadData={this.cityLoad}
              changeOnSelect
            />
          )}
        </Form.Item>
      )},
      {type:[],node:(
        <Form.Item label={<span style={{height:'14px',display:'inline-block'}}>{null}</span>}>
          {getFieldDecorator('businessAddress', {
            initialValue: view.businessAddress,
            rules: [{ required: true, message: '请输入详细地址' }],
          })(
            <Input placeholder="请输入详细地址"/>
          )}
        </Form.Item>
      )},
      {type:[1,2],node:(
        <Form.Item label={fieldLabels.parentMerchantName}>
          {getFieldDecorator('parentMerchantName', {
            initialValue: view.merchantType,
            rules: [{ required: true, message: '请选择总店' }],
          })(
            <Select placeholder="请选择总店">
              {
                parent.map(function (val,index) {
                  return (<Option key={`merchantType-${index}`} value={val.merchantId}>{val.merchantName}</Option>)
                })
              }

            </Select>
          )}
        </Form.Item>
      )},
      {type:[1,3],node:(
        <Form.Item label={fieldLabels.operatorName}>
          {getFieldDecorator('operatorName', {
            initialValue: view.operatorName,
            rules: [{ required: true, message: '请输入运营机构' }],
          })(
            <Input placeholder="请输入运营机构" disabled/>
          )}
        </Form.Item>
      )},
      {type:[],node:(
        <Form.Item label={fieldLabels.managementContent}>
          {getFieldDecorator('managementContent', {
            initialValue: [detail.name,view.managementContent],
            rules: [(rule, value, callback, source, options) => {
              const errors = [];
              if (!value || !value[0] || !value[1]) {
                errors.push(new Error('请选择经营类目'))
              }
              callback(errors)
            }],
          })(
            <Cascader
              options={name}
              loadData={loadData}
              displayRender={displayRender}
              changeOnSelect
            />
          )}
        </Form.Item>

      )},
      {type:[1],node:(
        <Form.Item label={fieldLabels.businessLicense}>
          {getFieldDecorator('businessLicense', {
            initialValue: view.businessLicense,
            rules: [{ required: true, message: '请输入营业执照号' }],
          })(
            <Input placeholder="请输入营业执照号"/>
          )}
        </Form.Item>
      )},

      {type:[2,3],node:(
        <Form.Item label={<span>营业执照号<em className={styles.optional}>（选填）</em></span>}>
          {getFieldDecorator('businessLicense', {
            initialValue: view.businessLicense,
          })(
            <Input placeholder="请输入营业执照号"/>
          )}
        </Form.Item>
      )},

      {type:[],node:(
        <Form.Item label={<span>组织结构代码<em className={styles.optional}>（选填）</em></span>}>
          {getFieldDecorator('organizationCode', {
            initialValue: view.organizationCode,
          })(
            <Input placeholder="请输入组织结构代码"/>
          )}
        </Form.Item>
      )},
      {type:[],node:(
        <Form.Item label={<span>是否开通收银台</span>}>
          <Switch defaultChecked={view.isRegister+'' === '1'} onChange={this.handleIsRegister}/>
        </Form.Item>
      )},

    ];
    const errors = getFieldsError();
    let fieldLabelsError = {};
    const getErrorInfo = () => {
      if(this.state.isRegister){
        fieldLabelsError = Object.assign({},fieldLabels,otherLabels);
      }else{
        fieldLabelsError = Object.assign({},fieldLabels);
      }
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabelsError[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    const self = this;
    const fee = function () {
      return (<Card title="填写费率及结算信息" className={styles.card} bordered={false}>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={otherLabels.accountTypeName}>
              {getFieldDecorator('accountType', {
                initialValue: view.accountType,
                rules: [{ required: true, message: '请选择账户类型' }],
              })(
                <Select placeholder="请选择账户类型">
                  <Option value="1">对公账号</Option>
                  <Option value="2">对私账号</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={otherLabels.accountCityName}>
              {getFieldDecorator('accountAddr', {
                initialValue: [view.accountProvinceCode,view.accountCityCode],
                rules: [(rule, value, callback, source, options) => {

                  const errors = [];
                  if (!value || !value[0] || !value[1]) {
                    errors.push(new Error('请选择开户地省市'))
                  }
                  callback(errors)
                }],
              })(
                <Cascader
                  options={accountCitysList}
                  loadData={self.accountCityLoad}
                  changeOnSelect
                  onChange={function (value) {
                    changeAccountCity(value,view.accountBankNameId,[view.accountProvinceCode,view.accountCityCode]);
                  }}
                />
              )}
            </Form.Item>

          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={otherLabels.accountBankNameId}>
              {getFieldDecorator('accountBankNameId', {
                initialValue: view.accountBankNameId,
                rules: [{required: true, message: '请选择银行名称' }],
              })(
                <Select
                  onChange={function (value) {
                    changeAccountBank(value,view.accountBankNameId,[view.accountProvinceCode,view.accountCityCode])
                  }}
                  placeholder="请选择所属银行">
                  {
                    bankList.map((val,index)=>{
                      return ( <Option value={val.name} key={index}>{val.name}</Option>);
                    })
                  }


                </Select>
              )}

            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={otherLabels.accountBankBranchName}>
              {getFieldDecorator('accountBankBranchName', {
                initialValue: view.accountBankBranchName?view.accountBankBranchName:'',
                rules: [{ required: true, message: '请选择开户支行' }],
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择开户支行"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    subBranch.map((val)=>{
                      return (<Option value={val.name} key={val.name}>{val.name}</Option>)
                    })
                  }
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={otherLabels.accountName}>
              {getFieldDecorator('accountName', {
                initialValue: view.accountName,
                rules: [{ required: true, message: '请输入开户人姓名' }],
              })(
                <Input placeholder="请输入开户人姓名" />
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={otherLabels.account}>
              {getFieldDecorator('account', {
                initialValue: view.account,
                rules: [{ required: true, message: '请输入开户银行卡号' }],
              })(
                <Input placeholder="请输入开户银行卡号" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={otherLabels.singleMinimum}>
              {getFieldDecorator('singleMinimum', {
                initialValue: view.singleMinimum,
                rules: [{ required: true, message: '请输入单笔最小金额' }],
              })(
                <Input placeholder="请输入单笔最小金额" />
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={otherLabels.singleMinimum}>
              {getFieldDecorator('singleMinimum', {
                initialValue: view.singleMinimum,
                rules: [{ required: true, message: '请输入单笔最大金额' }],
              })(
                <Input placeholder="请输入单笔最大金额" />
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
            <Form.Item label={otherLabels.dayMaxnum}>
              {getFieldDecorator('dayMaxnum', {
                initialValue: view.dayMaxnum,
                rules: [{ required: true, message: '请输入日累计最大金额' }],
              })(
                <Input placeholder="请输入开户银行卡号" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={otherLabels.monthMaxnum}>
              {getFieldDecorator('monthMaxnum', {
                initialValue: view.monthMaxnum,
                rules: [{ required: true, message: '请输入月累计最大金额' }],
              })(
                <Input placeholder="请输入月累计最大金额" />
              )}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <Form.Item label={otherLabels.settlementPeriodName}>
              {getFieldDecorator('settlementPeriod', {
                initialValue: view.settlementPeriod,
              })(
                <Radio.Group>
                  <Radio value="1"> T+1 </Radio>
                  <Radio value="0"> T+0 </Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Card>);
    };

    let rowListCont = [];
    formList = formList.filter(data => data.type.indexOf(view.merchantType) === -1);

    return (
      <PageHeaderLayout
        wrapperClassName={styles.advancedForm}
      >
        <Form layout="vertical" hideRequiredMark>
          <Card loading={loading} title="商户基本信息" className={styles.card} bordered={false}>

            {
              formList.map(function (val,index) {
                if(index%3 === 0){
                  rowListCont = [];
                }
                rowListCont.push(Object.assign({},val));

                if(index%3 === 2 || index === formList.length - 1){
                  return(
                    <Row gutter={16} key={`row-${index}`}>
                      {
                        rowListCont.map(function (item,i){
                          switch (i){
                            case 0:
                              return (
                                <Col lg={6} md={12} sm={24} key={`form0-${index}`}>
                                  {item.node}
                                </Col>
                              );
                            case 1:
                              return (
                                <Col key={`form1-${index}`} xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                                  {item.node}
                                </Col>
                              );
                            case 2:
                              return (
                                <Col key={`form2-${index}`} xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                                  {item.node}
                                </Col>
                              );
                            default:
                              return null;
                          }

                        })
                      }

                    </Row>
                  )

                }

              })
            }
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={<span>上传营业执照<em className={styles.optional}>（选填）</em></span>}>
                  {getFieldDecorator('businessLicenseFile', {
                    initialValue: view.businessLicenseFile,
                  })(
                    <ImgUpload />
                  )}
                </Form.Item>
              </Col>
              {
                view.merchantType !== 3?(
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={<span>上传商户LOGO<em className={styles.optional}>（选填）</em></span>}>
                      {getFieldDecorator('storeLogoUrl', {
                        initialValue: view.storeLogoUrl,
                      })(
                        <ImgUpload />
                      )}
                    </Form.Item>
                  </Col>
                ):nullNode
              }

            </Row>
          </Card>
          <Card loading={loading} title="商户法人信息" className={styles.card} bordered={false}>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.legalPersonName}>
                  {getFieldDecorator('legalPersonName', {
                    initialValue: view.legalPersonName,
                    rules: [{ required: true, message: '请输入法人姓名' }],
                  })(
                    <Input placeholder="请输入法人姓名" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.legalPersonCertificate}>
                  {getFieldDecorator('legalPersonCertificate', {
                    initialValue: view.legalPersonCertificate,
                    rules: [{ required: true, message: '请输入身份证号' }],
                  })(
                    <Input placeholder="请输入身份证号" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card loading={loading} title="商户联系人信息" className={styles.card} bordered={false}>

            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.contact}>
                  {getFieldDecorator('contact', {
                    initialValue: view.contact,
                    rules: [{ required: true, message: '请输入联系人姓名' }],
                  })(
                    <Input placeholder="请输入联系人姓名" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.contactMobilePhone}>
                  {getFieldDecorator('contactMobilePhone', {
                    initialValue: view.contactMobilePhone,
                    rules: [{ required: true, message: '请输入联系人手机号码' }],
                  })(
                    <Input placeholder="请输入联系人手机号码" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.contactPhone}>
                  {getFieldDecorator('contactPhone', {
                    initialValue: view.contactPhone,
                    rules: [{ required: true, message: '请输入联系人邮箱' }],
                  })(
                    <Input placeholder="请输入联系人邮箱" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {
            (this.state.isRegister===null?view.isRegister:this.state.isRegister)?(fee()):(nullNode)
          }
        </Form>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ merchant,citys, loading }) => ({
  merchant,
  citys,
  loading: loading.effects['merchant/fetchView'],
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(Edit));
