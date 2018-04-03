import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Cascader, Select, Switch, Divider } from 'antd';
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
class Step2 extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'citys/fetchInit',
    });
    dispatch({
      type: 'merchant/fetchParent',
    });
    dispatch({
      type: 'merchant/fetchInst',
    });
    dispatch({
      type: 'merchant/fetchName',
      payload: {merchantType:this.props.data.merchantType},
    });


  }

  loadData = (selectedOptions) => {
    const { dispatch } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'merchant/fetchDetail',
      payload: {name:targetOption.label,nameType:this.props.data.merchantType},
      callback: (res) =>{
        targetOption.loading = false;
        targetOption.children = res;
        dispatch({
          type:'merchant/setName',
          payload: {name:this.props.merchant.name}
        });
      }
    });

  }

  cityLoad = (selectedOptions) => {

    const  {dispatch} = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    dispatch({
      type: 'citys/fetch',
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

  render() {
    const { form, data, dispatch, submitting,citys:{citysList},merchant:{parent,name,inst}} = this.props;
    const { getFieldDecorator, validateFields } = form;
    const nullNode = (<div style={{display:'none'}}>{null}</div>);

    const displayRender = (label) => {
      return label[1];
    };
    const onPrev = () => {
      dispatch(routerRedux.push('/merchant/merchantOpen/add/type'));
    };
    const onValidateForm = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          values.businessProvinceCode = values.businessAddr[0];
          values.businessCityCode = values.businessAddr[1];
          values.businessDistrictCode = values.businessAddr[2];
          values.managementContent = values.managementContent[1];
          values.merchantType = data.merchantType;
          delete values.businessAddr;
          dispatch({
            type: 'form/saveStepFormData',
            payload: {
              ...data,
              ...values,
            },
          });
          dispatch(routerRedux.push('/merchant/merchantOpen/add/confirm'));
        }
      });
    };
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
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label={fieldLabels.merchantName}>
          {getFieldDecorator('merchantName', {
            rules: [{ required: true, message: '请输入商户名称' }],
          })(
            <Input placeholder="请输入商户名称" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={fieldLabels.merchantShortName}>
          {getFieldDecorator('merchantShortName', {
            rules: [{ required: true, message: '请选择商户简称' }],
          })(
            <Input placeholder="请输入商户简称" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={fieldLabels.instName}>
          {getFieldDecorator('instName', {
            rules: [{ required: true, message: '请输入服务商' }],
          })(
            <Select placeholder="请输入服务商">
              {
                inst.map(function (val,index) {
                  return (<Select.Option key={`inst-${index}`} value={val.value}>{val.value}</Select.Option>)
                })
              }

            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span className="ant-form-item-required">商户地址</span>}>
          <div className="group-item">

            <Form.Item>
              {getFieldDecorator('businessAddr', {
                rules: [(rule, value, callback, source, options) => {

                  const errors = [];
                  if (!value || !value[0] || !value[1]|| !value[2]) {
                    errors.push(new Error('请选择商户地址省市区'))
                  }
                  callback(errors)
                }],
              })(
                <Cascader
                  placeholder="请选择商户地址"
                  options={citysList}
                  loadData={this.cityLoad}
                  changeOnSelect
                />
              )}
            </Form.Item>
          </div>
          <div className="group-item">
            <Form.Item>
              {getFieldDecorator('businessAddress', {
                rules: [{ required: true, message: '请输入详细地址' }],
              })(
                <Input placeholder="请输入详细地址"/>
              )}
            </Form.Item>
          </div>


        </Form.Item>
        {
          (data.merchantType != 1 && data.merchantType != 2)?(
            <Form.Item {...formItemLayout} label={fieldLabels.parentMerchantName}>
              {getFieldDecorator('parentMerchantName', {
                rules: [{ required: true, message: '请选择总店' }],
              })(
                <Select placeholder="请选择总店">
                  {
                    parent.map(function (val,index) {
                      return (<Select.Option key={`merchantType-${index}`} value={val.merchantId}>{val.merchantName}</Select.Option>)
                    })
                  }

                </Select>
              )}
            </Form.Item>
          ):nullNode
        }
        {
          data.merchantType != 1 && data.merchantType != 3?(
            <Form.Item {...formItemLayout} label={fieldLabels.operatorName}>
              {getFieldDecorator('operatorName', {
                rules: [{ required: true, message: '请输入运营机构' }],
              })(
                <Input placeholder="请输入运营机构"/>
              )}
            </Form.Item>
          ):nullNode
        }
        <Form.Item {...formItemLayout} label={<span className="ant-form-item-required">{fieldLabels.managementContent}</span>}>
          {getFieldDecorator('managementContent', {
            rules: [(rule, value, callback, source, options) => {
              const errors = [];
              if (!value || !value[0] || !value[1]) {
                errors.push(new Error('请选择经营类目'))
              }
              callback(errors)
            }],
          })(
            <Cascader
              placeholder="请选择经营类目"
              options={name}
              loadData={this.loadData}
              displayRender={displayRender}
              changeOnSelect
            />
          )}
        </Form.Item>
        {
          data.merchantType != 1?(
            <Form.Item {...formItemLayout} label={fieldLabels.businessLicense}>
              {getFieldDecorator('businessLicense', {
                rules: [{ required: true, message: '请输入营业执照号' }],
              })(
                <Input placeholder="请输入营业执照号"/>
              )}
            </Form.Item>
          ):nullNode
        }
        {
          data.merchantType != 2 && data.merchantType != 3?(
            <Form.Item {...formItemLayout} label={<span>营业执照号</span>}>
              {getFieldDecorator('businessLicense', {
              })(
                <Input placeholder="请输入营业执照号"/>
              )}
            </Form.Item>
          ):nullNode
        }
        <Form.Item {...formItemLayout} label={<span>组织结构代码</span>}>
          {getFieldDecorator('organizationCode', {
          })(
            <Input placeholder="请输入组织结构代码"/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout}  label={<span>上传营业执照</span>}>
          {getFieldDecorator('businessLicenseFile', {
          })(
            <ImgUpload />
          )}
        </Form.Item>
        {
          data.merchantType != 3?(
            <Form.Item {...formItemLayout}  label={<span>上传商户LOGO</span>}>
              {getFieldDecorator('storeLogoUrl', {
              })(
                <ImgUpload />
              )}
            </Form.Item>
          ):nullNode
        }
        <Divider style={{ margin: '40px 0 24px' }} />
        <Form.Item {...formItemLayout} label={fieldLabels.legalPersonName}>
          {getFieldDecorator('legalPersonName', {
            rules: [{ required: true, message: '请输入法人姓名' }],
          })(
            <Input placeholder="请输入法人姓名" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={fieldLabels.legalPersonCertificate}>
          {getFieldDecorator('legalPersonCertificate', {
            rules: [{ required: true, message: '请输入身份证号' }],
          })(
            <Input placeholder="请输入身份证号" />
          )}
        </Form.Item>
        <Divider style={{ margin: '40px 0 24px' }} />
        <Form.Item {...formItemLayout} label={fieldLabels.contact}>
          {getFieldDecorator('contact', {
            rules: [{ required: true, message: '请输入联系人姓名' }],
          })(
            <Input placeholder="请输入联系人姓名" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={fieldLabels.contactMobilePhone}>
          {getFieldDecorator('contactMobilePhone', {
            rules: [{ required: true, message: '请输入联系人手机号码' }],
          })(
            <Input placeholder="请输入联系人手机号码" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={fieldLabels.contactPhone}>
          {getFieldDecorator('contactPhone', {
            rules: [{ required: true, message: '请输入联系人邮箱' }],
          })(
            <Input placeholder="请输入联系人邮箱" />
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            下一步
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
}))(Step2);
