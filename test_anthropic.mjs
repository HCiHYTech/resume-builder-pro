import { readFileSync } from 'fs';
const envContent = readFileSync('.env.local', 'utf-8');
const match = envContent.match(/ANTHROPIC_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;
console.log('Key loaded, length:', apiKey ? apiKey.length : 'NONE');

const Anthropic = (await import('@anthropic-ai/sdk')).default;
const anthropic = new Anthropic({ apiKey });

const IMPORT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    skills: { type: 'array', items: { type: 'string' } },
  },
  required: ['title', 'summary', 'skills'],
  additionalProperties: false,
};

try {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: 'You are a precise resume parser.',
    messages: [{ role: 'user', content: 'Analyze this resume: John Doe, Software Engineer at Acme Corp, skilled in Python.' }],
    output_config: { format: { type: 'json_schema', schema: IMPORT_SCHEMA } },
  });
  console.log('SUCCESS');
  console.log(JSON.stringify(message, null, 2));
} catch (err) {
  console.log('ERROR NAME:', err.name);
  console.log('ERROR STATUS:', err.status);
  console.log('ERROR MESSAGE:', err.message);
  console.log('ERROR DETAIL:', JSON.stringify(err.error || err.errors || {}, null, 2));
}
