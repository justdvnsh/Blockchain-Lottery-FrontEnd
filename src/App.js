import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './Lottery';

class App extends Component {

 state = {
	manager: '',
	players: [],
	balance: '',
	value: '',
	message: ''
 }

 async componentDidMount() {
	const manager = await lottery.methods.manager().call();
	const players = await lottery.methods.getPlayers().call();
	const balance = await web3.eth.getBalance(lottery.options.address);

	this.setState({ manager, players, balance  })
 }

 onSubmit = async (event) => {
	event.preventDefault();

	const accounts = await web3.eth.getAccounts();

	this.setState({ message: 'Please wait while we get your bid placed...!' })

	await lottery.methods.enter().send({
		from: accounts[0],
		value: web3.utils.toWei(this.state.value, 'ether')
	});

	this.setState({ message: 'Thank you for your patience, You have been entered' });
 }

 onClick = async () => {
	const accounts = await web3.eth.getAccounts();

	this.setState({ message: 'Please Wait while we pick a winner..!' });

	await lottery.methods.pickWinner().send({
		from: accounts[0]
	});

	this.setState({ message: 'Thank You for your patience. A winner has been picked.' });
 }

  render() {
    return (
	<div className="App">
		<center><h1>Lottery</h1></center><br/><hr/><br/>
		<p>This lottery is managed by <b>{this.state.manager}</b></p>
		<p>There are currently <b>{this.state.players.length} people</b> competing
			to win<b> {web3.utils.fromWei(this.state.balance, 'ether')} ether</b>
		</p><br/>
		<hr/><br/>

		<form onSubmit={this.onSubmit}>
			<h3>Want to try your luck ??</h3>
			<div>
				<label>Enter some amount to play</label><br/><br/>
				<input 
					value = {this.state.value}
					onChange = {event => this.setState({ value: event.target.value  })}
				/><br/><br/>
			</div>
			<button>Let's Do it..!</button>
		</form><br/><hr/><br/>

		<h2>Ready to Pick a Winner ??</h2><br/><br/>
		<button onClick={this.onClick}>Pick a Winner !</button><br/><hr/><br/>

		<h1>{this.state.message}</h1>
	</div>
    );
  }
}

export default App;
