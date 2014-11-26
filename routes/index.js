var express = require('express');
var router = express.Router();

var Datastore = require('nedb')
  , db = new Datastore();

var pg = require('pg.js');
var pgConnectionString = "postgresql://localhost";

// faux database
var makeFauxNedbDatabase = function() {
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
makeFauxNedbDatabase();


router.get('/pg-test', function(req, res) {
  pg.connect(pgConnectionString, function (err, client, done) {
    var handleError = function (err) {
      if (!err) return false;

      // Otherwise an error occurred.
      done(client);
      // TODO: send back a 500 error.
      res.status(500).send("Connection problem: " + err);
      return true;
    };

    if (handleError(err)) return;

    client.query('select * from matches', function (err, result) {
      res.send(result.rows);
    });
  });
});

// Seed Postgres database
// Table must already be created:
//   create table matches (player1 varchar(50), player2 varchar(50), player1Score int, player2Score int, whenPlayed date)
router.get('/seed-data', function(req, res) {
  var randomLoosingScore = function () {
    Math.floor((Math.random() * 11));
  };

  var matches = [
    {
      player1: 'etucker',
      player2: 'jcstamm',
      player1Score: 11,
      player2Score: randomLoosingScore(),
      when: new Date(2014, 1, 2)
    },
    {
      player1: 'etucker',
      player2: 'jcstamm',
      player1Score: randomLoosingScore(),
      player2Score: 11,
      when: new Date(2014, 4, 1)
    }
  ];

  pg.connect(pgConnectionString, function (err, client, done) {
    var handleError = function (err) {
      if (!err) return false;

      // Otherwise an error occurred.
      done(client);
      // TODO: send back a 500 error.
      res.status(500).send("Connection problem: " + err);
    };

    if (handleError(err)) return;

    for (var i = 0; i < matches.length; i++) {

      client.query('INSERT INTO matches (player1, player2, player1Score, player2Score, whenPlayed) VALUES ($1, $2, $3, $4, $5)',
      [ matches[i].player1, matches[i].player2, matches[i].player1Score, matches[i].player2Score, matches[i].when ],
      function (err, result) {
        if (handleError(err)) return;
        console.log("result: " + result);
        done();
      });
    };
  });
});

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
