//const handleSignin = (db,bcrypt)  => (req,res) => {
const handleSignin = (req,res,db,bcrypt)  => {

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
}
module.exports = {
	handleSignin: handleSignin
}