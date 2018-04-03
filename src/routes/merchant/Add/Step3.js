import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Cascader, Select, Switch, Radio, message } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import ImgUpload from '../../../components/ImgUpload';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};



@Form.create()
class Step3 extends React.PureComponent {
  state = {
    isRegister: 0,
  };
  common = {
    city:null,
    bank:null
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'citys/fetchInit',
    });
    dispatch({
      type: 'merchant/fetchBank',
    });


  }

  changeAccountCity = (value) => {
    if(!value[1]){
      return;
    }
    this.common.city = value;
    if(this.common.bank === null){
      return;
    }
    const  {dispatch} = this.props;
    dispatch({
      type: 'merchant/getSubBranch',
      payload: {localBankCode:this.common.bank,province:this.common.city[0],city:this.common.city[1]},
    });

  }
  changeAccountBank = (value) => {
    this.common.bank = value;
    if(this.common.city === null){
      return;
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
      type: 'citys/fetchCity',
      payload: {parentCode:targetOption.value},
      callback:(res) => {
        targetOption.loading = false;
        targetOption.children = res;
        dispatch({
          type:'citys/set',
          payload: {citysList:this.props.citys.citysList}
        });
      }
    });

  }

  handleIsRegister = (value) => {
    this.setState({
      isRegister:value?1:0
    });
  }

  render() {
    const { changeAccountCity,changeAccountBank } = this;
    const { form, data, dispatch, submitting,merchant:{subBranch,bankList},citys:{citysList}} = this.props;
    const { getFieldDecorator, validateFields } = form;
    const nullNode = (<div style={{display:'none'}}>{null}</div>);

    const onPrev = () => {
      dispatch(routerRedux.push('/merchant/merchantOpen/add/info'));
    };
    const onValidateForm = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          values.isRegister = this.state.isRegister;
          if(this.state.isRegister){
            values.accountProvinceCode = values.accountAddr[0];
            values.accountCityCode = values.accountAddr[1];
            delete values.accountAddr;
          }

          dispatch({
            type: 'merchant/add',
            payload: {
              ...data,
              ...values,
            },
            callback:(res)=>{
              if(res.status+'' === '200'){
                dispatch({
                  type: 'form/saveStepFormData',
                  payload: {
                    isRegister:this.state.isRegister
                  },
                });
                dispatch(routerRedux.push('/merchant/merchantOpen/add/result'));
              }else{
                message.error(data.message);
              }
            }
          });

        }
      });
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

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label={<span>是否开通收银台</span>}>
          <Switch defaultChecked={false} onChange={this.handleIsRegister}/>
        </Form.Item>
        {
          this.state.isRegister?(
            <div>
              <Form.Item {...formItemLayout} label={otherLabels.accountTypeName}>
                {getFieldDecorator('accountType', {
                  rules: [{ required: true, message: '请选择账户类型' }],
                })(
                  <Select placeholder="请选择账户类型">
                    <Select.Option value="1">对公账号</Select.Option>
                    <Select.Option value="2">对私账号</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={<span className="ant-form-item-required">{otherLabels.accountCityName}</span>}>
                {getFieldDecorator('accountAddr', {
                  rules: [(rule, value, callback, source, options) => {

                    const errors = [];
                    if (!value || !value[0] || !value[1]) {
                      errors.push(new Error('请选择开户地省市'))
                    }
                    callback(errors)
                  }],
                })(
                  <Cascader
                    placeholder="请选择开户地省市"
                    options={citysList}
                    loadData={this.cityLoad}
                    changeOnSelect
                    onChange={changeAccountCity}
                  />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.accountBankNameId}>

                {getFieldDecorator('accountBankNameId', {
                  rules: [{ required: true, message: '请选择所属银行' }],
                })(
                  <Select
                    onChange={changeAccountBank}
                    placeholder="请选择所属银行">
                    {
                      bankList.map((val,index)=>{
                        return ( <Select.Option value={val.name} key={index}>{val.name}</Select.Option>);
                      })
                    }


                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.accountBankBranchName}>
                {getFieldDecorator('accountBankBranchName', {
                  rules: [{ required: true, message: '请输入开户行支行' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="请选择开户支行"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      subBranch.map((val)=>{
                        return (<Select.Option value={val.name} key={val.name}>{val.name}</Select.Option>)
                      })
                    }
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.accountName}>
                {getFieldDecorator('accountName', {
                  rules: [{ required: true, message: '请输入开户人姓名' }],
                })(
                  <Input placeholder="请输入开户人姓名" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.account}>
                {getFieldDecorator('account', {
                  rules: [{ required: true, message: '请输入开户银行卡号' }],
                })(
                  <Input placeholder="请输入开户银行卡号" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.singleMinimum}>
                {getFieldDecorator('singleMinimum', {
                  rules: [{ required: true, message: '请输入单笔最小金额' }],
                })(
                  <Input placeholder="请输入单笔最小金额" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.singleMinimum}>
                {getFieldDecorator('singleMinimum', {
                  rules: [{ required: true, message: '请输入单笔最大金额' }],
                })(
                  <Input placeholder="请输入单笔最大金额" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.dayMaxnum}>
                {getFieldDecorator('dayMaxnum', {
                  rules: [{ required: true, message: '请输入日累计最大金额' }],
                })(
                  <Input placeholder="请输入开户银行卡号" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.monthMaxnum}>
                {getFieldDecorator('monthMaxnum', {
                  rules: [{ required: true, message: '请输入月累计最大金额' }],
                })(
                  <Input placeholder="请输入月累计最大金额" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={otherLabels.settlementPeriodName}>
                {getFieldDecorator('settlementPeriod', {
                  initialValue: '1',
                  rules: [{ required: true, message: '请选择结算周期' }],
                })(
                  <Radio.Group>
                    <Radio value="1"> T+1 </Radio>
                    <Radio value="0"> T+0 </Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </div>
          ):nullNode
        }

        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ form,citys, loading, merchant }) => ({
  citys,
  merchant,
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step3);
