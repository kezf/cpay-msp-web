import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider,Radio } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, data } = this.props;
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
      <div>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>

          <Form.Item
            {...formItemLayout}
            label="商户类型"
          >
            {getFieldDecorator('merchantType', {
              initialValue: '1',
              rules: [{ required: true, message: '请选择商户类型' }],
            })(
              <Radio.Group>
                <Radio value="1"> 普通店 </Radio>
                <Radio value="2"> 总店 </Radio>
                <Radio value="3"> 分店 </Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>

      </div>
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step1);
