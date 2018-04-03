import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Card,Radio,Row,Col,TreeSelect } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../../common/List.less';

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
class institutionTree extends React.PureComponent {
  changeCarrier(){

  }


  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const carrierTree = [{
      label: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [{
        label: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
      }, {
        label: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      label: 'Node2',
      value: '0-1',
      key: '0-1',
    }];
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
      <Row gutter={24}>
        <Col md={8} sm={24}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" href="#/merchant/merchantOpen/add">
                  新增
                </Button>
                <Button icon="pause" type="danger" href="#/merchant/merchantOpen/add">
                  停用
                </Button>
                <Button icon="delete" href="#/merchant/merchantOpen/add">
                  删除
                </Button>

              </div>
            </div>
            <Form.Item>
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={carrierTree}
                placeholder="请选择机构"
                onChange={this.changeCarrier}
              />
            </Form.Item>

          </Card>
        </Col>
        <Col md={16} sm={24}>
          <Card bordered={false}>
            <Form layout="horizontal" hideRequiredMark>

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
          </Card>
        </Col>
      </Row>
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(institutionTree);
