import Reflux from 'reflux';
import { postStar } from '../../HttpFactory';
import { MOTE } from '../../api';

/**
 * 模特
**/
const MoteAction = Reflux.createActions({
  currentInfo: { children: ['success', 'error'] }, // 获取当前模特信息
  changeInfo: { children: ['success', 'error'] }, // 修改模特信息
  get: { children: ['success', 'error'] }, // 获取模特信息（非当前用户）
  search: { children: ['success', 'error'] }, // 获取模特列表
  addView: { children: ['success', 'error'] }, // 添加view
  mark: { children: ['success', 'error'] }, // 加关注
  unmark: { children: ['success', 'error'] }, // 取消关注
});

MoteAction.changeInfo.listen(function(info) {
  let self = this;
  postStar(MOTE.changeInfo, {
    Style: '',
  }, function(resp) {

  }, function(error) {
    self.error(error);
  });
});
