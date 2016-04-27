var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TicketSchema   = new Schema({
    country: String,
    date: { type: Date, default: Date.now },
    visa: String,
    price: Number,
    isAvailable: Boolean
});

module.exports = mongoose.model('Ticket', TicketSchema);
