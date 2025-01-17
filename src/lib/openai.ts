import OpenAI from 'openai';

const CATEGORIES = {
  'Grocery Shopping': ['pingo doce', 'continente', 'minipreco', 'grocery', 'supermarket', 'food shopping'],
  'Meals Out': ['restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'meal'],
  'Transportation': ['uber', 'taxi', 'bus', 'metro', 'train', 'fuel', 'gas'],
  'Housing': ['rent', 'mortgage', 'housing'],
  'Utilities': ['electricity', 'water', 'gas', 'internet', 'phone'],
  'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medical', 'health'],
  'Entertainment': ['cinema', 'movie', 'netflix', 'spotify', 'concert'],
  'Office Costs': ['office', 'supplies', 'equipment', 'software'],
  'Professional Services': ['consulting', 'legal', 'accounting', 'freelance'],
  'Income': ['salary', 'dividend', 'interest', 'revenue', 'payment received']
} as const;

function categorizeByKeywords(description: string): string {
  const lowercaseDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => lowercaseDesc.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

export async function categorizeTransaction(description: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey?.startsWith('sk-') || apiKey.includes('proj')) {
    console.warn('Invalid OpenAI API key format, using keyword categorization');
    return categorizeByKeywords(description);
  }

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a transaction categorizer. Given a transaction description, return only a single category name from this list: ${Object.keys(CATEGORIES).join(', ')}, Other. No explanation needed, just the category name.`
        },
        {
          role: "user",
          content: description
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const category = response.choices[0].message.content?.trim();
    if (!category || !Object.keys(CATEGORIES).includes(category)) {
      return categorizeByKeywords(description);
    }

    return category;
  } catch (error) {
    if (error?.error?.code === 'insufficient_quota') {
      console.error('OpenAI API quota exceeded');
    } else {
      console.error('OpenAI API error:', error);
    }
    return categorizeByKeywords(description);
  }
}