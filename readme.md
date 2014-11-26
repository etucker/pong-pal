To run
======
bin/www


To view on the web
==================
http://localhost:3000

Using the API
=============
Get page of matches:
http://localhost:3000/api/matches

Post new match result:
curl -H "Content-Type: application/json" -d '{"player1":"etucker","player2":"jcstamm","player1Score":11,"player2Score":6}' http://localhost:3000/api/matches
