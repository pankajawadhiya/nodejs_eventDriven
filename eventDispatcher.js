const http = require('http');
const EventEmitter = require('events');
const kafka = require('kafka-node');
const uuidv4 = require('uuid/v4');

const kafkaProduceTopic = "req-res-topic";
const kafkaConsumeTopic = "req-res-topic";

class ResponseEventEmitter extends EventEmitter {}

const responseEventEmitter = new ResponseEventEmitter();
var express = require('express');
var app = express();
var fs = require("fs");

app.get('/test/:id', function (req, res) {
   // First read existing users.
   //fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     // var users = JSON.parse( data );
     // var user = users["user" + req.params.id] 
      
   //});
   //var id ='pankaj30';
   responseEventEmitter.once(req.params.id, () => {
       console.log("Got the response event for ", req.params.id);
       res.write("Order " + req.params.id + " has been processed\n");
       res.end();
   });

   setTimeout(function () {
    console.log('timeout completed'); 
   }, 1000);
   console.log( req.params.id );
   // res.end( "Hello - "+req.params.id);

    
});

var HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.KafkaClient(),
    producer = new HighLevelProducer(client);

// var HighLevelConsumer = kafka.HighLevelConsumer,
//     client = new kafka.KafkaClient(),
//     consumer = new HighLevelConsumer(
//         client,
//         [
//             { topic: kafkaConsumeTopic }
//         ],
//         {
//             groupId: 'my-group'
//         }
//     );
Consumer = kafka.Consumer,
client = new kafka.KafkaClient(),
  consumer = new Consumer(client, [{ topic: "req-res-topic", partition: 0}], {
    autoCommit: false
  });

//===============================================

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 });

//===============================================

// Listen to the Kafka topic that streams messages
// indicating that the request has been processed and
// emit an event to the request handler so it can finish.
// In this example the consumed Kafka message is simply
// the UUID of the request that has been processed (which
// is also the event name that the response handler is
// listening to).
//
// In real code the Kafka message would be a JSON/protobuf/... message
// which needs to contain the UUID the request handler generated.
// This Kafka consumer would then have to deserialize the incoming
// message and get the UUID from it. 
consumer.on('message', function (message) {
    console.log(message.value);
    responseEventEmitter.emit(message.value);
});