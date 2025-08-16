// Utility for DeepSeek AI risk assessment

export interface DeepSeekResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendations: string[];
}

export async function assessRiskWithDeepSeek(
  form: Record<string, any>,
  apiKey: string
): Promise<DeepSeekResult | null> {
  const prompt = `You are a maternal health expert AI assistant. Assess the risk level of a pregnant woman based on the following data and provide recommendations. Respond in JSON format with fields: riskLevel (low, medium, high), riskFactors (array of strings), and recommendations (array of strings).\n\nData: ${JSON.stringify(form, null, 2)}`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a maternal health expert AI assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 512,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content in DeepSeek response');

    // Try to parse JSON from the model's response
    let parsed: any = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from the response if it is inside a code block
      const match = content.match(/```json([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        throw e;
      }
    }
    return {
      riskLevel: parsed.riskLevel,
      riskFactors: parsed.riskFactors,
      recommendations: parsed.recommendations,
    };
  } catch (error) {
    console.error('DeepSeek risk assessment failed:', error);
    return null;
  }
}
