import React from 'react'
import Reflux from 'reflux'

var InfoHeader = require('../infoHeader');
var AuthAction = require('../../actions/AuthAction');
var { NotifyStore, AUTH_MOTE_SUBMIT_AUDIT } = require('../../stores/NotifyStore');

var MultiImageSelect = require('../photographer/multiImageSelect');

import { ROUTE_AUTH, ROUTE_AUTH_RESULT } from '../../routeConfig'

const AuthMote = React.createClass({
  mixins: [Reflux.listenTo(NotifyStore, 'onNotify')],
  onNotify: function(result) {
    if(result.source === AUTH_MOTE_SUBMIT_AUDIT) {
      if(result.success) {
        this.props.history.pushState(null, ROUTE_AUTH_RESULT)
      } else {
        // TODO: notify logic
        this.props.showMessage(result.msg)
      }
    }
  },
  componentWillMount: function() {
    if(this.props.moteAuthed) {
      this.props.history.replaceState(null, ROUTE_AUTH)
    }
  },
  getInitialState: function() {
    return {
      works: [],
    }
  },
  update: function(result) {
    let copyNinja = this.state.works.slice()
    copyNinja.push(result)
    this.setState({
      works: copyNinja,
    })
  },
  remove: function(index) {
    let copyNinja = this.state.works.slice()
    // splice从index起删掉1个数据，这里操作的是原array
    copyNinja.splice(index, 1)
    this.setState({
      works: copyNinja,
    })
  },
  render: function() {
    return (
      <div>
        <InfoHeader
          infoTitle="模特认证"
          rightInfo={this.props.authMote.status}
          infoIconClass="glyphicon glyphicon-camera"
        />
        <form className="form-horizontal" onSubmit={ this.onSubmit }>
          <MultiImageSelect
            ref="works"
            uid="worksSelect"
            labelName="个人作品："
            width="100"
            height="100"
            images={ this.state.works.toString() }
            disabled={ false }
            maxCount={ 10 }
            placeholder="温馨提示：请上传5-10张本人作品，该作品只用于资质审核"
            updateImages={ this.update }
            showMessage={ this.props.showMessage }
            remove={ this.remove }
          />
          <div className="form-group">
            <div className="col-xs-offset-3 col-xs-9">
              <button type="submit" className="btn btn-primary">下一步</button>
            </div>
          </div>
        </form>
      </div>
    )
  },
  onSubmit: function(e) {
    e.preventDefault()
    if(!this.state.works || this.state.works.length === 0) {
      this.props.showMessage('请选择上传的作品！')
      return
    }
    if(this.state.works.length < 5) {
      this.props.showMessage('最少上传5张作品！')
      return
    }
    if(this.state.works.length > 10) {
      this.props.showMessage('最多上传10张作品！')
      return
    }
    AuthAction.submitMoteAudit({
      Works: this.state.works.slice().toString(),
    })
  },
})

export default AuthMote
