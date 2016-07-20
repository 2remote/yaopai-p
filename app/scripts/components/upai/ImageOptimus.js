import React from 'react'

/**
 * TODO: Ok, here is how this works:
 * 1. Render this component with a button/DOM element
 * 2. After rendering that, initialize plupload to take files from the button or sth
 * 3. Initialize cropperjs to use the file passed to it through plupload
 * 4. Now cropperjs should be able to track user's croping action
 * 5. When the user submits the image, it should be processed (cropped by cropperjs or so)
 *    and then passed somewhere as a binary file
 * 6. Now initialize QiNiu's upload utility to upload this image (using some low level uploading api, of course).
 *
 * P.S. I name this component after Optimus Prime for the reason that:
 *
 * >>>> There are ALWAYS times when the component needs to do MORE. It deserves such a FXXKING AWESOME name!
 *
**/
const ImageOptimus = React.createClass({
  getInitialState() {
    return {}
  },
  render() {
    return (
      <div>
        <button ref="upload" id="uploade" className="btn btn-default">点我试试</button>
        <div>
          <img ref="cropper" src={ this.file } style={{ maxWidth: '100%' }} />
        </div>
      </div>
    )
  },
  /**
   * Should initialize plupload here. (AFTER the component has mounted)
  **/
  componentDidMount() {
    const self = this
    // this.uploader = new plupload.Uploader({
    //   browse_button: 'uploade', // this can be an id of a DOM element or the DOM element itself
    //   url: 'upload.php'
    // });
    //
    // this.uploader.init();
    // this.uploader.bind('FilesAdded', function(up, files) {
    //   console.log('[LANG!]', files)
    // });
    console.log('[uploade]', document.getElementById('uploade'))
    self.upload = new plupload.Uploader({
      browse_button: self.refs.upload.getDOMNode(),
      url: '/somewhere-not-found',
    })
    self.upload.init()
    self.upload.bind('FilesAdded', function(up, files) {
      var reader  = new FileReader()
      reader.addEventListener("load", function () {
        self.file = reader.result
        console.log(self.file)
      }, false)
      reader.readAsDataURL(files[0].getNative())
      // self.file = (new FileReader()).readAsDataUrl()  // URL.createObjectURL(files[0].getNative())
      console.log(files[0].getNative())
      const cropperRef = self.refs.cropper.getDOMNode()
      self.cropper = self.cropper || new Cropper(cropperRef, {
        aspectRatio: 3 / 2,
        crop: function(e) {
          console.log(e)
        },
      })
    })
    self.upload.bind('Error', function(up, err) {
      console.warn('error', err)
    })
  },
})

export default ImageOptimus
