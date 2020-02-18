import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import NavBar from './NavBar'
import JumboTron from './JumboTron'
import ArticleList from './ArticleList'
import ArticleModal from './ArticleModal'

import './App.css'

class App extends Component {
	state = {
		saved: false
	}

	render(){
		const { saved } = this.state

		return (
			<div>
				<NavBar saved={saved} />
				<JumboTron />
				<ArticleList articles={articles} />
				<ArticleModal />
			</div>
		)
	}
}

export default App;	