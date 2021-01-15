const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");
const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/meower');
const mews = db.get('mews');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
	res.json({
		message:'meower!'
	});
})
app.get('/mews',(req,res)=>{
	mews
		.find()
		.then(mews =>{
			res.json(mews);
		})
})
function isValidMew(mew){
	return mew.name && mew.name.toString().trim()!==''&&
		mew.content && mew.content.toString().trim()!=='';
}

app.use(rateLimit({
	windowMs: 30 * 1000,
	max:1
}));

app.post('/mews',(req,res)=>{
	if(isValidMew(req.body)){
		const mew = {
			name:filter.clean(req.body.name.toString()),
			content:filter.clean(req.body.content.toString()),
			created_date:new Date()
		}

		mews
			.insert(mew)
			.then(createdMew =>{
				res.json(createdMew);
			});
		console.log(mew);
	}else{
		res.status(422);
		res.json({
			message:"Hey! Name and content are requried"
		})
	}
})

app.listen(4000,()=>{
	console.log('Listening to 5000');
})
