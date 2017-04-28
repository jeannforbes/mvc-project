let oppRenderer;
let oppForm;
let OppFormClass;
let OppListClass;

const handleMakeOpp = (e) => {
	e.preventDefault();

	$('#oppMessage').animate({width:'hide'}, 350);
	
	if($('#oppName').val == '' 
		|| $('#oppDate').val() == ''
		|| $('#oppInfo').val() == ''){
		handleError('Event name, date and description are required.');
		return false;
	}

	sendAjax('POST', $('#oppForm').attr('action'), $('#oppForm').serialize(), function(){
		oppRenderer.loadOppsFromServer();
	});

	return false;
};

const handleRSVPOpp = (e) => {
	e.preventDefault();

	e.target.querySelector('.oppRespond').innerHTML = 'RSVPed!';

	sendAjax('POST', $(e.target).attr('action'), $(e.target).serialize(), function(){
		
	});

	return false;
};

const handleBookmarkOpp = (e) => {
	e.preventDefault();

	e.target.querySelector('.oppBookmark').innerHTML = 'Bookmarked!';

	sendAjax('POST', $(e.target).attr('action'), $(e.target).serialize(), function(){
		
	});

	return false;
};

const renderOpp = function(){
	return(
		<div id='oppFormContainer'>
		<form id='oppForm'
			onSubmit={this.handleSubmit}
			name='oppForm'
			action='/maker'
			method='POST'
			className='oppForm'
		>
		  <h3 htmlFor='oppName'>Event Name </h3>
		  <input id='oppName' type='text' name='name' placeholder='event title here' />
		  <h3 htmlFor='oppDate'>Date </h3>
		  <input id='oppDate' type='date' name='date' />
		  <h3 htmlFor='oppInfo'>Description </h3>
		  <textarea id='oppInfo' type='text' name='info' />
		  <h3 htmlFor='oppContact'>Contact Information </h3>
		  <label htmlFor='oppEmail'>Email: </label>
		  <input id='oppEmail' type='email' name='email' placeholder='me@example.com'/>
		  <label htmlFor='oppPhone'>Phone: </label>
		  <input id='oppPhone' type='tel' name='phone' placeholder='(xxx)xxx-xxxx'/>
		  <label htmlFor='oppContactOther'>Other: </label>
		  <textarea id='oppContactOther' name='other' />
		  <input type='hidden' name='_csrf' value={this.props.csrf} />
		  <input className='makeOppSubmit' type='submit' value='Make Event' />
		</form>
		</div>
	);
};

const renderOppList = function(){
	if(this.state.data.length === 0){
		return(
			<div>
			<div id='filters'>FILTERS
			    <button onClick={this.loadOppsFromServer}>None</button>
				<button onClick={this.loadOppsByBookmark}>Bookmarks</button>
			  	<button onClick={this.loadOppsByRSVP}>RSVPs</button>
			</div>
			<div className='oppList'>
			<h3 className='emptyOpp'>No events available</h3>
			</div>
			</div>
		);
	}

	const oppNodes = this.state.data.map(function(opp){
		const date = new Date(opp.date);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const dt = date.getDate()+1;

		return(
			<div key={opp._id} className='opp'>
			  <h2 className='oppName'>{opp.name}</h2>
			  <h3>Date</h3>
			  <p className='oppDate'>{month}-{dt}-{year}</p>
			  <h3>Info</h3>
			  <p className='oppInfo'>{opp.info}</p>
			  <h3>Contact</h3>
			  <div className='contactInfo'>
				  <p className='oppEmail' >{opp.email}</p>
				  <p className='oppPhone' >{opp.phone}</p>
				  <p className='oppOther' >{opp.other}</p>
			  </div>
			<form 
				className='responseForm'
				className='oppForm'
				onSubmit={this.handleRSVP}
				name='responseForm'
				action='/rsvp'
				method='POST'
			>
				<input type='hidden' name='_csrf' value={this.props.csrf} />
				<input type='hidden' name='uniqueId' value={opp.uniqueId} />
				<input className='oppRespond' type='submit' value='RSVP' />
			</form>
			<form 
				className='bookmarkForm'
				className='oppForm'
				onSubmit={this.handleBookmark}
				name='bookmarkForm'
				action='/bookmark'
				method='POST'
			>
				<input type='hidden' name='_csrf' value={this.props.csrf} />
				<input type='hidden' name='uniqueId' value={opp.uniqueId} />
				<input className='oppBookmark' type='submit' value='Bookmark' />
			</form>
			</div>
		);
	}.bind(this));

	return(
		<div>
		<div id='filters'>FILTERS
		    <button id='filterNone' onClick={this.loadOppsFromServer}>None</button>
			<button id='filterBookmark' onClick={this.loadOppsByBookmark}>Bookmarks</button>
		  	<button id='filterRSVP' onClick={this.loadOppsByRSVP}>RSVPs</button>
		</div>
		<div className='oppList'>
		  {oppNodes}
		</div>
		</div>
	);
};

const setup = function(csrf) {
	OppFormClass = React.createClass({
		handleSubmit: handleMakeOpp,
		render: renderOpp,
	});

	OppListClass = React.createClass({
		loadOppsFromServer: function(){
			sendAjax('GET', '/getOpps', null, function(data){
				this.setState({data:data.opps});
			}.bind(this));

			$('#filterNone').className = 'selected';
			$('#filterBookmark').className = '';
			$('#filterRSVP').className = '';
		},
		loadOppsByBookmark: function(){
			sendAjax('GET', '/getBookmarks', null, function(data){
				this.setState({data:data.opps});
			}.bind(this));

			$('#filterNone').className = '';
			$('#filterBookmark').className = 'selected';
			$('#filterRSVP').className = '';
		},
		loadOppsByRSVP: function(){
			sendAjax('GET', '/getRSVPs', null, function(data){
				this.setState({data:data.opps});
			}.bind(this));

			$('#filterNone').className = '';
			$('#filterBookmark').className = '';
			$('#filterRSVP').className += 'selected';
		},
		getInitialState: function(){
			return{data: []};
		},
		componentDidMount: function(){
			this.loadOppsFromServer();
		},
		handleRSVP: handleRSVPOpp,
		handleBookmark: handleBookmarkOpp,
		render: renderOppList,
	});

	oppForm = ReactDOM.render(
		<OppFormClass csrf={csrf} />, document.querySelector('#makeOpp'),
	);


	oppRenderer = ReactDOM.render(
		<OppListClass csrf={csrf}/>, document.querySelector('#opps'),
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