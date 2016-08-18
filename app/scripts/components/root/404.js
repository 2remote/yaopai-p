import React from 'react'

const NF404 = React.createClass({
  render: function() {
    return (
      <div>
          <div style={{
            margin:'100px auto 0 auto',
            width:'450px',
            height:'300px',
            background:"url('../../img/404.png') no-repeat",
            backgroundSize:'contain'
          }}>

          </div>

        <h3 style={{textAlign:'center'}}>页面找不到了，喵~</h3>
        <p style={{textAlign:'center'}}>哼~ 我现在就去挠程序员！让他赶紧找回这个页面~</p>
        <a style={{textAlign:'center',display:'block'}} href="http://m.aiyaopai.com">返回首页</a>
      </div>
    );
  },
})

export default NF404
