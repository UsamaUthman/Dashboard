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

// AddUserHandler godoc
// @Summary Add a new user
// @Description Add a new user to the database
// @Tags users
// @Accept json
// @Produce json
// @Param user body User true "User object that needs to be added"
// @Success 201 {object} map[string]int
// @Router /api/v1/user [post]
func AddUserHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the JSON request body
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// Check if a user with the provided email already exists
	db, err := sql.Open("sqlite3", databaseFile)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var existingUserEmail string
	err = db.QueryRow("SELECT email FROM users WHERE email = ?", user.Email).Scan(&existingUserEmail)
	if err == nil {
		// User with the provided email already exists
		response := map[string]string{"message": "User with this email already exists", "status": "409"}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(response)
		return
	} else if err != sql.ErrNoRows {
		// An error occurred while checking for existing user
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Insert the user into the database
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
	response := map[string]string{"message": "User added successfully", "status": "201", "id": fmt.Sprintf("%d", lastInsertID)}
	w.Header().Set("Content-Type", "application/json")
	// status 201 - created
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// GetUserHandler godoc
// @Summary Get a user by ID
// @Description Get a user from the database by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID to get"
// @Success 200 {object} User
// @Success 404 {object} map[string]string
// @Router /api/v1/user/{id} [get]
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

// GetAllUsersHandler godoc
// @Summary Get all users
// @Description Get all users from the database
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {array} User
// @Success 404 {object} map[string]string
// @Router /api/v1/users [get]
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

// UpdateUserHandler godoc
// @Summary Update a user by ID
// @Description Update a user in the database by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID to update"
// @Param user body User true "Updated user object"
// @Success 200 {object} map[string]string
// @Success 400 {object} map[string]string
// @Success 404 {object} map[string]string
// @Success 500 {object} map[string]string
// @Router /api/v1/user/{id} [put]
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

		// check if email already exists
		var existingUserEmail string
		err = db.QueryRow("SELECT email FROM users WHERE email = ?", updatedUser.Email).Scan(&existingUserEmail)
		if err == nil {
			// User with the provided email already exists
			response := map[string]string{"message": "User with this email already exists", "status": "409"}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(response)
			return
		} else if err != sql.ErrNoRows {
			// An error occurred while checking for existing user
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
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
	response := map[string]string{"message": "User updated successfully", "status": "204"}
	w.Header().Set("Content-Type", "application/json")
	// status 204 - no content
	w.WriteHeader(http.StatusNoContent)
	json.NewEncoder(w).Encode(response)
}

// DeleteUserHandler godoc
// @Summary Delete a user by ID
// @Description Delete a user from the database by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID to delete"
// @Success 200 {object} map[string]string
// @Success 404 {object} map[string]string
// @Success 500 {object} map[string]string
// @Router /api/v1/user/{id} [delete]
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
