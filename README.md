# Aircraft  CRUD App with Asp.Net Core + Angular
# Introduction
The aim of this project is to implement the aircraft CRUD operations requirment as bellow. I implement this application using ASP.NET Web API and Angular

![Application Settings](docs/reference.png)

# Running the Application
**Before running this project**
1. Aircraft API Project : Edit appsettings.json -> Connection String as Per Your SQL Server
````
"ConnectionStrings": {
    "DbConnection": "Server=YourPcName; Database=AircraftDb; User Id=sa; Password=1234"
  },
````
2. Create SQL Server DB Using the bellow migration code.
````
dotnet ef database update -s AircraftAPI -p .\AircraftAPI.DataAccess
````
3.Aircraft Front Project : Install npm packages using 
````
npm install
````

4.Aircraft Front Project : Edit below backend URLs as per your  backend URL
aircraftservice.ts and aircraft.component.ts
````
 public createImgPath = (serverPath: string) => {
    return `https://localhost:44391/${serverPath}`;
  }
````
````
 url = 'https://localhost:44391/api/Aircraft s/';
````
