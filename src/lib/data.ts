import { Todo } from "@prisma/client";

const pre_made_todos = [
  {
    title: "Refactor the legacy codebase",
    status: "started",
    category: "Chores",
    createdAt: "2023-11-01T09:00:00Z",
    updatedAt: "2023-12-01T10:00:00Z",
    description: "Break down the monolithic structure into microservices.",
  },
  {
    title: "Update the API documentation",
    status: "pending",
    category: "Chores",
    createdAt: "2023-10-15T08:00:00Z",
    updatedAt: "2023-11-20T09:30:00Z",
    description: "Ensure all endpoints are documented including new changes.",
  },
  {
    title: "Implement dark mode",
    status: "completed",
    category: "UI/UX",
    createdAt: "2023-09-01T07:45:00Z",
    updatedAt: "2023-09-15T08:00:00Z",
    description: "Add a dark theme option to the user interface.",
  },
  {
    title: "Optimize database queries",
    status: "started",
    category: "Improvements",
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-25T13:00:00Z",
    description:
      "Review and improve the efficiency of existing database queries.",
  },
  {
    title: "Deploy the new chatbot",
    status: "pending",
    category: "Feature",
    createdAt: "2023-11-10T11:00:00Z",
    updatedAt: "2023-11-15T11:30:00Z",
    description:
      "Launch the newly developed AI chatbot on the customer service page.",
  },
  {
    title: "Run usability tests",
    status: "completed",
    category: "UI/UX",
    createdAt: "2023-08-20T09:00:00Z",
    updatedAt: "2023-08-25T10:00:00Z",
    description: "Conduct tests to gather user feedback on the new interface.",
  },
  {
    title: "Set up a CI/CD pipeline",
    status: "started",
    category: "Infrastructure",
    createdAt: "2023-10-05T14:00:00Z",
    updatedAt: "2023-10-10T15:00:00Z",
    description:
      "Automate the build and deployment process for continuous integration and delivery.",
  },
  {
    title: "Review pull requests",
    status: "pending",
    category: "Team",
    createdAt: "2023-09-10T16:00:00Z",
    updatedAt: "2023-09-15T17:00:00Z",
    description:
      "Go through open pull requests and provide feedback or merge them.",
  },
  {
    title: "Fix the memory leak in the app",
    status: "started",
    category: "Bug",
    createdAt: "2023-11-05T18:00:00Z",
    updatedAt: "2023-11-10T19:00:00Z",
    description:
      "Identify and resolve the memory leak issue reported in the mobile app.",
  },
  {
    title: "Prepare a tech talk",
    status: "pending",
    category: "Team",
    createdAt: "2023-10-20T20:00:00Z",
    updatedAt: "2023-10-25T21:00:00Z",
    description:
      "Create a presentation for an upcoming tech conference on modern web technologies.",
  },
  {
    title: "Upgrade server hardware",
    status: "completed",
    category: "Infrastructure",
    createdAt: "2023-09-25T22:00:00Z",
    updatedAt: "2023-10-01T23:00:00Z",
    description:
      "Assess and enhance the server Infrastructurestructure to handle increased load.",
  },
  {
    title: "Conduct code reviews",
    status: "started",
    category: "Team",
    createdAt: "2023-10-10T13:00:00Z",
    updatedAt: "2023-10-15T14:00:00Z",
    description: "Regularly review team code to ensure quality and standards.",
  },
  {
    title: "Migrate to cloud services",
    status: "pending",
    category: "Infrastructure",
    createdAt: "2023-11-15T15:00:00Z",
    updatedAt: "2023-11-20T16:00:00Z",
    description:
      "Move internal systems to a cloud-based Infrastructurestructure.",
  },
  {
    title: "Implement responsive design",
    status: "completed",
    category: "UI/UX",
    createdAt: "2023-08-05T17:00:00Z",
    updatedAt: "2023-08-10T18:00:00Z",
    description: "Ensure the website is mobile-friendly across all devices.",
  },
  {
    title: "Audit cybersecurity measures",
    status: "started",
    category: "Chores",
    createdAt: "2023-10-25T19:00:00Z",
    updatedAt: "2023-10-30T20:00:00Z",
    description: "Evaluate and strengthen the cybersecurity protocols.",
  },
  {
    title: "Develop a new feature for the app",
    status: "pending",
    category: "Feature",
    createdAt: "2023-11-25T21:00:00Z",
    updatedAt: "2023-11-30T22:00:00Z",
    description: "Plan and code a new feature based on user feedback.",
  },
  {
    title: "Optimize front-end performance",
    status: "completed",
    category: "Improvements",
    createdAt: "2023-09-15T23:00:00Z",
    updatedAt: "2023-09-20T23:30:00Z",
    description: "Improve the load times and responsiveness of the front-end.",
  },
  {
    title: "Archive old projects",
    status: "started",
    category: "Chores",
    createdAt: "2023-10-15T08:00:00Z",
    updatedAt: "2023-10-20T09:00:00Z",
    description: "Clean up and archive projects that are no longer active.",
  },
  {
    title: "Update security protocols",
    status: "pending",
    category: "Chores",
    createdAt: "2023-11-01T10:00:00Z",
    updatedAt: "2023-11-05T11:00:00Z",
    description: "Review and update the security measures to prevent breaches.",
  },
  {
    title: "Plan the next sprint",
    status: "completed",
    category: "Team",
    createdAt: "2023-08-25T12:00:00Z",
    updatedAt: "2023-08-30T13:00:00Z",
    description:
      "Organize tasks and priorities for the upcoming development sprint.",
  },
  {
    title: "Document the software architecture",
    status: "started",
    category: "Chores",
    createdAt: "2023-10-05T14:00:00Z",
    updatedAt: "2023-10-10T15:00:00Z",
    description:
      "Create comprehensive documentation for the current software architecture.",
  },
  {
    title: "Perform load testing",
    status: "pending",
    category: "Infrastructure",
    createdAt: "2023-09-10T16:00:00Z",
    updatedAt: "2023-09-15T17:00:00Z",
    description: "Test the system's performance under high traffic conditions.",
  },
  {
    title: "Resolve dependency conflicts",
    status: "started",
    category: "Chores",
    createdAt: "2023-11-05T18:00:00Z",
    updatedAt: "2023-11-10T19:00:00Z",
    description:
      "Fix issues arising from conflicting software dependencies in the project.",
  },
  {
    title: "Organize a team building event",
    status: "pending",
    category: "Team",
    createdAt: "2023-10-20T20:00:00Z",
    updatedAt: "2023-10-25T21:00:00Z",
    description: "Plan an event to boost team morale and foster collaboration.",
  },
  {
    title: "Clean up the code repository",
    status: "completed",
    category: "Chores",
    createdAt: "2023-09-25T22:00:00Z",
    updatedAt: "2023-10-01T23:00:00Z",
    description: "Remove outdated branches and merge pending changes.",
  },
];

export function convertToPrismaDateTimes(todos: any[]) {
  return todos.map((todo) => ({
    ...todo,
    createdAt: new Date(todo.createdAt), // Convert createdAt to Date
    updatedAt: new Date(todo.updatedAt), // Convert updatedAt to Date
  }));
}

export const PRE_MADE_TODOS: Todo[] = convertToPrismaDateTimes(pre_made_todos);
