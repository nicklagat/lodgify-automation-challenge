// TaskService.js
class UpdateTaskService {  
    // Function to update a task via API
    updateTaskViaAPI(authToken, apiBaseUrl, taskId, dueString) {
      // Check if taskId is not undefined or null
      if (!taskId) {
        throw new Error("taskId is undefined or null");
      }
  
      // Perform a POST request using the taskId to update the task
      return cy
        .request({
          method: "POST",
          url: `${apiBaseUrl}/rest/v2/tasks/${taskId}`,
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: {
            due_string: dueString,
          },
        })
        .its("body")
        .then((updateResponse) => {
          // Check if updateResponse is not undefined or null
          if (!updateResponse) {
            throw new Error("updateResponse is undefined or null");
          }
  
          // Return the response
          return updateResponse;
        });
    }
  }
  
  export default UpdateTaskService;
  