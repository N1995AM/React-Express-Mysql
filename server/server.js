const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const port = 3500

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
    return res.send('pong');
});

var connection  = require('../lib/db');
  
app.get(`/api/customers`, async (req, res) => {
connection.query('SELECT * FROM customers ORDER BY id desc',function(err,rows)     {
    if(err){
        console.error(err);
    }else{ 
        return res.status(200).send(rows);
    }                    
});
}); 


app.post(`/api/customers`, async (req, res) => {
    var user = { name: req.body.name } 
    connection.query('INSERT INTO customers SET ?', user, function(err, result) {
        if (err) {
            return 'error';
        } else {                  
            return res.status(200).send(result);
        }
    })
})

app.post(`/api/customers/remove`, async (req, res) => { 
    var user_id = req.body.id 
    console.log( user_id )
    connection.query('Delete from customers where id = ?', user_id, function(err, result) {
        if (err) {
            return 'error';
        } else {                  
            return res.status(200).send(result);
        }
    })
})


app.post(`/api/customers/edit`, async (req, res) => { 
    var user = [req.body.name, req.body.id]
    console.log( user );
    connection.query('UPDATE customers SET name = ? WHERE id = ?', user, function(err, result) {
        if (err) {
            return 'error';
        } else {                  
            return res.status(200).send(result);
        }
    })
})




app.listen(port || 8080);