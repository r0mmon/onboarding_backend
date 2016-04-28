// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var dbauth = require('./password');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://' + dbauth.dbuser + dbauth.dbpass + '@ds021681.mlab.com:21681/onboarding');
var Ticket = require('./app/models/ticket.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

router.use(function(req, res, next) {
  console.log('Somthing is happening');
  next(); // make sure we go to the next routes and don't stop here
});

router.route('/tickets')
  .post(function(req, res) {
    var ticket = new Ticket();
    ticket.country = req.body.country;
    ticket.dates = req.body.date;
    ticket.visa = req.body.visa;
    ticket.price = req.body.price;
    ticket.isAvailable = req.body.isAvailable;

    // save
    ticket.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'Ticket created'});
    });
  })
  .get(function(req, res) {
    Ticket.find(function(err, tickets) {
      if (err) res.send(err);
      res.json(tickets);
    });
  });

// on routes that end in /tickets/:ticket_id
// ----------------------------------------------------
router.route('/tickets/:ticket_id')

    // get the ticket with that id (accessed at GET http://localhost:8080/api/tickets/:ticket_id)
    .get(function(req, res) {
        Ticket.findById(req.params.ticket_id, function(err, ticket) {
            if (err)
                res.send(err);
            res.json(ticket);
        });
    })

    // update the ticket with this id (accessed at PUT http://localhost:8080/api/tickets/:ticket_id)
    .put(function(req, res) {

        // use our ticket model to find the ticket we want
        Ticket.findById(req.params.ticket_id, function(err, ticket) {
            if (err)
                res.send(err);
            ticket.country = req.body.country;  // update the tickets info

            // save the ticket
            ticket.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Ticket updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Ticket.remove({
            _id: req.params.ticket_id
        }, function(err, ticket) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hello and welcome!' });
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);
