import { NextResponse } from 'next/server';
import { MaopClient } from 'mahuap';

const getMaopClient = async () => {
    const config = {
        baseURL: process.env.MAOP_BASE_URL!,
        apiKey: process.env.MAOP_API_KEY!,
        openUserId: process.env.MAOP_USER_ID!
    }
    console.log(`MAOP config: ${JSON.stringify(config)}`);

    const client = await MaopClient.getClient(config);

    return client;
};

export async function POST(request: Request) {
    const client = await getMaopClient();
    const { action, payload } = await request.json();
    console.log('MAOP action:', action, 'payload:', payload);

    try {
        let result;
        switch (action) {
            case 'testRunTool':
                result = await client.tools.testRun(payload.toolId, {
                    params: [], body: {}
                });
                break
            case 'testRunAgent':
                result = await client.agents.testRun({
                    agentId: payload.agentId,
                    input: 'Hi'
                });
                break
            case 'updateTool':
                result = await client.tools.update(payload.toolId, payload.tool);
                break;
            case 'updateAgent':
                payload.agent.tools = ['67a49afda9575c4df9397def']
                result = await client.agents.update(payload.agentId, payload.agent);
                break;
            case 'createTool':
                result = await client.tools.create(payload);
                break;
            case 'createAgent':
                result = await client.agents.create(payload);
                break;
            case 'listTools':
                result = await client.tools.list({ isPublic: false });
                break;
            case 'listAgents':
                result = await client.agents.list({ isPublic: false });
                break;
            case 'deleteTool':
                result = await client.tools.delete(payload.toolId);
                break;
            case 'deleteAgent':
                result = await client.agents.delete(payload.agentId);
                break;
            case 'publishTool':
                result = await client.tools.publishTool(payload.toolId);
                break;
            case 'publishAgent':
                result = await client.agents.publishAgent(payload.agentId);
                break;
            case 'getChatUrl':
                result = await client.getLoginUrl({ agentId: payload.agentId });
                break;
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
        console.log('MAOP result:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.log('MAOP error:', JSON.stringify(error));

        return NextResponse.json({ error: error }, { status: 500 });
    }
}
