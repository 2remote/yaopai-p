import React from 'react'

const ImageCropper = React.createClass({
  getInitialState: function() {
    return {
      file: undefined,
      img: undefined,
    }
  },
  onChange: function(e) {
    if(this.file) {
      this.setState({
        fileValue: e.target.value,
        file: this.file.getDOMNode().files[0],
        img: URL.createObjectURL(this.file.getDOMNode().files[0]),
      })
    }
    window.img = URL.createObjectURL(this.file.getDOMNode().files[0])
  },
  render: function() {
    return (
      <div>
        ImageCropper<br />
        <input type="file" id="upload" accept="image/*" ref={ c => this.file = c } value={ this.fileValue } onChange={ this.onChange } />
        <div>
          <img ref={ c => this.img = c } src={this.state.img} style={{ maxWidth: '100%' }} id="cover" />
        </div>
        <div>
          <h4>Control panel</h4>
          <div>
            <button className="btn btn-primary" onClick={ this.reset }>重置</button>
          </div>
        </div>
      </div>
    )
  },
  reset(e) {
    e.preventDefault()
    this.setState({
      file: undefined,
      img: undefined,
    })
    this.file.getDOMNode().value = ''
    this.img.getDOMNode().src = ''
    // console.log(this.cropper.destroy())
  },
  caonima: function() {
    // 为什么componentDidMount不执行？
    // console.log('cropper', this.img.getDOMNode(), document.getElementById('cover'))
    //
    // console.log('what the fuck!')
    // var cropper = new Cropper(this.img.getDOMNode(), {
    //   aspectRatio: 3 / 2,
    //   crop: (e) => {
    //     console.log(e.detail)
    //   },
    // })
  },
  componentDidUpdate: function() {
    const sb = this
    console.log('Component did update!')
    console.log('img', this.img.getDOMNode())
    // setTimeout(function() {
      console.log('the fucking file!', sb.img.getDOMNode(), document.getElementById('cover'))
      if(sb.img.getDOMNode().src) {
        if(this.cropper) {
          console.log('[replace]', this.cropper, this.state.img)
          console.log('[WTF]', this.state)
          if(this.state.img) {
            this.cropper.replace(this.state.img)
          } else {
            this.cropper.destroy()
          }

        } else {
          this.cropper = new Cropper(sb.img.getDOMNode(), {
            aspectRatio: 3 / 2,
            cropBoxResizable: false,
            crop: (e) => {
              console.log(e.detail)
            },
          })
        }
        window.cropper = this.cropper
      }
    // }, 1000)
  },
})

export default ImageCropper
