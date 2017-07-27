console.log('saasasa');process.on('message',(data)=>{console.log('1');var component= require(data.packageName)();var socket=data.socket;socket.__proto__=component._socket.__proto__;var input=data.input;input.__proto__=component._input.__proto__;var output=data.output;output.__proto__=component._output.__proto__;(function (input, output) {
        //check if data is present at `in` port
        if (!input._ports.in._data, !input._ports.data._data) {
            return;
        }
        var fs = require('fs');
        //fetch data from `in` port
        var filePath = input.getData('in');
        var data = input.getData('data')

        //write file 
        fs.appendFile(filePath, data, 'utf-8', (err, a, b) => {
            if (err) {
                //error handler
                output.done(err);
                return;
            }
            process.send({
                out: filePath
            })

            //Finished processing
            //            output.done();
        });


    })(input,output)});