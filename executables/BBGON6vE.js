process.on('message',(data)=>{var component= require(data.packageName)();var input=data.input;input.prototype=component.input.prototype;var output=data.output;output.prototype=component.output.prototype;(function (input, output) {
        //check if data is present at `in` port
        if (!input.hasData('augend') || !input.hasData('addend')) {
            return;
        }
        let augend = input.getData('augend')
        let addend = input.getData('augend')
        let sum = augend + addend / 2;
        output.send({
            sum: sum
        })

        output.done();

    })(input,output)});;