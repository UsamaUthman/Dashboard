package main

import (
	"database/sql"
	"example/GO/controllers"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Position string `json:"position"`
	Verified bool   `json:"verified"`
}

const databaseFile = "./crud.db"

func main() {
	// Open the SQLite database file
	db, err := sql.Open("sqlite3", "./crud.db")
	if err != nil {
		log.Fatal(err)
	}

	// Prepare the statement to create the table with error handling
	statement, err := db.Prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            position TEXT NOT NULL,
            verified BOOLEAN NOT NULL DEFAULT false
        )
    `)
	if err != nil {
		log.Fatal(err)
	}

	// Execute the statement to create the table
	statement.Exec()

	// Create a new router using gorilla/mux

	router := mux.NewRouter()

	// Define the endpoint for adding a user
	router.HandleFunc("/api/v1/user", controllers.AddUserHandler).Methods("POST")

	// define the endpoint for getting user by id
	router.HandleFunc("/api/v1/user/{id}", controllers.GetUserHandler).Methods("GET")

	// define the endpoint for getting all users
	router.HandleFunc("/api/v1/users", controllers.GetAllUsersHandler).Methods("GET")

	// define the endpoint for updating a user
	router.HandleFunc("/api/v1/user/{id}", controllers.UpdateUserHandler).Methods("PUT")

	// define the endpoint for deleting a user
	router.HandleFunc("/api/v1/user/{id}", controllers.DeleteUserHandler).Methods("DELETE")

	// Create a new CORS middleware handler
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Add your frontend origin(s)
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
	}).Handler(router)

	// Start the HTTP server with CORS middleware
	log.Fatal(http.ListenAndServe(":5000", corsHandler))

	// display the running server
	log.Println("Server running on port 5000")
}
