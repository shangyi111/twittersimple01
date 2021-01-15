const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:4000/mews';

loadingElement.style.display = 'none';

form.addEventListener('submit',(event)=>{
	event.preventDefault();
	const formData= new FormData(form);
	const name = formData.get('name');
	const content = formData.get('content');
	
	const mew = {
		name,
		content
	};


	form.style.display = 'none';
	loadingElement.style.display = '';
	
	listAllMews();
	fetch(API_URL,{
		method:'POST',
		body:JSON.stringify(mew),
		headers:{
			'content-type':'application/json'
		}
	}).then(response =>{
		response.json()
	}).then(createdMew =>{
		console.log(createdMew);
		form.reset();
		setTimeout(()=>{
			form.style.display='';
		},3000);
		form.style.display='';
		listAllMews();
		loadingElement.style.display = 'none';
	})
})
function listAllMews(){
	mewsElement.innerHTML = '';
	fetch(API_URL)
		.then(response => response.json())
		.then(mews =>{
			console.log(mews);
			mews.reverse();
			mews.forEach(mew =>{

				const div = document.createElement('div');
				const header = document.createElement('h3');
				header.textContent = mew.name;
				const contents = document.createElement('p');
				contents.textContent = mew.content;
				const date = document.createElement('small')
				date.textContent = new Date(mew.created_date);
				div.appendChild(header);
				div.appendChild(contents);
				div.appendChild(date);
				mewsElement.appendChild(div)

			})
			loadingElement.style.display='none';
		})
}
