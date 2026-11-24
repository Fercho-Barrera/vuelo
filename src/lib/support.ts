// Where questions and feedback go. Empty until the owner picks an address (see docs/owner-tasks.md):
// with no address the mail app still opens and the person can type the recipient.
export const SUPPORT_EMAIL = "";

export const mailto = (subject: string, body: string) =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
