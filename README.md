# CRUD Project

This CRUD project is built using various tools to provide a seamless user experience. The project encompasses a front-end developed with React.js, Next.js, TypeScript, Tailwind CSS, Jest test library, Redux Toolkit, and RTK Query. On the back end, the server is implemented using Go, providing a RESTful API, and Swagger UI is integrated for easy API documentation , and Sqlite3 for database.

## Features

- **Get All Users**: Retrieve a list of all users.
- **Add New Users**: Add new users to the system.
- **Delete Users**: Remove existing users from the database.
- **Update User**: Modify user information.
- **Get User by ID**: Fetch details of a specific user.

## Front-end Setup & Running

To run the front-end application:

1. Navigate to the client directory:
    ```bash
    cd client
3. Install dependencies:
   ```bash
    npm install
5. Run the application:
   ```bash
    npm run dev
7. Access the application at [http://localhost:3000](http://localhost:3000)

## Back-end Setup & Running

To test API endpoints and run the server:

1. Make sure you have GO CLI installed. Install it from [https://golang.org/doc/install](https://golang.org/doc/install)
2. Ensure you have GCC installed to use the SQLite3 database.
3. You don't need to create any database when running the server; it automatically creates one in the same directory if it does not exist
5. Run the server:
   ```bash
   go run main.go
7. Access Swagger UI at [http://localhost:5000/swagger/index.html](http://localhost:5000/swagger/index.html)

## SQLite3 Database

- The project utilizes SQLite3 as the database.
- Database setup is handled through the `db/migrate.go` file.
- The SQLite database file is located at `db/crud.db`.

## Redux Store

- The Redux store is utilized to manage state efficiently.
- Actions for adding or editing users are handled through a single action type variable, enhancing code organization.

## Jest Testing

- Components can be tested with Jest without running the entire project.
- Execute tests with:
  ```bash
  npm run test

## Code Quality

- Efforts have been made to maintain clean, readable, and self-explanatory code.
- The codebase is structured to facilitate ease of understanding and maintenance.

## UI View
![crud_view](https://github.com/UsamaUthman/crudProject/blob/main/client/src/assets/crud_view.png)


## Contact

**Usama Uthman**  
- Email: [osama.mhaleam@gmail.com](mailto:osama.mhaleam@gmail.com)
- GitHub: [https://github.com/UsamaUthman](https://github.com/UsamaUthman)
- LinkedIn: [https://www.linkedin.com/in/usama-uthamn-393739271/](https://www.linkedin.com/in/usama-uthamn-393739271/)
