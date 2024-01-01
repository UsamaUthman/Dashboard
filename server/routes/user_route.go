// routes/user_route.go
package routes

import (
	"project/GO/controllers"

	"github.com/gorilla/mux"
)

// SetUserRoutes sets up routes related to users
func SetUserRoutes(router *mux.Router) {
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
}
