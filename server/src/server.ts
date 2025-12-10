import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { McpServer } from "skybridge/server";
import { z } from "zod";

const server = new McpServer(
  {
    name: "code-name-duo",
    version: "0.0.1",
    title: "Code Name Duo",
  },
  {
    capabilities: {},
    instructions: `This server lets you play Code Name Duo. 
Use the 'play' widget to display the game board. 
The game is cooperative - help the user give and guess clues.`,
  },
);

server.widget(
  "play",
  {},
  {
    description: "Play a game of Code Name Duo. If there are no words to guess, the action should be 'startGame'.",
    annotations: {
      readOnlyHint: true,
    },
    inputSchema: {
      action: z
        .enum(["guessWord", "startGame"])
        .optional()
        .describe("The action to perform. If no game is ongoing, the action should be 'startGame'."),
      wordsToGuess: z.array(z.string()).min(1).max(9).describe("The words to guess").optional(),
    },
  },
  async ({ action, wordsToGuess }): Promise<CallToolResult> => {
    if (action === "startGame") {
      return {
        _meta: {},
        structuredContent: {},
        content: [
          {
            type: "text",
            text: "The widget has been displayed. Don't give any other text, just wait for the user to start the game.",
          },
        ],
      };
    }
    if (wordsToGuess === undefined) {
      return {
        _meta: {},
        structuredContent: {},
        content: [{ type: "text", text: "The AI has not given any words to guess. Please give some words to guess." }],
        isError: true,
      };
    }
    return {
      _meta: {},
      structuredContent: { action, wordsToGuess },
      content: [
        {
          type: "text",
          text: `The user has been shared the words to guess: ${wordsToGuess.join(", ")}. Let him tell you if the words are correct.`,
        },
      ],
      isError: false,
    };
  },
);

export default server;
