const { app } = require("@azure/functions");

function getClientPrincipal(request) {
  const header =
    request.headers.get("x-ms-client-principal");

  if (!header) {
    return null;
  }

  const decoded =
    Buffer.from(header, "base64")
      .toString("utf8");

  return JSON.parse(decoded);
}

app.http("whoami", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "whoami",

  handler: async (request, context) => {

    const principal =
      getClientPrincipal(request);

    if (!principal) {
      return {
        status: 401,
        jsonBody: {
          authenticated: false,
          message: "Not authenticated"
        }
      };
    }

    return {
      status: 200,
      jsonBody: {
        authenticated: true,

        identityProvider:
          principal.identityProvider,

        userId:
          principal.userId,

        userDetails:
          principal.userDetails,

        userRoles:
          principal.userRoles
      }
    };
  }
});
