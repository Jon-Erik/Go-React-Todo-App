import React from "react";
import "./Container.css";
import API from "../../utils/API";
import AddItem from "../AddItem";
import DisplayList from "../DisplayList";

class Container extends React.Component {
	constructor(props) {
		super(props);
		this.inputRef1 = React.createRef();
		this.inputRef2 = React.createRef();
		this.state = {
			description: "",
			dueDate: "",
			listItems: []
		}
	}

	displayTasks() {
		API.displayTasks()
		.then((res) => {
			let tasks = res.data.Tasks;
			this.setState({
				listItems: tasks
			})
		}).catch(function(err) {
			console.log(err);
		})
	}

	componentDidMount() {
		this.displayTasks();
	}

	handleInputChange = event => {
		let {name, value} = event.target;

		this.setState({
			[name]: value
		})
	}

	handleSubmit = event => {
		event.preventDefault();

		if (this.state.description == "" || this.state.dueDate == "") {
			alert("Please make sure you've entered a description and due date before submitting.")
		} else {
			console.log(this.state.description + " " + this.state.dueDate)
		}

		let newTask = {
			description: this.state.description,
			dueDate: new Date(this.state.dueDate),
			createdAt: new Date(),
			completed: false
		}

		API.createTask(newTask)
		.then((res) => {
			let tasks = res.data.Tasks;
			this.setState({
				listItems: tasks
			})
			//clears the form if the task was added successfully
			this.inputRef1.current.value = "";
			this.inputRef2.current.value = "";
			alert("Your new task was successfully added.")
		}).catch(function(err) {
			console.log(err);
		})
	}

	toggleStatus = (event) => {
		let task = event.target.name;

		API.toggleStatus(task)
		.then((res) => {
			console.log('task updated successfully');
			let tasks = res.data.Tasks;
			this.setState({
				listItems: tasks
			})
		}).catch(function(err) {
			console.log(err)
		})
	}

	deleteTask = (event) => {
		console.log("delete route")
		let task = event.target.name;

		API.deleteTask(task)
		.then((res) => {
			console.log('task deleted successfully');
			let tasks = res.data.Tasks;
			this.setState({
				listItems: tasks
			})
		}).catch(function(err) {
			console.log(err)
		})
	}

	render() {
		return (
			<div>
				<AddItem handleInputChange={this.handleInputChange}
								 handleSubmit={this.handleSubmit}
								 inputRef1={this.inputRef1}
								 inputRef2={this.inputRef2}/>
				<DisplayList displayTasks={this.displayTasks}
										 listItems={this.state.listItems}
										 toggleStatus={this.toggleStatus}
										 deleteTask={this.deleteTask}/>
			</div>
		)
	}
}

export default Container;