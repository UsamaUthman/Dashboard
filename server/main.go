package main

import (
	"database/sql"
	"log"
	"net/http"
	"project/GO/routes"

	_ "project/GO/docs"

	_ "github.com/mattn/go-sqlite3"

	httpSwagger "github.com/swaggo/http-swagger"

	"github.com/gorilla/mux"
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

// @title User API
// @version 1.0
// @description This is a sample server for managing users.
// @host localhost:5000
// @BasePath /api/v1
// @contact.email osama.mhaleam@gmail.com
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

	// Set the user routes
	routes.SetUserRoutes(router)

	// Swagger
	router.PathPrefix("/swagger").Handler(httpSwagger.WrapHandler)

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
