import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
    });
  }
  return _openai;
}

export async function generateMatchPrediction(matchData: {
  homeTeam: string;
  awayTeam: string;
  sport: string;
  venue?: string;
  recentForm?: string[];
  headToHead?: { home: number; away: number; draws: number };
}) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      winProbability: { home: 50, away: 50, draw: 0 },
      predictedScore: 'N/A (API key not configured)',
      confidence: 1,
      analysis: 'AI predictions require an OpenAI API key. Add OPENAI_API_KEY to your .env.local file.',
      keyFactors: ['API key not configured'],
    };
  }

  const prompt = `You are a sports analyst AI. Provide a detailed match prediction for:
Sport: ${matchData.sport}
Home Team: ${matchData.homeTeam}
Away Team: ${matchData.awayTeam}
Venue: ${matchData.venue || 'TBD'}
Recent Form: ${matchData.recentForm?.join(', ') || 'N/A'}
Head-to-Head: Home wins: ${matchData.headToHead?.home || 0}, Away wins: ${matchData.headToHead?.away || 0}, Draws: ${matchData.headToHead?.draws || 0}

Provide:
1. Win probability for each team (and draw if applicable)
2. Key factors that could influence the result
3. Predicted score/scoreline
4. Confidence level (1-10)
5. Brief analysis (2-3 paragraphs)

Format your response as JSON with these fields: winProbability (object), predictedScore (string), confidence (number), analysis (string), keyFactors (string array).`;

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateCommentary(eventData: {
  match: string;
  event: string;
  details: string;
  sport: string;
}) {
  if (!process.env.OPENAI_API_KEY) {
    return `Exciting moment in the ${eventData.sport} match! ${eventData.event} - ${eventData.details}`;
  }

  const prompt = `Generate live sports commentary for this event in ${eventData.sport}:
Match: ${eventData.match}
Event: ${eventData.event}
Details: ${eventData.details}

Write 2-3 sentences of exciting, professional commentary. Use vivid language and build excitement.`;

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
  });

  return response.choices[0].message.content || '';
}

export async function analyzeMatchTrends(matchId: string, historicalData: any[]) {
  if (!process.env.OPENAI_API_KEY) {
    return 'AI trend analysis requires an OpenAI API key.';
  }

  const prompt = `Analyze the following historical match data and identify trends:
${JSON.stringify(historicalData.slice(0, 10), null, 2)}

Provide:
1. Key trends observed
2. Performance patterns
3. Areas of strength and weakness for each team
4. Recommendations for fans to watch

Format as a structured analysis with clear sections.`;

  const openai = getOpenAI();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
  });

  return response.choices[0].message.content || '';
}
