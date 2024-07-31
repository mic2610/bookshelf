// 🐨 you don't need to do anything in this file for the exercise. This is
// just here for the extra credit. See the instructions for more info.

// var express = require('express');
// var app = express();
// //const router = express.Router()

// function proxy(app) {
//     app.use(/^\/$/, (req, res) => {
//       console.log('Request made to home redirected to /discover');
//       res.redirect('/discover')
//     });
//   }
  
//   module.exports = proxy(app);

  // module.exports = router

// module.exports = () => {}


function proxy(app) {
    app.get(/^\/$/, (req, res) => res.redirect('/discover'))
    }
    
    module.exports = proxy
      
