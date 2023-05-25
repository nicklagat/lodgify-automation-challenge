// GetTasksService.js
class GetTasksService {
  getTaskViaAPI(authToken, apiBaseUrl) {
    return cy
      .request({
        method: "GET",
        url: `${apiBaseUrl}/rest/v2/tasks`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((completeResponse) => {
        if (!completeResponse) {
          throw new Error("completeResponse is undefined or null");
        }

        console.log(completeResponse);

        return completeResponse;
      });
  }
}

export default GetTasksService;
