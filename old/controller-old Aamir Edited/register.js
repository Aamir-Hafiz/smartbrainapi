const handleRegister = (req,res,db,bcrypt)  => {
		
	const {email, password,name} = req.body;

	if(!email || !password || !name){
		return res.status(400).json('incorret form submission');
	}
	
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
	
}

module.exports = {
	handleRegister: handleRegister
}