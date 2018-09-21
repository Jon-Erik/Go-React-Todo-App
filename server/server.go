package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

type Task struct {
	Description string    `json: "description"`
	DueDate     time.Time `json: "dueDate"`
	CreatedAt   time.Time `json: "createdAt"`
	Completed   bool      `json: "completed"`
}

type Database struct {
	Tasks []Task `json: "tasks"`
}

//loads json database file and converts to struct of type Database
func loadJsonFile() (*Database, error) {
	jsonFile, err := os.Open("database.json")
	if err != nil {
		log.Print("error:", err)
		return nil, err
	}
	defer jsonFile.Close()
	var db Database
	err = json.NewDecoder(jsonFile).Decode(&db)
	if db.Tasks == nil {
		db.Tasks = []Task{}
	}
	return &db, nil
}

//rewrites the updated json file and sends the json back to the client
func returnJson(database *Database, writer http.ResponseWriter) {
	tasksJson, err := json.Marshal(database)
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
	ioutil.WriteFile("database.json", tasksJson, 0600)
	writer.Write(tasksJson)
}

//loads json file and sends it to client in json format
func displayTasks(writer http.ResponseWriter, req *http.Request) {
	database, err := loadJsonFile()
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}
	returnJson(database, writer)
}

//receives a request from the client, appends a new task to the json, and returns updated json
func createTask(writer http.ResponseWriter, req *http.Request) {
	var task Task
	err := json.NewDecoder(req.Body).Decode(&task)
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	database, err := loadJsonFile()
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	database.Tasks = append(database.Tasks, task)
	returnJson(database, writer)
}

//receives a request from the client, finds the correct task, and toggles the completed boolean in task struct
func toggleStatus(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	createdAt, err := time.Parse(time.RFC3339, vars["createdAt"]) //converts requested time into correct format
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	database, err := loadJsonFile()
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	for i, _ := range database.Tasks {
		if database.Tasks[i].CreatedAt.Equal(createdAt) {
			database.Tasks[i].Completed = !database.Tasks[i].Completed
			returnJson(database, writer)
			return
		}
	}
	//this code runs only if no taks was found with the correct createdAt timestamp
	http.Error(writer, err.Error(), http.StatusBadRequest)
}

//receives a request from client, finds the task and deletes it, and returns updated json
func deleteTask(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	createdAt, err := time.Parse(time.RFC3339, vars["createdAt"])
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusBadRequest)
		return
	}

	database, err := loadJsonFile()
	if err != nil {
		log.Print("error:", err)
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	for i, _ := range database.Tasks {
		if database.Tasks[i].CreatedAt.Equal(createdAt) {
			database.Tasks = append(database.Tasks[:i], database.Tasks[i+1:]...)
			returnJson(database, writer)
			return
		}
	}
	//this code runs only if no taks was found with the correct createdAt timestamp
	http.Error(writer, err.Error(), http.StatusBadRequest)
}

func main() {
	router := mux.NewRouter()
	fileSrv := http.FileServer(http.Dir("../client/dist"))
	router.HandleFunc("/displayTasks", displayTasks)
	router.HandleFunc("/createTask", createTask)
	router.HandleFunc("/toggleStatus/{createdAt}", toggleStatus)
	router.HandleFunc("/deleteTask/{createdAt}", deleteTask)
	router.PathPrefix("/").Handler(fileSrv)
	log.Fatal(http.ListenAndServe(":8000", router))
}

//go build server.go && ./server.exe
