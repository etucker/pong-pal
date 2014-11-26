var express = require('express');
var router = express.Router();

var Datastore = require('nedb')
  , db = new Datastore();

// faux database
var makeFauxDatabase = function() {
  var matches = [
    {
      player1: 'etucker',
      player2: 'jcstamm',
      player1Score: 11,
      player2Score: 5,
      when: new Date(2014, 1, 2)
    },
    {
      player1: 'etucker',
      player2: 'jcstamm',
      player1Score: 7,
      player2Score: 11,
      when: new Date(2014, 4, 1)
    }
  ];
  for (var i = 0; i < matches.length; i++) {
    db.insert(matches[i], function (err, newDoc) {
      //
    });
  };
};
makeFauxDatabase();

/* GET home page. */
router.get('/', function(req, res) {
  db.find({}, function(err, matches) {
    var matchesDateReversed = matches.sort(function (a, b) {
      if (a.when < b.when)
        return 1;
      if (a.when > b.when)
        return -1;
      return 0;
    });
    console.log(matchesDateReversed);
    res.render('index', { title: 'Pong Pal', matches: matchesDateReversed });
  });
});

router.get('/api/matches', function(req, res, next) {
  db.find({}, function(err, matches) {
    res.send(matches);
  });
});

router.post('/api/matches', function(req, res, next) {
  var body = req.body;
  console.log(body);
  db.insert({
      player1: body.player1,
      player2: body.player2,
      player1Score: parseInt(body.player1Score),
      player2Score: parseInt(body.player2Score),
      when: new Date()
    }, function(err, newDoc) {
      res.send(newDoc);
    }
  );
});

module.exports = router;
