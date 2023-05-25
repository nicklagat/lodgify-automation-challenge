class ProjectService {
  // Function to create a project via API
  createProjectViaAPI(authToken, apiBaseUrl, project) {
    const { name } = project;

    // Check if project name is not undefined, null or empty
    if (!name) {
      throw new Error("project name is undefined, null or empty");
    }

    // Send a POST request to create a project
    return cy
      .request({
        method: "POST",
        url: `${apiBaseUrl}/rest/v2/projects`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: {
          name: project.name,
        },
      })
      .its("body")
      .then((response) => {
        // Check if response is not undefined or null
        if (!response) {
          throw new Error("createProjectViaAPI response is undefined or null");
        }

        // Check if the name of the project returned matches the name we sent
        if (response.name !== name) {
          throw new Error(
            "The project's name does not match the name provided"
          );
        }

        // Assert that the response contains the expected properties
        expect(response).to.have.property("id");
        expect(response).to.have.property("name");

        // Return the response for further use in the test
        return response;
      });
  }
}

export default ProjectService;
