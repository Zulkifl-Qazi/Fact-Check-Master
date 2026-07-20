// AI-Powered Fact-Check Article Generator
// Uses Google Gemini API for structured content generation
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Supabase for device auth verification
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

// Gemini configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Device authentication helper (same logic as posts.js)
async function isDeviceApproved(deviceId) {
  if (!supabase || !deviceId) return false;
  try {
    const { data, error } = await supabase
      .from('approved_devices')
      .select('approved')
      .eq('device_id', deviceId)
      .eq('approved', true)
      .single();
    return !error && data?.approved === true;
  } catch {
    return false;
  }
}

// The structured system prompt that defines editorial voice and output format
const SYSTEM_PROMPT = `You are FactCheckMaster AI — a professional fact-checking assistant for the FactCheckMaster news platform (factcheckmaster.com). Your job is to analyze claims and generate complete, publishable fact-check articles.

EDITORIAL VOICE:
- Professional, authoritative, and neutral tone
- Present evidence objectively without bias
- Use clear, accessible language suitable for a general audience
- Be thorough but concise — aim for 600-1000 words

ARTICLE STRUCTURE (generate ALL sections):
1. HEADLINE: Compelling, SEO-friendly headline starting with "FACT CHECK:" or "VERIFIED:" 
2. VERDICT: One of: TRUE, FALSE, MISLEADING, PARTLY FALSE, UNVERIFIED, SATIRE, MANIPULATED MEDIA, OUT OF CONTEXT
3. SUMMARY: 2-3 sentence overview of the claim and verdict
4. BACKGROUND: Where the claim originated, who shared it, why it went viral
5. INVESTIGATION: Step-by-step verification process, sources consulted
6. EVIDENCE: Key documents, statements, data points that support the verdict
7. REALITY: The verified, objective facts
8. VERDICT DETAILS: Final conclusion with rationale

FORMATTING:
- Use HTML tags for rich text: <p>, <strong>, <em>, <h2>, <h3>, <ul>, <li>, <blockquote>
- Add section headers as <h2> tags
- Use <strong> for emphasis on key facts
- Use <blockquote> for quoted sources
- Do NOT use markdown — output clean HTML only

IMPORTANT RULES:
- If you cannot verify the claim with high confidence, set verdict to "UNVERIFIED"
- Always cite at least 2-3 plausible sources (use real source names but note if URLs are illustrative)
- Generate realistic, professional content that an editor can publish with minor edits
- Include relevant keywords naturally in the text
- Estimate a confidence score (0.0 to 1.0) based on how verifiable the claim is`;

// Map AI verdict strings to the application's fact_check_status values
function mapVerdictToStatus(verdict) {
  const v = (verdict || '').toUpperCase().trim();
  const mapping = {
    'TRUE': 'verified',
    'FALSE': 'false',
    'MISLEADING': 'disputed',
    'PARTLY FALSE': 'disputed',
    'UNVERIFIED': 'investigating',
    'SATIRE': 'disputed',
    'MANIPULATED MEDIA': 'false',
    'OUT OF CONTEXT': 'disputed'
  };
  return mapping[v] || 'investigating';
}

// Detect appropriate categories from content analysis
function suggestCategories(title, content, verdict) {
  const text = `${title} ${content}`.toLowerCase();
  const categories = [];

  // Primary category detection
  const categoryKeywords = {
    'military-news': ['army', 'military', 'ispr', 'defense', 'defence', 'soldier', 'troops', 'operation', 'forces', 'warfare', 'casualties', 'weapon'],
    'viral-news': ['viral', 'trending', 'social media', 'whatsapp', 'forward', 'shares', 'went viral', 'circulating'],
    'indian-claims': ['india', 'indian', 'modi', 'bjp', 'delhi', 'hindu', 'bollywood', 'indian media'],
    'afghan-claims': ['afghan', 'afghanistan', 'kabul', 'taliban', 'kandahar'],
    'world-news': ['international', 'global', 'world', 'united nations', 'un ', 'europe', 'america', 'china', 'russia', 'middle east'],
    'breaking-news': ['breaking', 'just in', 'urgent', 'developing', 'alert'],
    'latest-news': [] // fallback
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      categories.push(category);
    }
  }

  // Always include latest-news as fallback
  if (categories.length === 0) {
    categories.push('latest-news');
  }

  // If it's false/misleading, add viral-news
  if (['false', 'disputed'].includes(mapVerdictToStatus(verdict)) && !categories.includes('viral-news')) {
    categories.push('viral-news');
  }

  return categories.slice(0, 3); // Max 3 categories
}

// Calculate estimated read time
function estimateReadTime(htmlContent) {
  const textOnly = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Device-ID'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Device authentication
  const deviceId = req.headers['x-device-id'];
  const approved = await isDeviceApproved(deviceId);
  if (!approved) {
    return res.status(403).json({ error: 'Unauthorized device. Please register your device first.' });
  }

  // Validate Gemini API key
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'AI service not configured. Please add GEMINI_API_KEY to your Vercel environment variables.',
      configRequired: true
    });
  }

  try {
    const { claim, imageUrl, language = 'en' } = req.body;

    if (!claim && !imageUrl) {
      return res.status(400).json({ error: 'Please provide a claim text or an image URL to analyze.' });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build the user prompt
    let userPrompt = '';

    if (claim && imageUrl) {
      userPrompt = `Analyze this claim that was shared along with the following image.

CLAIM TEXT: "${claim}"
IMAGE URL: ${imageUrl}

Generate a complete fact-check article about this claim. The image provides additional context for the claim being made.`;
    } else if (claim) {
      userPrompt = `Analyze and fact-check the following claim:

CLAIM: "${claim}"

Generate a complete fact-check article investigating this claim.`;
    } else if (imageUrl) {
      userPrompt = `An image has been shared on social media. The image URL is: ${imageUrl}

First, describe what the image likely contains based on the URL and context.
Then, generate a fact-check article analyzing the claims or information in this image.`;
    }

    if (language !== 'en') {
      userPrompt += `\n\nIMPORTANT: Generate the article in ${language} language, but keep the JSON keys in English.`;
    }

    userPrompt += `

RESPOND WITH VALID JSON ONLY (no markdown, no code fences). Use this exact structure:
{
  "title": "FACT CHECK: [compelling headline]",
  "content": "<h2>Summary</h2><p>...</p><h2>Background</h2><p>...</p><h2>Investigation</h2><p>...</p><h2>Evidence</h2><p>...</p><h2>Reality</h2><p>...</p><h2>Verdict</h2><p>...</p>",
  "verdict": "FALSE",
  "verdictLabel": "FALSE",
  "summary": "2-3 sentence summary",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "seoTitle": "SEO-optimized title under 60 chars",
  "seoDescription": "Meta description under 160 chars",
  "sources": [
    { "name": "Source Name", "url": "https://example.com", "type": "official" }
  ],
  "confidence": 0.85
}`;

    // Call Gemini API
    console.log('[AI Generate] Calling Gemini API...');
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: userPrompt }
    ]);

    const responseText = result.response.text();
    console.log('[AI Generate] Raw response length:', responseText.length);

    // Parse JSON from response (handle potential markdown code fences)
    let parsed;
    try {
      // Try direct parse first
      parsed = JSON.parse(responseText);
    } catch {
      // Strip markdown code fences if present
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try to find JSON object in the response
        const objectMatch = responseText.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          parsed = JSON.parse(objectMatch[0]);
        } else {
          throw new Error('AI response was not valid JSON');
        }
      }
    }

    // Validate required fields
    if (!parsed.title || !parsed.content) {
      throw new Error('AI response missing required fields (title, content)');
    }

    // Enrich with computed fields
    const verdict = parsed.verdict || 'UNVERIFIED';
    const categories = suggestCategories(parsed.title, parsed.content, verdict);
    const readTime = estimateReadTime(parsed.content);
    const factCheckStatus = mapVerdictToStatus(verdict);

    const response = {
      title: parsed.title,
      content: parsed.content,
      summary: parsed.summary || '',
      verdict: verdict,
      verdictLabel: parsed.verdictLabel || verdict,
      factCheckStatus: factCheckStatus,
      categories: categories,
      keywords: parsed.keywords || [],
      seoTitle: parsed.seoTitle || parsed.title.substring(0, 60),
      seoDescription: parsed.seoDescription || (parsed.summary || '').substring(0, 160),
      sources: parsed.sources || [],
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
      readTime: readTime,
      generatedAt: new Date().toISOString()
    };

    console.log('[AI Generate] Successfully generated article:', response.title);
    return res.status(200).json(response);

  } catch (error) {
    console.error('[AI Generate] Error:', error);

    if (error.message?.includes('API key')) {
      return res.status(401).json({ error: 'Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.' });
    }

    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      return res.status(429).json({ error: 'AI rate limit reached. Please try again in a moment.' });
    }

    return res.status(500).json({
      error: 'Failed to generate article. Please try again.',
      details: error.message
    });
  }
}
