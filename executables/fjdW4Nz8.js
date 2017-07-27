console.log('saasasa');process.on('message',(data)=>{console.log('1');var component= require(data.packageName)();var socket=data.socket;socket.__proto__=component._socket.__proto__;var input=data.input;input.__proto__=component._input.__proto__;var output=data.output;output.__proto__=component._output.__proto__;(function (input, output) {
        //check if data is present at `in` port
        if (!input.hasData('string')) {
            return;
        }
        let string = input.getData('string')
        let length = string.length;
        process.send({
            length
        })

        // output.done();




    })(input,output)});

        // output.done();




    })(input,output);});