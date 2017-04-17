let domoRenderer;
let domoForm;
let domoDeleteForm;
let DomoFormClass;
let DomoListClass;

const handleDomo = (e) => {
	e.preventDefault();

	$('#domoMessage').animate({width:'hide'}, 350);
	
	if($('#domoName').val == '' || $('#domoAge').val() == ''){
		handleError('RAWR!  All fields are required');
		return false;
	}

	sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function(){
		domoRenderer.loadDomosFromServer();
	});

	return false;
};

const handleDeleteDomo = (e) => {
	e.preventDefault();

	sendAjax('GET', $('#deleteDomosForm').attr('action'), $('#deleteDomosForm').serialize(), function(){
		domoRenderer.loadDomosFromServer();
	});

	return false;
};

const renderDomo = function(){
	return(
		<div>
		<form id='domoForm'
			onSubmit={this.handleSubmit}
			name='domoForm'
			action='/maker'
			method='POST'
			className='domoForm'
		>
		  <label htmlFor='name'>Name: </label>
		  <input id='domoName' type='text' name='name' placeholder='ex. Johnny Sly' />
		  <label htmlFor='title'>Title: </label>
		  <input id='domoTitle' type='text' name='title' placeholder='ex. The Pernicious' />
		  <label htmlFor='class'>Class: </label>
		  <select id='domoClass' type='text' name='class' defaultValue='Vagrant'>
		  	<option value='Vagrant'>Vagrant</option>
		  	<option value='Scavenger'>Scavenger</option>
		  	<option value='Drifter'>Drifter</option>
		  </select>
		  <input type='hidden' name='_csrf' value={this.props.csrf} />
		  <input className='makeDomoSubmit' type='submit' value='Make Domo' />
		</form>
		<form id='deleteDomosForm'
			onSubmit={this.handleDelete}
			name='deleteDomosForm'
			action='/deleteDomos'
			method='GET'
			className='domoForm'
		>
			<input type='hidden' name='_csrf' value={this.props.csrf} />
			<input className='makeDomoSubmit' type='submit' value='Delete Domos' />

		</form>
		</div>
	);
};

const renderDomoList = function(){
	if(this.state.data.length === 0){
		return(
			<div className='domoList'>
			<h3 className='emptyDomo'>No Domos yet</h3>
			</div>
		);
	}

	const domoNodes = this.state.data.map(function(domo){
		return(
			<div key={domo._id} className='domo'>
			  <img src='/assets/img/domoface.jpeg' alt='domoface' className='domoFace' />
			  <h3 className='domoName'>{domo.name} {domo.title}</h3>
			  <h3 className='domoStat'>Class: {domo.class}</h3>
			  <h3 className='domoStat'>Cunning: {domo.stats.cunning}</h3>
			  <h3 className='domoStat'>Fortitude: {domo.stats.fortitude}</h3>
			  <h3 className='domoStat'>Treachery: {domo.stats.treachery}</h3>
			  <h3 className='domoStat'>HP: {domo.stats.hp}</h3>
			</div>
		);
	});

	return(
		<div className='domoList'>
		  {domoNodes}
		</div>
	);
};

const setup = function(csrf) {
	DomoFormClass = React.createClass({
		handleSubmit: handleDomo,
		handleDelete: handleDeleteDomo,
		render: renderDomo,
	});

	DomoListClass = React.createClass({
		loadDomosFromServer:function(){
			sendAjax('GET', '/getDomos', null, function(data){
				this.setState({data:data.domos});
			}.bind(this));
		},
		getInitialState: function(){
			return{data: []};
		},
		componentDidMount: function(){
			this.loadDomosFromServer();
		},
		render: renderDomoList
	});

	domoForm = ReactDOM.render(
		<DomoFormClass csrf={csrf} />, document.querySelector('#makeDomo'),
	);


	domoRenderer = ReactDOM.render(
		<DomoListClass />, document.querySelector('#domos')
	);
};

const getToken = () =>{
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
}

$(document).ready(function(){
	getToken();
});