const express = require('express');
const app=express();
const bodyParser=require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const saltRounds = 10;
var myPlaintextPassword = 'apple';
const someOtherPlaintextPassword = 'not_apple';
const knex = require('knex');
const db = knex({
  	client: 'pg',
  	connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Asalman1234',
    database : 'smartbrain'
  }
});

db.select('*').from('users').then(
	data => {
		console.log(data);
	}
	);
//console.log(smartbraindatabase.select('*').from('users'));

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'Aamir',
			email:'aamir_hafiz@hotmail.com',
			password:'123',
			entries:0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Umer',
			email:'umer@hotmail.com',
			password:'123',
			entries:0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '124',
			name: 'Umer',
			email:'umer@hotmail.com',
			password:'123',
			entries:0,
			joined: new Date()
		}

	]	
}

app.get('/', (req,res) => {
	console.log('get request');
	res.send(database.users);
})

app.get('/profile/:id',(req,res) => {
	const {id}=req.params;
	db.select('*').from('users').where({id})
	.then(user => {
		//res.json(user[0]);
		if (user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('Not found')
		}
		
	}).catch(err => {
		res.status(400).json('error getting user')
	});
	//.catch(err => res.status(400).json('error getting user'))
	//});


	//let found=false;
	/*database.users.forEach(user => {
		
		if (user.id===id) {
			found=true;	
			return res.json(user);
		}
	})	*/
		/*if(!found)
		 {
			res.status(404).json('no such user');
		} */
})

//increment is just like update but it is used to increment the field by any number you give
app.put('/image',(req,res) => {
		const { id }=req.body;
		db('users').where('id', '=', id)
			  .increment('entries', 1)
			  .returning('entries')
			  .then(entries=>{
			  	res.json(entries[0])
			  })
			  .catch(err=>res.status(400).json('error getting users'))
	})





app.post('/image',(req,res) => {
	const { id }=req.body;
	let found=false;
	database.users.forEach(user => {
		
		if (user.id===id) {
			found=true;	
			user.entries++;
			return res.json(user.entries);
		}
	})	
		if(!found)
		 {
			res.status(404).json('no such user');
		} 
})



app.post('/register', (req,res) => {
	/*if (req.body.email===database.users[1].email &&
		req.body.password===database.users[1].password)
		 {
			res.json('success');
	} else {

		res.status(400).json('error logging in');
	}*/
	
	const {email, password,name} = req.body;
	
		


	myPlaintextPassword=password;

	var hash1='/Aamir Hash'; 
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
	        // Store hash in your password DB.
	        //console.log(hash)
	        //return hash;
	        hash1=hash;
	    });
	});

	console.log(hash1);

	db.transaction(trx => {
		trx.insert({
			hash:hash1,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name:name,
				joined: new Date()
			}). then (user => {
				res.json(user[0]);
			})
		})
			.then(trx.commit)
			.catch(trx.rollback)

		}). catch(err=>res.status(400).json('unable to register'))
	// database.users.push({

	// 		id: '125',
	// 		hash: '',
	// 		email: email
	// })
	
	/*db('users')
	.returning('*')
	.insert({
		email: email,
		name: name,
		joined: new Date()
	}).then(responseusers => {
		res.json(responseusers);
	}).catch(err => {
		//res.status(400).json(err);
		res.status(400).json('unable to register');
	});*/

	//res.json(database.users[database.users.length-1]);

})

app.post('/signin', (req,res) => {

	console.log('singin called');
	db.select('hash','email').from('login')
	.where('email','=',req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);		
		if (isValid) {
			db.select('*').from('users')
			.where('email','=',req.body.email)
			.then(user=>{
				res.json(user[0])
			})
			.catch(err=>res.status(400).json('unable to get user'))
		} else {
			res.status(400).json('wrong credentials!')
		}
	})
		.catch(err=>res.status(400).json('wrong credentials 2'))

	/*bcrypt.compare('apple', '$2a$10$zil/2RzkRAh2Wr20q6bWquJuSwpqp.OSGFAQu1f9EDe1AADKGE7m.', function(err, res) {
	    // res == true
	    console.log("first guess",res);
	});

	bcrypt.compare('apple', '$2a$10$FjcObqVIViTOZxcsKztgleMIUG/zdnnhetqOVUn7be9Y3OCRmrpaG', function(err, res) {
	    // res == true
	    console.log("second guess",res);
	});*/


	/*if (req.body.email===database.users[1].email &&
		req.body.password===database.users[1].password)
		 {
			res.json('success');
	} else {

		res.status(400).json('error logging in aamir');
	}*/
	
})


// to use the static contents like index.html and css files
app.use(express.static(__dirname+'/public'))
app.listen(3001, ()=>{
	console.log('app is running on port 3001');
});


/*/--> res= this is working
/signin --> POST success/fail
/register --> POST = user
/profile/:userID--> GET= user
/image --> PUT -->user
*/

/*var bcrypt = require('bcryptjs');
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("B4c0/\/", salt, function(err, hash) {
        // Store hash in your password DB.
    });
});*/