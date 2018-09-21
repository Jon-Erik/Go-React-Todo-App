import React from "react";
import "./DisplayList.css";
import API from "../../utils/API";
import Moment from 'react-moment';

class DisplayList extends React.Component {

	render() {
		return (
			<div>
				<br />
				<h3><i>Manage your tasks here</i></h3>
				<br />
				<table className="table">
				  <thead className="thead-light">
				    <tr>
				      <th scope="col">Description</th>
				      <th scope="col">Due Date</th>
				      <th scope="col">Created At</th>
				      <th scope="col">Toggle Status</th>
				      <th scope="col">Delete</th>
				    </tr>
				  </thead>
				  <tbody>			  	
				  	{!this.props.listItems.length ? (
				  			<tr>No tasks to display. Add a task using the form above</tr>
				  		) : (
				  			this.props.listItems.map((item, i) => 
				  			<tr key={i}>
				  				{!item.Completed ? (
				  					<td>{item.Description}</td>
				  				) : (
				  					<td><strike>{item.Description}</strike></td>
				  				)}
					  			<td>
					  				<Moment format="MM/DD/YYYY">
					  					{item.DueDate}
					  				</Moment>
					  			</td>
					  			<td>
					  				<Moment format="MM/DD/YYYY">
					  					{item.CreatedAt}
					  				</Moment>
					  			</td>				  			
				  				{!item.Completed ? (
				  					<td>
				  						<button className="btn btn-info"
			  											name={item.CreatedAt}
			  											onClick={this.props.toggleStatus}>
			  								Mark as completed
			  							</button>
			  						</td>
				  				) : (
										<td>
				  						<button className="btn success"
			  											name={item.CreatedAt}
			  											onClick={this.props.toggleStatus}>
			  								Mark as incomplete
			  							</button>
			  						</td>
			  					)}				  			
					  			<td>
					  				<button className="btn btn-dark"
					  								name={item.CreatedAt}
					  								onClick={this.props.deleteTask}>
					  						Delete
					  				</button>
					  			</td>
				  			</tr>
				  		))
				  	}
				  </tbody>
				</table>
			</div>
		)
	}
}

export default DisplayList;