export const handleError = (error) => {
  console.error(error);

  // Handle known Prisma errors
  if (error.code === 'P2002') {
    return {
      success: false,
      status: 409,
      error: "Duplicate record: A unique constraint would be violated.",
    };
  }

  if (error.code === 'P2025') {
    return {
      success: false,
      error: "Record not found.",
    };
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : "An unexpected error occurred",
  };
};