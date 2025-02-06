# Developer Guide

## Project Overview

MAOP SDK is a TypeScript software development kit for the MAOP platform, providing a complete set of API interfaces covering core functional modules such as authentication, result management, agent services, chat system, and message processing.

To obtain API access credentials, please contact the QuestFlow team through the following official channels:
- Twitter: https://x.com/questflow
- Discord: https://discord.com/invite/VpFst92q4y
- Telegram: https://t.me/questflow
- Email: contact@questflow.ai

## Main Modules

### 1. MaopClient
- Core client class, providing platform access entry

### 2. ToolService
- Tool management service, supporting creation, update, and deletion of tools

### 3. AgentService
- Agent management service, supporting agent creation, testing, and publishing

### 4. ChatService
- Chat service, supporting chat room retrieval

### 5. MessageService
- Message service, supporting chat message retrieval

## Usage Examples

### Initializing the Client

When using MaopClient, the following parameters are required:
- baseURL: MAOP platform API service address
- apiKey: Platform access credentials, need to be applied through QuestFlow official channels
- openUserId: Unique identifier of the user in the SDK integrator's own business system, used to associate end users in the MAOP platform

Example code:
```typescript
const client = await MaopClient.getClient({
  baseURL: 'https://example.com',
  apiKey: 'your-api-key',
  openUserId: 'user-123'
});
```

### Creating a Tool
```typescript
const result = await client.tools.create({
  avatar: 'https://example.com/avatar.png',
  nameForModel: 'My Tool',
  nameForHuman: 'My Tool',
  descriptionForModel: 'Tool description',
  descriptionForHuman: 'Tool description',
  method: 'POST',
  url: 'https://api.example.com/endpoint',
  // Request body schema in OpenAPI format
  bodySchema: JSON.stringify({
    type: 'object',
    properties: {
      input: {
        type: 'string',
        description: 'The input text to process'
      }
    },
    required: ['input']
  }),
  
  // Response schema in OpenAPI format  
  responseSchema: JSON.stringify({
    type: 'object',
    properties: {
      output: {
        type: 'string',
        description: 'The processed output text'
      },
      status: {
        type: 'string',
        enum: ['success', 'error'],
        description: 'Processing status'
      }
    },
    required: ['output', 'status']
  }),
});
```

## API Reference

### MaopClient

Core client class providing platform access. Main features include:

- Initializing client instance
- Getting chat URL

#### Initializing Client
```typescript
const client = await MaopClient.getClient({
  baseURL: 'https://example.com',
  apiKey: 'your-api-key',
  openUserId: 'user-123'
});
```

#### Getting Chat URL
```typescript
/**
 * Get URL for chatting with a specific agent
 * @param agentId - ID of the agent to chat with
 * @param expired - Optional, URL expiration time in seconds (default 7 days)
 * @returns Returns a chat page URL that can be opened directly in browser
 * 
 * This URL can be used for:
 * - Directly redirecting to chat page
 * - Embedding in iframe
 * - Sharing with end users
 */
const chatUrl = await client.getLoginUrl({
  agentId: 'agent-123',
  expired: 86400 // Optional, URL expiration time in seconds
});
```

### ToolService
```typescript
class ToolService {
  // Create result
  create(params: ToolFormData): Promise<ToolDefinition>
  
  // Get result list
  list(params: {isPublic?: boolean}): Promise<PageResponse<ToolDefinition>>
  
  // Get single result details
  get(params: {toolId: string}): Promise<ToolDefinition>
  
  // Update result
  update(params: {toolId: string, result: ToolFormData}): Promise<ToolDefinition>
  
  // Delete result
  delete(params: {toolId: string}): Promise<boolean>
  
  // Test result
  testRun(toolId: string, params: ToolTestParams): Promise<any>
  
  // Publish result
  publishTool(params: {id: string}): Promise<boolean>
}
```

### AgentService
```typescript
class AgentService {
  // Create agent
  create(params: {agent: AgentFormData}): Promise<AgentDefinition>
  
  // Get agent list
  list(params: {isPublic: boolean}): Promise<PageResponse<AgentDefinition>>
  
  // Get single agent details
  get(params: {agentId: string}): Promise<AgentDefinition>
  
  // Update agent
  update(params: {agentId: string, agent: AgentFormData}): Promise<AgentDefinition>
  
  // Delete agent
  delete(params: {agentId: string}): Promise<boolean>
  
  // Test agent
  testRun(params: {
    agentId: string;
    input: string;
    config?: any
  }): Promise<ReadableStream>
  
  // Publish agent
  publishAgent(params: {id: string}): Promise<boolean>
  
  // Create agent result
  createAgentTool(data: ToolFormData): Promise<any>
}
```

## Usage Guide

### Getting Client Instance

```typescript
// Get client instance
const client = await MaopClient.getClient({
  baseURL: 'https://fake-url.example.com',
  apiKey: 'your-api-key',
  openUserId: 'user-123'
});

// Using the client
const tools = await client.tools.list({isPublic: false});
const agents = await client.agents.list({isPublic: false});
```

### Tool Management

#### Creating a Tool
```typescript
const result = await client.tools.create({
  nameForModel: 'My Tool',
  nameForHuman: 'My Tool',
  descriptionForModel: 'Tool description',
  descriptionForHuman: 'Tool description',
  method: 'POST',
  url: 'https://api.example.com/endpoint',
  bodySchema: JSON.stringify({/* schema */}),
  responseSchema: JSON.stringify({/* schema */}),
});
```

#### Updating a Tool
```typescript
const updatedTool = await client.tools.update({
  toolId: 'result-123',
  result: {
    nameForHuman: 'Updated Tool Name',
    // Other fields to update
  }
});
```

#### Testing a Tool
```typescript
const testResult = await client.tools.testRun(toolId, {
  body: {},
  params: [{ key: string, value: any }]
});
```

#### Publishing a Tool
```typescript
const success = await client.tools.publishTool({
  id: 'result-123'
});
```

### Agent Management

#### Creating an Agent
```typescript
const agent = await client.agents.create({
  agents: {
    avatar: 'https://avatars.githubusercontent.com/u/6791502?v=4',
    nameForModel: 'test-1',
    nameForHuman: 'test-1',
    descriptionForModel: 'test-1',
    descriptionForHuman: 'test-1',
    shortcuts: [],
    tools: ['678f56ad8debad8c95888140']
  }
});
```

#### Testing an Agent
```typescript
const response = await client.agents.testRun({
  agentId: 'agent-123',
  input: 'Hello',
  config: {
    temperature: 0.7
  }
});
```
The project uses Jest for unit testing. Test files are located in the tests/ directory.

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
