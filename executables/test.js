var axios = require('axios');
for (var i = 0; i < 100; i++) {
    axios.post('http://localhost:4000/api/test')
}