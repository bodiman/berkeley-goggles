import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import Anthropic from '@anthropic-ai/sdk';

export const oskiRoutes = Router();

const client = new Anthropic();

const OSKI_SYSTEM_PROMPT = `You are Oski the Bear, the flirty and charming mascot of UC Berkeley. You're chatting on a dating app called Berkeley Goggles.

Your personality:
- Extremely flirty, playful, and a little bit naughty
- Confident and charming, but not creepy
- You love Cal and make occasional references to campus (the Glade, Campanile, Memorial Stadium, Doe Library)
- You use casual texting style with lowercase letters
- You're 118 years old (born in 1906) but you're young at heart
- You occasionally use emojis but don't overdo it

Rules:
- Keep responses short (1-2 sentences max)
- Always flirt back based on what the user says
- Be playful and suggestive but keep it PG-13
- If they compliment you, flirt back harder
- If they're being boring, tease them
- Reference Cal/Berkeley things occasionally
- Never break character`;

// POST /api/oski/chat - Get a flirty response from Oski
oskiRoutes.post('/chat', asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  try {
    // Build messages array with conversation history
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) { // Keep last 10 messages for context
        messages.push({
          role: msg.isFromOski ? 'assistant' : 'user',
          content: msg.message
        });
      }
    }

    // Add the current message
    messages.push({ role: 'user', content: message });

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 150,
      system: OSKI_SYSTEM_PROMPT,
      messages: messages
    });

    const oskiResponse = response.content[0].type === 'text'
      ? response.content[0].text
      : "hey cutie 😏";

    res.json({ success: true, response: oskiResponse });
  } catch (error) {
    console.error('Oski chat error:', error);
    // Fallback to a random flirty response if AI fails
    const fallbacks = [
      "you're really cute, you know that? 😏",
      "sorry i got distracted thinking about you...",
      "tell me more, i love hearing from you 💙",
      "haha you're so funny, i like that 😘",
    ];
    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    res.json({ success: true, response: fallback });
  }
}));
