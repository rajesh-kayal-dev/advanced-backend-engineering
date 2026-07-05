export default async function errorHandler(app) {
  app.setErrorHandler((error, request, reply) => {
    // Validation Error
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }

    app.log.error(error);

    return reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  });
}