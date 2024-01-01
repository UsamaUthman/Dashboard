package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"fmt"
	"strings"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Position string `json:"position"`
	Verified bool   `json:"verified"`
}

const databaseFile = "./crud.db"

// add user handler
func AddUserHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the JSON request body
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// Insert the user into the database
	db, err := sql.Open("sqlite3", databaseFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	insertStatement, err := db.Prepare(`
        INSERT INTO users (name, email, position, verified)
        VALUES (?, ?, ?, ?)
    `)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	result, err := insertStatement.Exec(user.Name, user.Email, user.Position, user.Verified)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Respond with the ID of the inserted user
	response := map[string]int{"id": int(lastInsertID)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// get user by id handler
func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	// Get the 'id' query string parameter value
	vars := mux.Vars(r)
	id := vars["id"]

	// Get the user from the database
	db, err := sql.Open("sqlite3", databaseFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	row := db.QueryRow(`
		SELECT id, name, email, position, verified
		FROM users
		WHERE id = ?
	`, id)

	var user User
	err = row.Scan(&user.ID, &user.Name, &user.Email, &user.Position, &user.Verified)
	if err != nil {
		// send a message if user does not exist
		response := map[string]string{"message": "User does not exist"}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// Respond with the user in JSON format
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// get all users handler
func GetAllUsersHandler(w http.ResponseWriter, r *http.Request) {
	// Get the users from the database
	db, err := sql.Open("sqlite3", databaseFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	rows, err := db.Query(`
        SELECT id, name, email, position, verified
        FROM users
    `)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Position, &user.Verified)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		users = append(users, user)
	}

	if len(users) == 0 {
		// Send a message if there are no users in the database
		response := map[string]string{"message": "There are no users in the database"}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// Respond with the users in JSON format
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// update user handler
func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	// Get the 'id' query string parameter value
	vars := mux.Vars(r)
	id := vars["id"]

	// Parse the JSON request body
	var updatedUser User
	err := json.NewDecoder(r.Body).Decode(&updatedUser)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// Update the user in the database
	db, err := sql.Open("sqlite3", databaseFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Create an array to store the update fields and values
	var updateFields []string
	var updateValues []interface{}

	// Helper function to add a field and its value to the update
	addUpdateField := func(field string, value interface{}) {
		updateFields = append(updateFields, field+" = ?")
		updateValues = append(updateValues, value)
	}

	// Check each field in the updatedUser and add it to the update if not empty
	if updatedUser.Name != "" {
		addUpdateField("name", updatedUser.Name)
	}
	if updatedUser.Email != "" {
		addUpdateField("email", updatedUser.Email)
	}
	if updatedUser.Position != "" {
		addUpdateField("position", updatedUser.Position)
	}
	if updatedUser.Verified == true || updatedUser.Verified == false {
		addUpdateField("verified", updatedUser.Verified)
	}

	// Check if there are any fields to update
	if len(updateFields) == 0 {
		// No fields to update
		response := map[string]string{"message": "No fields to update"}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// Construct the dynamic UPDATE statement
	updateStatement := fmt.Sprintf(`
        UPDATE users
        SET %s
        WHERE id = ?
    `, strings.Join(updateFields, ", "))

	// Add the ID to the updateValues slice
	updateValues = append(updateValues, id)

	// Prepare and execute the dynamic UPDATE statement
	_, err = db.Exec(updateStatement, updateValues...)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Respond with the ID of the updated user
	response := map[string]string{"id": id}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// delete user handler
func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	// Get the 'id' query string parameter value
	vars := mux.Vars(r)
	id := vars["id"]

	// Delete the user in the database
	db, err := sql.Open("sqlite3", databaseFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// chek if user exists
	row := db.QueryRow(`
		SELECT id
		FROM users
		WHERE id = ?
	`, id)

	var user User
	err = row.Scan(&user.ID)
	if err != nil {
		// send a message if user does not exist
		response := map[string]string{"message": "User does not exist"}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	deleteStatement, err := db.Prepare(`
		DELETE FROM users
		WHERE id = ?
	`)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	_, err = deleteStatement.Exec(id)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Respond with the ID of the deleted user and a message
	response := map[string]string{"id": id, "message": "User deleted successfully"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

}
