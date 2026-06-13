import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mergedData } = body;

    if (!mergedData) {
      return NextResponse.json({ error: "Missing mergedData" }, { status: 400 });
    }

const safeDataString = JSON.stringify({
  personalInfo: mergedData.personalInfo,
  skills: mergedData.skills,
  experience: mergedData.experience,
  projects: mergedData.projects,
  education: mergedData.education
}).substring(0, 3000); // Prevent 90,000 token rate limit errors

    const promptText = `You are an expert tech recruiter and personal branding coach.
Based on the following user data (skills, experience, and projects), generate a compelling professional headline and a short professional bio.

User Data:
${safeDataString}

Return ONLY a valid JSON object matching this exact structure:
{
  "headline": "A punchy, 5-8 word headline (e.g. 'Full-Stack Developer | Building Scalable Web Apps')",
  "bio": "A professional, engaging 3-4 sentence summary of their expertise, background, and passion."
}
Do not wrap in markdown blocks.`;

    let resultText = "";
    let geminiError = "";
    
    // 1. Try Gemini
    try {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) throw new Error("GEMINI_API_KEY not configured");
      
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(promptText);
      resultText = result.response.text().trim();
    } catch (err: any) {
      geminiError = err.message || "Unknown Gemini Error";
      console.warn(`Gemini API failed (${geminiError}), falling back to Groq...`);
      
      // 2. Try Groq Fallback
      try {
        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) throw new Error("GROQ_API_KEY not configured");
        
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // Safe model that explicitly supports json_object
            messages: [{ role: "user", content: promptText }],
            response_format: { type: "json_object" }
          })
        });
        
        if (!groqRes.ok) {
          const errorText = await groqRes.text();
          throw new Error(`Groq API error: ${groqRes.status} ${errorText}`);
        }
        
        const groqData = await groqRes.json();
        if (groqData.choices && groqData.choices[0] && groqData.choices[0].message) {
          resultText = groqData.choices[0].message.content.trim();
        } else {
          throw new Error("Invalid response format from Groq");
        }
      } catch (groqErr: any) {
        console.error(`Both APIs failed. Gemini: ${geminiError} | Groq: ${groqErr.message}`);
        
        // 3. Smart Local Fallback (Derived from User's uploaded resume data)
        const skills = mergedData.skills?.slice(0, 3).join(", ") || "various technologies";
        const role = mergedData.experience?.[0]?.role || "Professional Developer";
        
        return NextResponse.json({
          headline: `${role} | Specialized in ${skills}`,
          bio: `Experienced professional with a strong background in ${skills}. Proven track record in delivering high-quality results and driving innovation. Passionate about leveraging technical skills to build impactful solutions.`
        }, { status: 200 });
      }
    }

    // 4. Parse AI Response
    let parsedData;
    try {
      const cleanText = resultText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleanText);
      
      if (!parsedData.headline || !parsedData.bio) {
         throw new Error("Missing required JSON fields");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", resultText);
      
      const skills = mergedData.skills?.slice(0, 3).join(", ") || "various technologies";
      const role = mergedData.experience?.[0]?.role || "Professional Developer";
      
      parsedData = {
        headline: `${role} | Specialized in ${skills}`,
        bio: resultText.length > 20 ? resultText.substring(0, 200) + "..." : `Experienced professional with a strong background in ${skills}.`
      };
    }

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Enhance error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate enhancements" }, { status: 500 });
  }
}
