const express = require('express');
const router = express.Router();
async function startup() {
  // setup something library here

  router.get('/', async function (req, res) {
    res.send('hello api !');
  });
  
  // simulate upload with express-fileupload
  router.post('/facecheck', async function (req, res) {
    var start = new Date();
    const { files } = req;
    const fileArr = Object.keys(files).map((key) => files[key]);
    if (fileArr.length == 0) return res.status(400).send('No files were uploaded.');
    const [file] = fileArr;
    // sleep 1s
    await new Promise((r) => setTimeout(r, 1000));
    var end = new Date();
    var time = end.getTime() - start.getTime();
    if (file.name.includes('error')) {
      return res.status(200).json({ success: false, error: '未登録の顔画像です', time: time });
    }
    return res.status(200).json({ success: true, name: 'taro tanaka', time: time });
  });
}

startup().catch(console.error);
module.exports = router;
