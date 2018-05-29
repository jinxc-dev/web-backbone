const util = require('../util')
const uuidv4 = require('uuid/v4');
const mime = require('mime-types')
const fs = require('fs');
const path = require('path')

module.exports = function (server, router) {
  // Basicament he creat aquest petit modul per pujar videos
  // El processament es molt similar, pero els videos tenen la seva propia ruta, no son imatges
  server.post('/videos', util.isAuthenticated, function (req, res) {
    var videos = []
    Object.getOwnPropertyNames(req.files).forEach(function (fileName) {
      var file = req.files[fileName]
      var fname = uuidv4() + '.' + mime.extension(file.mimetype)
      fs.writeFileSync('./data/' + fname, file.data)
      router.db.get('videos')
        .insert({filename: fname, userId: req.session.userId}) 
        .write()
      videos.push(fname)
    })
    util.jsonResponse(res, videos);
  })

  server.get('/videos/:filename', util.isAuthenticated, function (req, res) {
    var file = router.db.get('videos').find(['filename', req.params.filename]).value()
    if (file)
      res.sendFile(path.resolve('./data/' + file.filename)) 
    else
      util.sendError(res, 400, util.Error.ERR_BAD_REQUEST, 'Video does not exist')
  })
}

