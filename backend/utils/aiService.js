const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeSentiment = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Analyze the sentiment of this student's forum post. 
    Return only a single word: Positive, Negative, Neutral, or Doubt.
    Post: "${content}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    console.log(text);

    return ["Positive", "Negative", "Neutral", "Doubt"].includes(text) ? text : "Neutral";
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Neutral";
  }
};

const generateSubjectSummary = async (posts) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const textToSummarize = posts
      .map(p => `Title: ${p.title} | Content: ${p.content}`)
      .join("\n---\n");

    const prompt = `You are a Teaching Assistant. Summarize the following forum posts from the last 24 hours into exactly 3 concise bullet points. 
    Focus on: What are students confused about, what is the general mood, and what action could be taken? Do not instruct the teacher but give neutral advise from a student perspective as in 'students could use more material on this topic' not ' teacher should post more material'
    Posts:
    ${textToSummarize}`;

    const result = await model.generateContent(prompt);
    var res=result.response.text();
    res=res.replaceAll("*","");
    return res;
  } catch (error) {
    console.error("Summary failed:", error);
    return "Could not generate summary at this time.";
  }
};

module.exports={analyzeSentiment,generateSubjectSummary};