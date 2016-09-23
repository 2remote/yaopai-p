import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'
import facecodeImg from 'image/facecode.png'
import oppositeImg from 'image/opposite.png'
import idShiliImg from 'image/id_shili.png'
/* 组件 */
var ImageInput = require('../account/imageInput');
var TextInput = require('../account/textInput');
var InfoHeader = require('../infoHeader');
/* MVC-API */
var AccountActions = require('../../actions/AccountActions');
var { NotifyStore, CHANGE_REALNAME } = require('../../stores/NotifyStore');

import { ROUTE_AUTH, ROUTE_AUTH_BASIC } from 'util/routeConfig'

/*
 身份证图片上传
 */
var PersonIDImage = React.createClass({
  getInitialState: function() {
    return {
      facecodeDefaultImage : facecodeImg,
      oppositeDefaultImage : oppositeImg,
    }
  },
  getValue: function() {
    var v1 = this.refs.IDPicture1.getValue()
    var v2 = this.refs.IDPicture2.getValue()
    if(v1 && v2 && v1!=this.state.facecodeDefaultImage && v2!=this.state.oppositeDefaultImage) {
      return v1 + ',' + v2
    }else{
      return null
    }
  },
  upload1: function(url) {
    this.props.upload1(url)
  },
  upload2: function(url) {
    this.props.upload2(url)
  },
  render: function() {
    var style = {
      imgId: {
        marginBottom: '14px',
      },
      info: {
        marginLeft: '35px',
        height: '150px',
        paddingTop: '20px',
      },
      label: {
        lineHeight: '150px',
      },
    }
    var IDImages = []
    IDImages[0] = this.state.facecodeDefaultImage
    IDImages[1] = this.state.oppositeDefaultImage
    if(this.props.value) {
      var tmp = this.props.value.split(',')
      if(tmp[0]) {
        IDImages[0] = tmp[0]
      }
      if(tmp[1]) {
        IDImages[1] = tmp[1]
      }
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-3" style={style.label}>身份证正反面：</label>
        <div className="col-xs-9">
          <div className="row" style={style.imgId}>
            <ImageInput
              width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[0]}
              onUpload={this.upload1}
              onError={this.props.showMessage}
              disabled={ false }
              multi_selection={false}
              uid="IDPicture1"
              ref="IDPicture1"
              type="user"/>
            <ImageInput
              width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[1]}
              onUpload={this.upload2}
              onError={this.props.showMessage}
              disabled={this.props.disabled}
              multi_selection={false}
              uid="IDPicture2"
              ref="IDPicture2"
              type="user"/>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <img height="150" width="200" src={idShiliImg} />
            </div>
            <div className="col-xs-8">
              <div style={style.info}>
                照片要求：（需符合以下要求，否则不予审核通过）<br />
                1. 脸部清晰无遮挡；<br />
                2. 身份证全部信息清晰无遮挡；<br />
                3. 照片内容真实有效，不得做任何修改；<br />
                4. 仅用于认证请放心上传；
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

var AuthRealName = React.createClass({
  mixins: [
    Reflux.listenTo(NotifyStore, 'onNotify'),
    History
  ],
  componentWillMount: function() {
    if(!this.props.authTarget) {
      this.props.history.replaceState(null, ROUTE_AUTH)
      return
    }
    if(this.props.realNameComplete) {
      this.props.history.replaceState(null, this.props.authTarget)
    }
  },
  getInitialState: function() {
    return {
      realName: '', // 真实姓名
      idNumber: '', // 证件号
      frontImg: '', // 证件正面
      backImg: '', // 证件反面
    }
  },
  updateRealName: function(real) {
    this.setState({
      realName: real,
    })
  },
  updateIdNumber: function(idNo) {
    this.setState({
      idNumber: idNo,
    })
  },
  updateIDImage1: function(image) {
    if(image) {
      this.setState({
        frontImg: image,
      })
    }
  },
  updateIDImage2: function(image) {
    if(image) {
      this.setState({
        backImg: image,
      })
    }
  },
  goBack: function() {
    this.props.history.pushState(null, ROUTE_AUTH_BASIC)
  },
  render: function() {
    return (
      <div>
        <InfoHeader
          infoTitle="实名信息认证"
          rightInfo={this.props.realName.status}
          infoIconClass="glyphicon glyphicon-camera"
        />
        <form className="form-horizontal" onSubmit={ this.onSubmitRealName }>
          <TextInput
            ref="realName"
            labelName="姓名："
            value={this.state.realName}
            updateValue={this.updateRealName}
            minLength={2}
            disabled={false}
            textClassName="col-xs-5"
            placeholder="请输入您的真实姓名"/>
          <TextInput
            ref="IDNumber"
            labelName="身份证号码："
            value={this.state.idNumber}
            updateValue={this.updateIdNumber}
            minLength={15}
            disabled={false}
            textClassName="col-xs-5"
            placeholder="请输入您的身份证号码"/>
          <PersonIDImage
            ref="personIDImage"
            value={this.state.frontImg + ',' + this.state.backImg}
            upload1={this.updateIDImage1}
            upload2={this.updateIDImage2}
            showMessage={this.props.showMessage}
            disabled={false}
          />
          <div className="form-group">
            <div className="col-xs-offset-3 col-xs-9">
              <button type="button" onClick={ this.goBack } className="btn btn-primary" style={{ marginRight: 5 }}>上一步</button>
              <button type="submit" className="btn btn-default">下一步</button>
            </div>
          </div>
        </form>
      </div>
    )
  },
  onSubmitRealName: function(e) {
    e.preventDefault()
    if(!this.state.realName) {
      this.props.showMessage('真实姓名不能为空')
      return
    }
    if(!this.state.idNumber) {
      this.props.showMessage('证件号不能为空')
      return
    }
    if(!this.state.frontImg || !this.state.backImg) {
      this.props.showMessage('请先上传证件照')
      return
    }
    // really, submit real name info
    AccountActions.changeRealName({
      RealName:this.state.realName,
      IdNumber:this.state.idNumber,
      IdNumberImages:this.state.frontImg + ',' + this.state.backImg,
    })
  },
  onNotify: function(result) {
    if(result.source === CHANGE_REALNAME) {
      if(result.success) {
        this.props.history.pushState(null, this.props.authTarget)
      } else {
        // TODO: notify logic
        this.props.showMessage(result.msg)
      }
    }
  },
});

export default AuthRealName
