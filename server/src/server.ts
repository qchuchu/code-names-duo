import { type CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { McpServer } from "skybridge/server";

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
  {
    description: "Play a game of Code Name Duo",
  },
  {},
  async (): Promise<CallToolResult> => {
    return {
      /**
       * Arbitrary JSON passed only to the component.
       * Use it for data that should not influence the model’s reasoning, like the full set of locations that backs a dropdown.
       * _meta is never shown to the model.
       */
      _meta: {},
      /**
       * Structured data that is used to hydrate your component.
       * ChatGPT injects this object into your iframe as window.openai.toolOutput
       */
      structuredContent: {},
      /**
       * Optional free-form text that the model receives verbatim
       */
      content: [
        {
          type: "text",
          text: `The start game screen of Code Name Duo has been displayed. Don't give any other text, just wait for the user to start the game.`,
        },
      ],
      isError: false,
    };
  },
);

export default server;
