exports.generate = async (srs) => {

return `
HLD:
- Frontend (UI)
- Backend (API)
- Database

LLD:
- LoginModule
- DashboardModule

UML (PlantUML):

@startuml
actor User
User -> System: Login
System -> Database: Validate User
@enduml

CODE:

function login(){
  console.log("User login");
}
`;
};