export interface SupportRequestData {
  fullName: string;
  email: string;
  issueType: "" | "General Inquiry" | "Feature Request" | "Bug Report";
  tags: string[];
  steps: { step: string }[];
}