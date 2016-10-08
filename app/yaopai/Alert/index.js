import React from 'react'
import ReactDOM from 'react-dom'
import { TransitionMotion, spring } from 'react-motion'
import _ from 'lodash'
import AlertItem from './AlertItem'
import './alert.css'

function Alert(initList) {
  /* 保存alerts的list */
  const list = initList || []
  const listeners = []
  /* 用于生成alert id的模板 */
  let alertIdTemplate = 1
  /* 监听器token模板 */
  let regTokenTemplate = 1

  const self = this

  const notifyAll = () => {
    const brokenListeners = []
    _.forEach(listeners, (listener) => {
      if (listener.id && _.isFunction(listener.callback)) {
        listener.callback(_.cloneDeep(list))
      } else {
        brokenListeners.push(listener)
      }
    })

    _.forEach(brokenListeners, (broken) => {
      _.remove(listeners, (listener) => listener.id === broken.id)
    })
  }

  const autoRemove = (alertId, delay) => {
    setTimeout(() => self.remove(alertId), delay || 5000)
  }

  const message = (newAlert, delay) => {
    const id = alertIdTemplate++
    list.push(_.merge({ id }, newAlert))
    notifyAll()
    autoRemove(id, delay)
    return id
  }

  /**
   * 获取alert list
  **/
  this.list = () => _.cloneDeep(list)

  /**
   * 增加alert. 默认情况下，词汇表newAlert需要包含以下属性：
   *   content: 提示内容
   *   title：提示标题
   *   animation：提示动画
  **/
  this.add = message
  this.message = message

  /**
   * 移除alert
  **/
  this.remove = (alertId) => {
    let hasRemoved = false
    _.remove(list, (alert) => {
      if (alert.id === alertId) {
        hasRemoved = true
      }
      return alert.id === alertId
    })
    notifyAll()

    return hasRemoved ? alertId : false
  }

  /**
   * 注册监听
  **/
  this.register = (callback) => {
    if (_.isFunction(callback)) {
      const regToken = regTokenTemplate++
      /* 注册监听器 */
      listeners.push({ id: regToken, callback })
      /* 返回监听id */
      return regToken
    }

    /* 注册失败 */
    return false
  }

  /**
   * 注销监听
  **/
  this.unregister = (regToken) => {
    if (regToken) {
      const originalLength = list.length
      return originalLength === _.remove(list, (value) => value.id === regToken).length ? false : regToken
    }

    return false
  }
}

const alert = new Alert()


class AlertContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alerts: [],
      items: [{ key: 'a', size: 10 }, { key: 'b', size: 20 }, { key: 'c', size: 30 }],
    }
  }

  componentDidMount() {
    const self = this
    alert.register((alerts) => self.setState({ alerts }))
  }

  willLeave() {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return { maxHeight: spring(0) }
  }

  render() {
    return (
      <div className="alert-container">

        <TransitionMotion
          willLeave={this.willLeave}
          styles={this.state.alerts.map((alertConfig) => ({
            key: alertConfig.id,
            data: alertConfig,
            style: { maxHeight: 100 },
          }))}
        >
          {
            (styles) => (
              <div>
                {
                  styles.map(({ key, data, style }) => (
                    <AlertItem
                      key={key}
                      id={data.id}
                      fuckHeight={style.maxHeight}
                      content={data.content}
                      title={data.title}
                      type={data.type}
                      animation={data.animation}
                    />
                  ))
                }
              </div>
            )
          }
        </TransitionMotion>
      </div>
    )
  }
}

ReactDOM.render(<AlertContainer />, document.getElementById('alerts'))


export default alert
