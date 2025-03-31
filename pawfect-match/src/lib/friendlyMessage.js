const messagePatterns = [
    {
        match: /unique constraint/i,
        message: "That already exists. Please select it from the dropdown list.",
    },
    {
        match: /record not found/i,
        message: "The item you're trying to access doesn't exist.",
    },
    {
        match: /name is required/i,
        message: "Please provide a name.",
    },
    {
        match: /unexpected error/i,
        message: "Something went wrong. Please try again.",
    },
    {
        match: /failed to fetch/i,
        message: "Unable to connect to the server. Please check your internet connection.",
    },
];

export function getFriendlyMessage(rawMessage = "") {
    for (const pattern of messagePatterns) {
        if (pattern.match.test(rawMessage)) {
            return pattern.message;
        }
    }
    return rawMessage || "Oops! Something went wrong.";
}