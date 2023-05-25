// TaskService.js
class TaskService {
  // Function to create a task via API
  createTaskViaAPI(authToken, apiBaseUrl, projectId, createdtasks) {
    const { content } = createdtasks;

    // Check if content is not undefined, null or empty
    if (!content) {
      throw new Error("content is undefined, null or empty");
    }

    // Send a POST request to create a task via API
    return cy
      .request({
        method: "POST",
        url: `${apiBaseUrl}/rest/v2/tasks`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: {
          content: content,
          project_id: projectId,
        },
      })
      .its("body")
      .then((response) => {
        // Check if response is not undefined or null
        if (!response) {
          throw new Error("createTaskViaAPI response is undefined or null");
        }

        // Check if the content of the task returned matches the content we sent
        if (response.content !== content) {
          throw new Error(
            "The task's content does not match the content provided"
          );
        }

        // Assert that the response contains the expected properties
        expect(response).to.have.property("content");
        expect(response).to.have.property("creator_id");
        expect(response.is_completed).to.equal(false);

        // Output relevant information for verification or debugging
        console.log(response.is_completed);
        console.log(response.content);

        // Return the response for further use in the test
        return response;
      });
  }
}

export default TaskService;
