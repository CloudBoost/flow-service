console.log('asasa');process.on('message',(data)=>{console.log('1');if(!data.packageName2){return;} console.log(data.packageName2);var component= require(data.packageName2)();var socket=data.socket;socket.__proto__=component._socket.__proto__;var input=data.input;input.__proto__=component._input.__proto__;var output=data.output;output.__proto__=component._output.__proto__;(function (input, output) {
        var fs = require('fs');
        //check if data is present at `in` port
        if (!input._ports.in._data) {
            console.log('21212121')
            return;
        }
        //fetch data from `in` port
        var filePath = input.getData('in');
        //set other variables for different parameters of the function
        //read file 
        console.log('haahaha', filePath)
        fs.readFile(filePath, 'utf-8', (err, contents) => {
            if (err) {
                //error handler
                output.done(err);
                return;
            }
            //send file contents to the out port
            process.send({
                out: contents
            });

            //Finished processing
            // output.done();
        });

    })(input,output);});