import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import { generateText, Output } from "ai";
import { z } from "zod";

// Example: Smart form filling from natural language
async function smartFormFill(userInput: string) {
  console.log("\n🤖 Invisible AI: Smart Form Filling\n");
  console.log(`User types: "${userInput}"\n`);

  // Replace the TODOs in smartFormFill with:

  // Define the structure we want
  const eventSchema = z.object({
    eventTitle: z.string().describe("The title or purpose of the event"),
    date: z.string().describe("The date of the event"),
    time: z.string().nullable().describe("The time of the event"),
    duration: z.string().nullable().describe("How long the event will last"),
    location: z.string().nullable().describe("Where the event will take place"),
    attendees: z.array(z.string()).nullable().describe("People attending"),
    notes: z.string().nullable().describe("Additional notes or agenda items"),
  });

  // Extract structured data from natural language
  const { output: eventDetails } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Extract calendar event details from: "${userInput}"`,
    output: Output.object({ schema: eventSchema }),
  });

  // Display as if it's a form being auto-filled
  console.log("✨ AI automatically fills your form:\n");
  console.log(`📅 Event: ${eventDetails.eventTitle}`);
  console.log(`📆 Date: ${eventDetails.date}`);
  if (eventDetails.time) console.log(`⏰ Time: ${eventDetails.time}`);
  if (eventDetails.location)
    console.log(`📍 Location: ${eventDetails.location}`);
  if (eventDetails.attendees)
    console.log(`👥 Attendees: ${eventDetails.attendees.join(", ")}`);
  if (eventDetails.notes) console.log(`📝 Notes: ${eventDetails.notes}`);

  console.log("\n✅ Form ready to save - no manual input needed!");
}

// Example: Smart email categorization
async function smartEmailTriage(emailSubject: string, emailPreview: string) {
  console.log("\n📧 Invisible AI: Email Smart Triage\n");
  console.log(`Subject: "${emailSubject}"`);
  console.log(`Preview: "${emailPreview.slice(0, 80)}..."\n`);

  const emailSchema = z.object({
    category: z
      .enum(["urgent", "action-required", "fyi", "spam", "newsletter"])
      .describe("Email category based on content and intent"),
    priority: z
      .enum(["high", "medium", "low"])
      .describe("Triage priority for the inbox"),
    suggestedFolder: z
      .string()
      .describe("Folder or label where this email should be filed"),
    requiresResponse: z.boolean().describe("Whether a human reply is expected"),
    estimatedResponseTime: z
      .string()
      .nullable()
      .describe(
        "Estimated time to respond (e.g. '5 min', '1 hour'). Return null if no response is needed.",
      ),
    suggestedResponse: z
      .string()
      .nullable()
      .describe(
        "Draft reply if a simple auto-response is appropriate. Return null if the email is too complex, sensitive, or requires human judgment.",
      ),
  });

  const { output: triage } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Analyze and triage this email:

Subject: ${emailSubject}
Body: ${emailPreview}`,
    output: Output.object({ schema: emailSchema }),
  });

  console.log("✨ AI automatically organizes your inbox:\n");
  console.log(`🏷️  Category: ${triage.category}`);
  console.log(`⚡ Priority: ${triage.priority}`);
  console.log(`📁 Folder: ${triage.suggestedFolder}`);
  console.log(
    `💬 Requires response: ${triage.requiresResponse ? "Yes" : "No"}`,
  );
  if (triage.estimatedResponseTime) {
    console.log(`⏱️  Est. response time: ${triage.estimatedResponseTime}`);
  }
  if (triage.suggestedResponse) {
    console.log(`\n📝 Suggested response:\n${triage.suggestedResponse}`);
  } else {
    console.log("\n👤 No auto-response — flagged for human review");
  }

  console.log("\n✅ Email triaged — no manual sorting needed!");
}

async function runExamples() {
  // Smart form example
  await smartFormFill(
    "Coffee with John next Tuesday at 2pm at Starbucks on Market St, discuss Q4 roadmap",
  );

  console.log("\n" + "=".repeat(60));

  // Email triage example
  await smartEmailTriage(
    "Re: Q4 Budget Approval Needed by EOD",
    "Hi team, I need your approval on the attached Q4 budget proposal by end of day today. Please review the highlighted sections...",
  );
}

runExamples().catch(console.error);
