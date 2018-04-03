import React from 'react';
import { Cascader } from 'antd';
import { connect } from 'dva';

let getList = true;

@connect(({ citys }) => ({
  citys,
}))

class Citys extends React.Component {


  componentDidMount() {



  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'citys/clear',
    });
  }


  loadData = (selectedOptions) => {

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
          type: 'citys/set',
          payload: {citysList:this.props.citys.citysList},
        });
      }
    });

  }



  render() {
    const  {value:[province,city,area],dispatch,citys:{citysList}} = this.props;
    if(province && city && getList){
      getList = false;
      dispatch({
        type: 'citys/fetchInit',
        payload: {
          provinceCode:province,
          cityCode:city
        },
      });
    }

    return (
      <Cascader
        options={citysList?citysList:[]}
        loadData={this.loadData}
        value={[province,city,area]}
        onChange={this.props.onChange}
        changeOnSelect
      />
    );
  }
}

export default Citys;
