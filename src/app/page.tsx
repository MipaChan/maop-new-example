/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import type { Method, ToolFormData, AgentFormData } from 'mahuap';

export default function Home() {
  const [tools, setTools] = useState([]);
  const [agents, setAgents] = useState([]);
  const [chatUrl, setChatUrl] = useState('');
  const [editingTool, setEditingTool] = useState<ToolFormData>();
  const [editingAgent, setEditingAgent] = useState<ToolFormData>();

  const callMaopApi = async (action: string, payload?: any) => {
    const response = await fetch('/api/maop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    if (!response.ok) throw new Error('API call failed');
    return await response.json();
  };

  const createTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const toolData: ToolFormData = {
      avatar: formData.get('avatar') as string,
      nameForModel: formData.get('nameForModel') as string,
      nameForHuman: formData.get('nameForHuman') as string,
      descriptionForModel: formData.get('descriptionForModel') as string,
      descriptionForHuman: formData.get('descriptionForHuman') as string,
      method: formData.get('method') as Method,
      url: formData.get('url') as string,
    };
    const result = await callMaopApi('createTool', toolData);
    console.log('Tool created:', result);
  };

  const createAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tools = []
    if (formData.get('toolId') as string) {
      tools.push(formData.get('toolId') as string)
    }
    const agentData: AgentFormData = {
      avatar: formData.get('avatar') as string,
      nameForModel: formData.get('nameForModel') as string,
      nameForHuman: formData.get('nameForHuman') as string,
      descriptionForModel: formData.get('descriptionForModel') as string,
      descriptionForHuman: formData.get('descriptionForHuman') as string,
      shortcuts: [],
      tools: tools
    };
    const result = await callMaopApi('createAgent', agentData);
    console.log('Agent created:', result);
  };

  const listTools = async () => {
    const result = await callMaopApi('listTools');
    console.log('Tools:', result);
    setTools(result.data.docs);
  };

  const listAgents = async () => {
    const result = await callMaopApi('listAgents');
    console.log('Agents:', result);

    setAgents(result.data.docs);
  };

  const getChatUrl = async (agentId: string) => {
    const result = await callMaopApi('getChatUrl', { agentId });
    setChatUrl(result);
  };

  const updateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const toolData: ToolFormData = {
      avatar: formData.get('avatar') as string,
      nameForModel: formData.get('nameForModel') as string,
      nameForHuman: formData.get('nameForHuman') as string,
      descriptionForModel: formData.get('descriptionForModel') as string,
      descriptionForHuman: formData.get('descriptionForHuman') as string,
      method: formData.get('method') as Method,
      url: formData.get('url') as string,
    };
    const result = await callMaopApi('updateTool', { toolId: editingTool.id, tool: toolData });
    console.log('Tool updated:', result);
    setEditingTool(null);
    await listTools();
  };

  const updateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tools = [];
    if (formData.get('toolId') as string) {
      tools.push(formData.get('toolId') as string);
    }
    const agentData: AgentFormData = {
      avatar: formData.get('avatar') as string,
      nameForModel: formData.get('nameForModel') as string,
      nameForHuman: formData.get('nameForHuman') as string,
      descriptionForModel: formData.get('descriptionForModel') as string,
      descriptionForHuman: formData.get('descriptionForHuman') as string,
      shortcuts: [],
      tools: tools
    };
    const result = await callMaopApi('updateAgent', { agentId: editingAgent.id, agent: agentData });
    console.log('Agent updated:', result);
    setEditingAgent(null);
    await listAgents();
  };

  return (
    <>
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}></main>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>MAOP SDK Demo</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <section style={sectionStyle}>
          <h2 style={headerStyle}>Create Tool</h2>
          <form onSubmit={createTool} style={formStyle}>
            <input style={inputStyle} name="avatar" placeholder="Avatar URL" defaultValue={'https://avatars.githubusercontent.com/u/6791502?v=4'} />
            <input style={inputStyle} name="nameForModel" placeholder="Name for Model" defaultValue={'name4model'} />
            <input style={inputStyle} name="nameForHuman" placeholder="Name for Human" defaultValue={'name 4 human'} />
            <input style={inputStyle} name="descriptionForModel" placeholder="Description for Model" defaultValue={'desc 4 model'} />
            <input style={inputStyle} name="descriptionForHuman" placeholder="Description for Human" defaultValue={'desc 4 human'} />
            <input style={inputStyle} name="method" placeholder="Method" defaultValue={'POST'} />
            <input style={inputStyle} name="url" placeholder="API URL" defaultValue={'https://api.example.com/endpoint'} />
            <button style={buttonStyle} type="submit">Create Tool</button>
          </form>
        </section>

        <section style={sectionStyle}>
          <h2 style={headerStyle}>Create Agent</h2>
          <form onSubmit={createAgent} style={formStyle}>
            <input style={inputStyle} name="avatar" placeholder="Avatar URL" defaultValue={'https://avatars.githubusercontent.com/u/6791502?v=4'} />
            <input style={inputStyle} name="nameForModel" placeholder="Name for Model" defaultValue={'name4model'} />
            <input style={inputStyle} name="nameForHuman" placeholder="Name for Human" defaultValue={'name 4 human'} />
            <input style={inputStyle} name="descriptionForModel" placeholder="Description for Model" defaultValue={'desc 4 model'} />
            <input style={inputStyle} name="descriptionForHuman" placeholder="Description for Human" defaultValue={'desc 4 human'} />
            <input style={inputStyle} name="toolId" placeholder="Tool ID" />
            <button style={buttonStyle} type="submit">Create Agent</button>
          </form>
        </section>
      </div>

      <section style={{ ...sectionStyle, marginTop: '20px' }}>
        <h2 style={headerStyle}>Tools and Agents</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button style={buttonStyle} onClick={listTools}>List Tools</button>
          <button style={buttonStyle} onClick={listAgents}>List Agents</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={listContainerStyle}>
            <h3 style={subHeaderStyle}>Tools count: {tools.length}</h3>
            {tools.map((tool: any) => (
              <div key={tool.id} style={itemStyle}>
                <p style={itemNameStyle}>{tool.nameForHuman}</p>
                <div style={buttonGroupStyle}>
                  <button style={smallButtonStyle} onClick={() => setEditingTool(tool)}>Edit</button>
                  <button style={smallButtonStyle} onClick={() => callMaopApi('deleteTool', { toolId: tool.id })}>Delete</button>
                  <button style={smallButtonStyle} onClick={() => callMaopApi('publishTool', { toolId: tool.id })}>Publish</button>
                  <button style={smallButtonStyle} onClick={() => callMaopApi('testRunTool', { toolId: tool.id })}>TestRun</button>
                </div>
              </div>
            ))}
          </div>

          <div style={listContainerStyle}>
            <h3 style={subHeaderStyle}>Agents count: {agents.length}</h3>

            {agents.map((agent: any) => (
              <div key={agent.id} style={itemStyle}>
                <p style={itemNameStyle}>{agent.nameForHuman}</p>
                <div style={buttonGroupStyle}>
                  <button style={smallButtonStyle} onClick={() => setEditingAgent(agent)}>Edit</button>
                  <button style={smallButtonStyle} onClick={() => callMaopApi('deleteAgent', { agentId: agent.id })}>Delete</button>
                  <button style={smallButtonStyle} onClick={() => callMaopApi('publishAgent', { agentId: agent.id })}>Publish</button>
                  <button style={smallButtonStyle} onClick={() => callMaopApi('testRunTool', { agentId: agent.id  })}>TestRun</button>
                  <button style={smallButtonStyle} onClick={() => getChatUrl(agent.id)}>Chat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {
        chatUrl && (
          <section style={{ ...sectionStyle, marginTop: '20px' }}>
            <h2 style={headerStyle}>Chat <a href={chatUrl}>{chatUrl}</a></h2>
            <iframe src={chatUrl} style={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </section>
        )
      }
      {editingTool && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={headerStyle}>Edit Tool</h2>
            <form onSubmit={updateTool} style={formStyle}>
              <input style={inputStyle} name="avatar" placeholder="Avatar URL" defaultValue={editingTool.avatar} />
              <input style={inputStyle} name="nameForModel" placeholder="Name for Model" defaultValue={editingTool.nameForModel} />
              <input style={inputStyle} name="nameForHuman" placeholder="Name for Human" defaultValue={editingTool.nameForHuman} />
              <input style={inputStyle} name="descriptionForModel" placeholder="Description for Model" defaultValue={editingTool.descriptionForModel} />
              <input style={inputStyle} name="descriptionForHuman" placeholder="Description for Human" defaultValue={editingTool.descriptionForHuman} />
              <input style={inputStyle} name="method" placeholder="Method" defaultValue={editingTool.method} />
              <input style={inputStyle} name="url" placeholder="API URL" defaultValue={editingTool.url} />
              <div style={buttonGroupStyle}>
                <button style={buttonStyle} type="submit">Update Tool</button>
                <button style={{ ...buttonStyle, backgroundColor: '#666' }} onClick={() => setEditingTool(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingAgent && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={headerStyle}>Edit Agent</h2>
            <form onSubmit={updateAgent} style={formStyle}>
              <input style={inputStyle} name="avatar" placeholder="Avatar URL" defaultValue={editingAgent.avatar} />
              <input style={inputStyle} name="nameForModel" placeholder="Name for Model" defaultValue={editingAgent.nameForModel} />
              <input style={inputStyle} name="nameForHuman" placeholder="Name for Human" defaultValue={editingAgent.nameForHuman} />
              <input style={inputStyle} name="descriptionForModel" placeholder="Description for Model" defaultValue={editingAgent.descriptionForModel} />
              <input style={inputStyle} name="descriptionForHuman" placeholder="Description for Human" defaultValue={editingAgent.descriptionForHuman} />
              <input style={inputStyle} name="toolId" placeholder="Tool ID" defaultValue={editingAgent.tools[0] || ''} />
              <div style={buttonGroupStyle}>
                <button style={buttonStyle} type="submit">Update Agent</button>
                <button style={{ ...buttonStyle, backgroundColor: '#666' }} onClick={() => setEditingAgent(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div >
      )
      }
    </>
  );
}

// Styles
const sectionStyle = {
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const headerStyle = {
  marginBottom: '20px',
  color: '#333',
  borderBottom: '2px solid #eee',
  paddingBottom: '10px',
};

const subHeaderStyle = {
  color: '#444',
  marginBottom: '15px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
};

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
};


const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '500',
};

const smallButtonStyle = {
  ...buttonStyle,
  padding: '6px 12px',
  fontSize: '12px',
};

const listContainerStyle = {
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '6px',
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: 'white',
  marginBottom: '8px',
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
};

const itemNameStyle = {
  margin: '0',
  fontSize: '14px',
  fontWeight: '500',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '8px',
};

const modalStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '500px',
};
