import React from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  render() {
    const { dispatch, data } = this.props;
    const onFinish = () => {
      window.location = '/#/merchant/merchantOpen/list';
    };

    const actions = (
      <div>
        <Button type="primary" onClick={onFinish}>
          返回列表
        </Button>
      </div>
    );
    return (
      <Result
        type="success"
        title="商户创建成功"
        description={data.isRegister?'您的资料已提交，我们将在7个工作日内进行审核':''}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step3);
