## Run project
To compile and start up the project locally:
```bash
npm run dev
```
# anglenet

A full-stack solution with an Angular 20 client and a .NET 9 minimal API, using JWT authentication and EF Core (SQL Server / LocalDB).

## Project structure

```
/
├── Client/   # Angular 20 frontend
└── Api/      # .NET 9 minimal API (namespace: anglenet)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and npm
- [Angular CLI](https://angular.dev/tools/cli): `npm install -g @angular/cli`
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- EF Core CLI tools: `dotnet tool install --global dotnet-ef`
- SQL Server LocalDB (installed with Visual Studio, or via the [SQL Server Express/LocalDB installer](https://learn.microsoft.com/sql/database-engine/configure-windows/sql-server-express-localdb))

## Backend setup (`Api/`)

1. Restore packages:
   ```bash
   cd Api
   dotnet restore
   ```

2. Configure secrets:
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "Jwt:Key" "REPLACE_WITH_A_LONG_RANDOM_STRING_AT_LEAST_32_CHARS"
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\\mssqllocaldb;Database=anglenet;Trusted_Connection=True;"
   ```
   Adjust the LocalDB instance name/database name if yours differs.

3. Apply EF Core migrations to create the database:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

## Frontend setup (`Client/`)

1. Install packages:
   ```bash
   cd Client
   npm install
   ```

2. Point the app at your API. Check `src/environments/environment.ts` (or wherever `apiUrl` / service `apiUrl` fields are defined) and confirm the base URL matches the port the API is running on, e.g.:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```

3. Run the dev server:
   ```bash
   ng serve
   ```
   The app will be available at `http://localhost:4200`.

## Running both together

To compile and start up the project locally:
```bash
npm run dev
```