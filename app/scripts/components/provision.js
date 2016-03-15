var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Button = require('react-bootstrap').Button;

var Provision = React.createClass({
  getInitialState: function () {
    return {
      authState: '0',
      disabled: false,
      pAuthData: {}
    }
  },
  render: function () {
    var style = {
      outer: {
        fontFamily: 'Helvetica Neue,Helvetica,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif',
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        fontSize: '12px',
        color: '#3e3e3e',
        width: '740px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    };
    return (
      <div style={style.outer}>
        <div>
          <h2 style={{fontSize: '24px',color: '#000',paddingBottom: '10px',marginBottom: '14px',borderBottom: '1px solid #e7e7eb'}}>
            YAOPAI 服务条款
          </h2>
          <div>
            <p>
              <span><strong>一、特别提醒</strong></span>
            </p>

            <p>
              <span><strong><br style={{'box-sizing': 'border-box'}}/></strong>北京邀拍传媒科技有限公司 提醒您：在使用YAOPAI 平台各项服务前，请您务必仔细阅读并透彻理解本条款。 您可以选择不使用YAOPAI 平台服务，但如果您使用YAOPAI 平台服务的，您的使用行为将被视为对本服务条款全部内容的认可。 “YAOPAI”由北京邀拍传媒科技有限公司运营，域名为aiyaopai.com以及YAOPAI 启用的其他域名。</span>
            </p>

            <p >
              <span>鉴于YAOPAI 提供的服务是属于一个全球在线预约摄影师的平台，YAOPAI 网页上关于摄影师会员或其发布的相关商品（包括但不限于摄影师名称、联络信息，产品的描述和说明，相关图片、视讯等）的信息均由摄影师自行提供，摄影师依法应对其提供的任何信息承担全部责任。</span>
            </p>

            <p>
              <span>任何单位或个人认为YAOPAI 的内容（包括但不限于摄影师会员发布的商品信息）可能涉嫌侵犯其合法权益，应该及时向YAOPAI 提出书面权利通知，并提供身份证明、权属证明、具体链接（URL）及详细侵权情况证明。我公司在收到上述法律文件后，将会依法尽快移除相关涉嫌侵权的内容。YAOPAI 网站尊重合法版权，反对侵权盗版。若本网有部分文字、摄影作品等侵害了您的权益，请通过公司联系方式联系我们。</span>
            </p>

            <p>
              <br/>
            </p>

            <p>
              <span><strong>二、摄影师注意事项：</strong></span>
            </p>

            <p>
              <span><strong><br style={{'box-sizing': 'border-box'}}/></strong>1、欢迎您加入YAOPAI ，YAOPAI 是一个全球预约摄影师的平台。旨在为摄影师提供自由工作必须的快速创建个人主页、多屏展示、在线选片等功能，为摄影师和有拍摄需求的客户实现快速匹配、便捷交易等服务。<br
              style={{'box-sizing': 'border-box'}}/>2、为了使您更快好使用YAOPAI 的服务，以下是您在YAOPAI 发布内容时需注意的事项，请您认真阅读。如您注册YAOPAI ，即表示您同意并签署了本条款，本条款将适用于您在YAOPAI 发布（上传）的任何内容(以下简称“内容”)，无论该内容在本条款签订前或签订后发布（上传）。<br
              style={{'box-sizing': 'border-box'}}/>3、YAOPAI 致力于维护和谐、良好的网络环境，您需要承诺发布（上传）到YAOPAI 的内容真实、合法，不会侵犯任何第三方的合法权益，您并承诺对该内容拥有完整的知识产权，或已经得到相关权利人的合法授权，YAOPAI 使用您所发布的内容不会对第三方权益产生不良影响。如您所发布的内容违反上述规定，为避免损失和不良影响的扩大，YAOPAI 有权要求您立即修正，或直接采取删除、屏蔽相应内容等必要的措施。<br
              style={{'box-sizing': 'border-box'}}/>4、YAOPAI 尊重知识产权并注重保护您享有的各项权利。您在YAOPAI 发布（上传）内容和授权邀拍公司的行为不会对您就这些内容所享有的知识产权产生任何不良影响，上传（发布）作品的著作权一律归作品的创作者所有。为了更好地对您、您发布（上传）的内容以及YAOPAI 进行宣传推广，您同意YAOPAI 可在YAOPAI 网站及YAOPAI 其他产品中使用和传播这些内容，以及为宣传推广的目的将上述内容许可给第三方使用和传播。<br
              style={{'box-sizing': 'border-box'}}/>5、为了更好地维护您的各项知识产权，您同意YAOPAI 有权针对侵犯您发布（上传）内容相关权利的行为进行维权。</span>
            </p>

            <p>
              <br/>
            </p>

            <p><span><strong>三、普通用户注意事项：</strong></span></p>

            <p>
              <span><strong><br style={{'box-sizing': 'border-box'}}/></strong>欢迎注使用YAOPAI ，作为摄影行业的互联网引领者，YAOPAI 为您提供在线挑选摄影师、自由沟通、在线选片和在线支付等功能，让您体验到互联网带来的摄影变革。<br
              style={{'box-sizing':'border-box'}}/>YAOPAI 对摄影师的水平有着严格的审核机制，每位展示的摄影师都是摄影行业的专家。摄影师的服务，由客户和YAOPAI 共同长期引导和监督决定，您有权对不满意的服务，在YAOPAI 对摄影师的服务提供反馈，YAOPAI 有义务为每一个客户提供良好的摄影服务。<br
              style={{'box-sizing': 'border-box'}}/>为了维护良好的网络环境，请勿以任何方式侵犯YAOPAI 摄影师及照片拍摄对象的著作权、肖像权等权益。摄影师的每一张照片都有摄影师标记的版权说明，如有侵犯，摄影师和YAOPAI 有权追求相关法律责任。</span>
            </p>

            <p>
              <span>若您对YAOPAI 及北京邀拍传媒科技有限公司有任何意见和建议，欢迎您联系我们。</span>
            </p>

            <p>
              <span>本服务条款的一切解释权归北京邀拍传媒科技有限公司所有。</span>
            </p>

            <p><br/></p>
          </div>
        </div>
        <Link to={'/'}>
          <Button className="col-xs-offset-3"
                  bsStyle="default"
                  style={{width:'300px'}}>
            确定
          </Button>
        </Link>
      </div>
    );
  }
});

module.exports = Provision;
