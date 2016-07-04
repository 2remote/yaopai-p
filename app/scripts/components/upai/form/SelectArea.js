/**
 * This component is YAOPAI specific component that provides area selection functionality
 * for province, city and district.
**/
import React from 'react'
import Reflux from 'reflux'

import AreaAction from '../../../actions/AreaAction'
import AreaStore from '../../../stores/AreaStoreAgain'

const SelectArea = React.createClass({
  mixins: [
    // area[id]: detail of the node (province/city/district)
    // area.children[id]: detail of the children of the node
    Reflux.connect(AreaStore, 'area')
  ],
  render() {
    const { area, province, city, district } = this.state
    const provinceList = area.children['0'] || []
    const cityList = provinceList.length ? area.children[province] || [] : []
    const districtList = cityList.length ? area.children[city] || [] : []
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">常驻地</label>
        <div className="col-sm-3">
          <select className="form-control" value={ this.state.province } onChange={ e => this.updateValue('province', e.target.value) }>
            <option value="">--请选择--</option>
            {
              provinceList.map((province, key) => (
                <option value={ province.id } key={ key }>{ province.cn }</option>
              ))
            }
          </select>
        </div>
        <div className="col-sm-3">
          <select className="form-control" value={ this.state.city } onChange={ e => this.updateValue('city', e.target.value) }>
          <option value="">--请选择--</option>
          {
            cityList.map((city, key) => (
              <option value={ city.id } key={ key }>{ city.cn }</option>
            ))
          }
          </select>
        </div>
        <div className="col-sm-3">
          <select className="form-control" value={ this.state.district } onChange={ e => this.updateValue('district', e.target.value) }>
          <option value="">--请选择--</option>
          {
            districtList.map((district, key) => (
              <option value={ district.id } key={ key }>{ district.cn }</option>
            ))
          }
          </select>
        </div>
      </div>
    )
  },
  updateValue(key, value) {
    // We need more!
    if(key === 'province') {
      this.setState({
        province: value,
        city: '',
        district: '',
      })
      AreaAction.loadChildren(value)
    } else if(key === 'city') {
      this.setState({
        city: value,
        district: '',
      })
      AreaAction.loadChildren(value)
    } else if(key === 'district') {
      this.setState({
        district: value
      })
    } else {
      console.warn('[SelectArea-UPAI]What the hell are you updating here?')
    }
  },
})

export default SelectArea
