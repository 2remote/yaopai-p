var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var History = Router.History;
var Reflux = require('reflux');

var validator = require('validator');
var InfoHeader = require('../infoHeader');

var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var TextInput = require('../account/textInput');
var ImageInput = require('../account/imageInput');
var AreaSelect = require('../account/areaSelect');
var ToolTip = require('../toolTip');
var MultiImageSelect = require('./multiImageSelect');
var HasCompany = require('./hasCompany');
var CompanyLogo = require('./companyLogo');
var UserActions = require('../../actions/UserActions');
var UserStore = require('../../stores/UserStore');
var PAuthActions = require('../../actions/PAuthActions');
var PAuthStore = require('../../stores/PAuthStore');