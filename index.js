const net = require('node:net');
const Timer = require('tm-timer');

console.log("starting index.js");



// broadcast time, nominal 20:00 which is 20*60 *1000 msec.
//const timeOut = 20 * 60 * 1000;     // 1 second timer
const timeOut = 5* 10 * 1000;     // 10 second timer
var counts = 0;

const myTimer = new Timer();
myTimer.set(timeOut);
myTimer.onTick(tickHandler);
//myTimer.whenDone(resetTimer);
myTimer.start();


function resetTimer(){
  console.log("resetTimer()");
  counts = 10*2*timeOut/1000;
  myTimer.reset();
  myTimer.start();
};


function tickHandler() {
  const currentDate = new Date();
  counts = counts + 1;

  const telemetryData = {
    "datestamp": currentDate,
    "counter": counts
  }; 

  sendData(telemetryData);
  
}



function sendData(telemetryData){
  console.log("running sendData:", telemetryData);

  const client = new net.Socket();

  const remPort = 3008;
  const host = 'localhost';

  // connect to command handler and send command, then close the socket
  client.connect(remPort, host, () => {
    console.log('connected to command handler');
    const telemetryDataStr = JSON.stringify(telemetryData);
    console.log('sending response: ', telemetryDataStr)
    client.write(telemetryDataStr);
    client.end();
  });
}

