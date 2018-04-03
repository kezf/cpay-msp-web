import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select,Radio,Card,Tooltip,Icon } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from '../../common/Edit.less';
import ImgUpload from '../../../components/ImgUpload';

const { Option } = Select;

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

@Form.create()
class BindMp extends React.PureComponent {
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        console.log(values);
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          dispatch(routerRedux.push('/merchant/merchantOpen/add/info'));
        }
      });
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form layout="horizontal">

            <Form.Item
              {...formItemLayout}
              label={
                <span>
                  公众号名称&nbsp;&nbsp;
                  <em className={styles.optional}>
                    <Tooltip title="如：升腾云支付">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入公众号名称' }],
              })(
                <Input placeholder="请输入公众号名称" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              help="请认真填写，这个是微信公众平台中的原始ID"
              label={
                <span>
                  公众号原始Id&nbsp;&nbsp;
                  <em className={styles.optional}>
                    <Tooltip title="如：gh_228491d12345">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('originalId', {
                rules: [{ required: true, message: '请输入公众号原始Id' }],
              })(
                <Input placeholder="请输入公众号原始Id" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="公众号appid"
            >
              {getFieldDecorator('appId', {
                rules: [{ required: true, message: '请输入公众号appid' }],
              })(
                <Input placeholder="请输入公众号appid" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="公众号appsecret"
            >
              {getFieldDecorator('appSecret', {
                rules: [{ required: true, message: '请输入公众号appsecret' }],
              })(
                <Input placeholder="请输入公众号appsecret" />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="公众号是否认证且开通卡券功能"
              help="认证服务号是指每年向微信官方交300元认证费的公众号"
            >
              {getFieldDecorator('isAuth', {
                initialValue: '1',
                rules: [{ required: true, message: '请选择公众号是否认证且开通卡券功能' }],
              })(
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="卡券类别"
            >
              {getFieldDecorator('couponMode', {
                initialValue: '1',
                rules: [{ required: true, message: '请选择卡券类别' }],
              })(
                <Radio.Group>
                  <Radio value="1">平台优惠券</Radio>
                  <Radio value="2">微信优惠券</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout}  label="上传公众号头像">
              {getFieldDecorator('inp', {
                rules: [{ required: true, message: '请上传公众号头像' }],
              })(
                <ImgUpload />
              )}
            </Form.Item>
            <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>返回</Button>
            </Form.Item>
          </Form>

        </Card>
      </PageHeaderLayout>

    );
  }
}

export default connect(({ store }) => ({
  store
}))(BindMp);
