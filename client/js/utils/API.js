import axios from "axios";

export default {
	displayTasks: function() {
		return axios.get("/displayTasks")
	},

	createTask: function(taskInfo) {
		return axios.post("/createTask", taskInfo)
	},

	toggleStatus: function(createdAt) {
		return axios.put("/toggleStatus/" + createdAt)
	},

	deleteTask: function(createdAt) {
		return axios.delete("/deleteTask/" + createdAt)
	}
}