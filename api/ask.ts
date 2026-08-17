import { retrieveKnowledge } from '../knowledge';

interface ApiRequest {
  method?: string;
  body?: { question?: unknown };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

export default async function handler(request: ApiRequest, response: ApiResponse): Promise<void> {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: 'DEEPSEEK_API_KEY is not configured' });
    return;
  }

  try {
    const question = request.body?.question;
    if (typeof question !== 'string' || !question.trim() || question.length > 120) {
      response.status(400).json({ error: 'Invalid question' });
      return;
    }

    const sources = retrieveKnowledge(question, 4);
    const context = sources.map((item) => `[${item.id}] ${item.title}（${item.period}）：${item.content}`).join('\n');
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
    const deepSeekResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: '你是山西大学校史馆的数字讲解员。只能根据提供的馆藏资料回答，不得补充资料之外的事实。资料不足时必须明确说“当前馆藏资料暂未覆盖这个问题”。回答控制在180字以内，语气亲切，并在结尾给出参观建议。',
          },
          {
            role: 'user',
            content: `馆藏资料：\n${context}\n\n用户问题：${question}`,
          },
        ],
        thinking: { type: 'disabled' },
        temperature: 0.2,
        max_tokens: 320,
        stream: false,
      }),
    });

    if (!deepSeekResponse.ok) throw new Error('DeepSeek request failed');
    const result = await deepSeekResponse.json();
    const answer = result.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error('DeepSeek returned no answer');

    response.status(200).json({
      answer,
      sourceIds: sources.map((item) => item.id),
      suggestedHallId: sources[0].hallId,
    });
  } catch {
    response.status(502).json({ error: 'AI service unavailable' });
  }
}
