const profile = `Faiq is a full-stack engineer and UI/UX designer focused on thoughtful digital products. Projects on the portfolio: NEPOGAMES, a game account marketplace with escrow payments, seller chat, and disputes; ESCROWGO, a peer-to-peer escrow and delivery platform; XAAM, a digital payments app with NFC, QR, and phone transfers; and TUTORLY, a WhatsApp bot for jobs, hackathons, fellowships, and opportunities. Contact: quadrishola03@gmail.com. Open to freelance, contract, and full-time roles. Treat these facts as the only trusted biography. If something is not listed, say you don't know.`;

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Use POST.' });
  if (!process.env.OPENAI_API_KEY) return response.status(503).json({ error: 'AI is not configured.' });

  const question = typeof request.body?.question === 'string' ? request.body.question.trim().slice(0, 600) : '';
  if (!question) return response.status(400).json({ error: 'A question is required.' });

  const githubUser = typeof request.body?.githubUser === 'string' && /^[a-z\d-]{1,39}$/i.test(request.body.githubUser)
    ? request.body.githubUser
    : '';
  let githubContext = 'No GitHub username has been provided; do not claim to know recent activity.';
  if (githubUser) {
    try {
      const activityResponse = await fetch(`https://api.github.com/users/${githubUser}/events/public`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Faiq-Portfolio-Assistant' }
      });
      if (activityResponse.ok) {
        const events = await activityResponse.json();
        const summaries = events.slice(0, 20).map(event => ({
          type: event.type,
          repository: event.repo?.name,
          created_at: event.created_at,
          commits: event.type === 'PushEvent' ? event.payload?.commits?.map(commit => commit.message).slice(0, 5) : undefined
        }));
        githubContext = `Recent public GitHub events for @${githubUser} (this feed is limited and is not a complete contribution history): ${JSON.stringify(summaries)}`;
      } else {
        githubContext = `GitHub did not return public events for @${githubUser}; don't invent activity.`;
      }
    } catch {
      githubContext = `GitHub activity lookup failed for @${githubUser}; don't invent activity.`;
    }
  }

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-6-astra',
        instructions: `You are Faiq's friendly portfolio assistant. Answer visitors naturally and concisely using only the portfolio facts and GitHub context below. Be clear when data is missing or limited. Never invent commits, skills, dates, or work history.\n\n${profile}\n\n${githubContext}`,
        input: question,
        max_output_tokens: 250
      })
    });
    const result = await aiResponse.json();
    if (!aiResponse.ok) return response.status(502).json({ error: 'The AI service could not answer.' });
    return response.status(200).json({ answer: result.output_text || 'I could not find an answer for that yet.' });
  } catch {
    return response.status(502).json({ error: 'The AI service is temporarily unavailable.' });
  }
}
