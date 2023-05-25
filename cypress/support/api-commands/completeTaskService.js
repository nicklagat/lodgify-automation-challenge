// CompleteTaskService.js

class CompleteTaskService {
    completeTaskViaAPI(authToken, apiBaseUrl) {
      return cy
        .createTaskViaAPI()
        .then((response) => {
          if (!response || !response.id) {
            throw new Error("Invalid response received");
          }
  
          const taskId = response.id;
  
          return cy.request({
            method: "POST",
            url: `${apiBaseUrl}/rest/v2/tasks/${taskId}/close`,
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          });
        })
        .then((completeResponse) => {
          if (!completeResponse || completeResponse.status !== 204) {
            throw new Error("Failed to complete task via API");
          }
  
          console.log(completeResponse);
  
          return completeResponse;
        });
    }
  }
  
  export default CompleteTaskService;
  