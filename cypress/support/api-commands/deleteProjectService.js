// DeleteProjectService.js

class DeleteProjectService {
  deleteProjectViaAPI(authToken, apiBaseUrl, projectId) {
    return cy
      .request({
        method: "DELETE",
        url: `${apiBaseUrl}/rest/v2/projects/${projectId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((deleteResponse) => {
        if (!deleteResponse) {
          throw new Error("Invalid response received");
        }

        console.log(deleteResponse);

        // Verify that the project was successfully deleted
        // HTTP status 204 means 'No Content', which is typically returned after a successful deletion
        if (deleteResponse.status !== 204) {
          throw new Error("Failed to delete project via API");
        }

        return deleteResponse;
      });
  }
}

export default DeleteProjectService;
