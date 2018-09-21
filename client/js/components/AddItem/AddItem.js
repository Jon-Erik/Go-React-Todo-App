import React from "react";
import "./AddItem.css";
import API from "../../utils/API";

class AddItem extends React.Component {
	render() {
		return (
			<div>
			<br />
			<h3><i>Add a task here</i></h3>
				<form>
					<div className="form-group">
						<label>Description:</label>
						<input type="text"
									 ref={this.props.inputRef1}
									 className="form-control" 
									 id="todo-input"
									 onChange={this.props.handleInputChange}
									 name="description"/> 
					</div>
					<div className="form-group">
						<label>Due Date: <i>(MM/DD/YYYY)</i></label>
						<input type="text"
									 ref={this.props.inputRef2} 
									 className="form-control" 
									 id="dueDate-input"
									 onChange={this.props.handleInputChange}
									 name="dueDate"/> 
					</div>
					<button className="btn btn-primary" 
									onClick={this.props.handleSubmit}>
									Add to list</button>
				</form>
			</div>
		)
	}
}

export default AddItem;