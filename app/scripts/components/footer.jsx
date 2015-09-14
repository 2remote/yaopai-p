var React = require('react');

var FooterCover = React.createClass({
	render : function(){
		return (
			<div className="footer-cover">
				<div className="center">
					<div className="row">
						<div className="col-xs-3">
							<img width="100" src="img/footer_wechat.png" />
						</div>
						<div className="col-xs-3">
							<img width="100" src="img/footer_money.png" />
						</div>
						<div className="col-xs-3">
							<img width="100" src="img/footer_data.png" />
						</div>
						<div className="col-xs-3">
							<img width="100" src="img/footer_vip.png" />
						</div>
					</div>
					<div className="row">
						<div className="col-xs-3">
							<span>城市站的微信公众号所有权限、最大的技术支持和微信公众号的运营培训</span>
						</div>
						<div className="col-xs-3">
							<span>每推广一个摄影师，且该推广具有十个转发量，将获得100RMB现金奖励</span>
						</div>
						<div className="col-xs-3">
							<span>产生线上预约单并成功交易，按照成功交易额比例提成和现金奖励</span>
						</div>
						<div className="col-xs-3">
							<span>可享受官方网站该地区板块的管理权限，自行推广或广告投放</span>
						</div>
					</div>
					<div className="row">
						<a className="btn btn-default btn-lg">
							了解详情
						</a>
					</div>
				</div>
			</div>
			);
	}
});

var FooterLine = React.createClass({
	render :function(){
		return(
			<div className="line">
			</div>
			)
	}
});

var FooterBar = React.createClass({
	render : function(){
		return(
			<div className="footer-bar" >
				<div className="footer-code">
					<img width="50" src="img/footer_code.png" />
				</div>
				<div className="footer-info">
					<span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
					Email: yaopai@yaopai.club
					<span className="glyphicon glyphicon-earphone" aria-hidden="true"></span>
					Call: 400-4673-7659
					<span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
					郑州市金水区丰庆路建业半岛老房子A-02
					<div className="footer-company">
						copyright©2015,SmartisanDigitalCo.,Ltd.AllRightsReserved  北京邀拍传媒科技有限公司法律声明隐私条款
					</div>
					<div className="footer-beian">
						京ICP备14041720号-1   京ICP证140622号   京公网安备11010502025474
					</div>
				
				</div>
			</div>
			)
	}
});
var Footer = React.createClass({
	render: function(){
		return(
			<div className="footer">
				<FooterCover />
				<FooterLine />
				<FooterBar />
			</div>
			
		);
	}
});

module.exports = Footer;
