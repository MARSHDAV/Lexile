import { GoogleGenAI, Type } from "@google/genai";
import type { FullAnalysisResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    readingAge: {
      type: Type.NUMBER,
      description: 'The estimated reading age required to understand the term. Should be a single number.'
    },
    schoolYear: {
      type: Type.STRING,
      description: 'The corresponding UK school year group (e.g., "UK Year 8", "A-Level", "University Level").'
    },
    ageGroup: {
      type: Type.STRING,
      description: 'The general age of a person expected to understand (e.g., "12-13 years old", "18+").'
    },
    profession: {
      type: Type.STRING,
      description: 'If it is a technical term, the profession(s) that would typically use it. Otherwise, return "N/A".'
    },
    pearsonSyllabus: {
        type: Type.STRING,
        description: 'If the term is a business or finance term, identify the Pearson business syllabus for the lowest school level it appears on (e.g., choose GCSE over A-Level). Base this on verified, publicly available syllabus documents. If its presence cannot be verified, return "Not Verifiable". If the term is not a business term, return "N/A".'
    }
  },
  required: ['readingAge', 'schoolYear', 'ageGroup', 'profession', 'pearsonSyllabus'],
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        isValidTerm: {
            type: Type.BOOLEAN,
            description: "Is the original term a valid English word or a commonly recognized phrase?"
        },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "If the term is not valid, provide a list of spelling corrections. If valid, return an empty array."
        },
        analyses: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    definition: {
                        type: Type.STRING,
                        description: "A brief definition explaining the context of the term's specific meaning."
                    },
                    analysis: analysisSchema
                },
                required: ['definition', 'analysis']
            },
            description: "List of analyses for each meaning. If the term is invalid, this can be an empty array."
        }
    },
    required: ['isValidTerm', 'suggestions', 'analyses']
};


export const analyzeTerm = async (term: string): Promise<FullAnalysisResponse> => {
  if (!term || term.trim().length === 0) {
    throw new Error("Term cannot be empty.");
  }

  const prompt = `
    Analyze the following word or phrase: "${term}". Your response must be a single JSON object.

    1. First, in the 'isValidTerm' field, determine if the term is a valid English word or a commonly recognized phrase. Set it to true or false.

    2. Second, if 'isValidTerm' is false, provide a list of spelling 'suggestions'. If it is a valid term, 'suggestions' must be an empty array.

    3. Third, proceed to the 'analyses' step.
      - If the term is valid, perform a full analysis.
      - If the term is invalid and has no suggestions (i.e., it's a made-up word), the 'analyses' array MUST be empty.

    The analysis involves identifying if the term has one or more distinct common meanings. For each meaning, provide:
    1. A short, clear 'definition'.
    2. A detailed 'analysis' object.

    The 'analysis' object must include:
    - 'readingAge': A number.
    - 'schoolYear': The corresponding UK school year.
    - 'ageGroup': The general age group.
    - 'profession': The relevant profession(s), or "N/A".
    - 'pearsonSyllabus': If the term is a business or finance term, identify the Pearson business syllabus it appears on, based on publicly available specifications. If it appears on multiple syllabi (e.g., GCSE and A-Level), return only the syllabus for the lowest/earliest school level (e.g., choose "Pearson GCSE Business" over "Pearson A-Level Business"). If you cannot confidently verify its presence on a syllabus, return "Not Verifiable". If the term is not business-related, return "N/A".

    If the term has one meaning, the 'analyses' array will have one object. If multiple, an object for each.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as FullAnalysisResponse;
    return parsedResult;
  } catch (error) {
    console.error("Error analyzing term with Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the analysis from Gemini. The format was unexpected.");
    }
    throw new Error("Failed to get analysis from Gemini. Please check your API key and try again.");
  }
};