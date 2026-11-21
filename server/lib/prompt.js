import { KNOWLEDGE_META } from '../data/knowledge.js'

const BASE_SCHEMA = {
  type: 'object',
  properties: {
    answer: {
      type: 'string',
      description: 'The concise answer in the requested language.',
    },
    suggestedFollowUps: {
      type: 'array',
      description: 'Two or three useful follow-up questions in the requested language.',
      items: { type: 'string' },
    },
    relatedLinks: {
      type: 'array',
      description: 'Up to three relevant TuniVisa routes from the context.',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          to: { type: 'string' },
        },
        required: ['label', 'to'],
      },
    },
  },
  required: ['answer', 'suggestedFollowUps', 'relatedLinks'],
}

function strictify(value) {
  if (Array.isArray(value)) return value.map(strictify)
  if (!value || typeof value !== 'object') return value

  const output = {}
  for (const [key, item] of Object.entries(value)) {
    output[key] = strictify(item)
  }
  if (output.properties) output.additionalProperties = false
  return output
}

export const GROQ_RESPONSE_SCHEMA = strictify(BASE_SCHEMA)

function uppercaseTypes(value) {
  if (Array.isArray(value)) return value.map(uppercaseTypes)
  if (!value || typeof value !== 'object') return value

  const output = {}
  for (const [key, item] of Object.entries(value)) {
    output[key] = key === 'type' && typeof item === 'string' ? item.toUpperCase() : uppercaseTypes(item)
  }
  return output
}

export const GEMINI_RESPONSE_SCHEMA = uppercaseTypes(BASE_SCHEMA)

const LANGUAGE_NAME = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
}

export function buildSystemPrompt(language) {
  const languageName = LANGUAGE_NAME[language] || LANGUAGE_NAME.en

  return `You are TuniVisa Assistant, a careful visa-information assistant for Tunisian passport holders.

Follow these rules:
1. Answer in ${languageName}.
2. Use ONLY the CONTEXT provided in the user message. Do not use outside knowledge, assumptions or memory.
3. If the context does not contain the answer, say that TuniVisa does not have that detail and point the user to the official source or a TuniVisa page from the context.
4. Never predict, estimate or guarantee visa approval, entry or processing outcomes. Never present TuniVisa's readiness checklist as an approval probability.
5. Never ask for or repeat passport numbers, bank details, home addresses or other sensitive personal data.
6. Be concise: 2 to 5 short paragraphs or a short bullet list. Prefer exact fees, durations, documents and steps only when they appear in the context.
7. Do not invent fees, deadlines, phone numbers or URLs. Only cite official links from the context.
8. The UI displays official sources and related TuniVisa links separately, so do not dump a long reference list in the answer.
9. Return valid JSON only, matching the response schema. Do not wrap it in markdown.

Data context: TuniVisa's 20 detailed destination guides were last checked on ${KNOWLEDGE_META.dataLastVerified}. The current date is ${new Date().toISOString().slice(0, 10)}.`
}

export function buildUserPrompt({ message, context }) {
  return `CONTEXT:
${context || 'No matching TuniVisa knowledge was found.'}

USER QUESTION:
${message}

Return a JSON object with the answer, 2-3 suggested follow-up questions, and up to 3 related TuniVisa links from the context. Use an empty array when there are no valid links.`
}

export function buildStreamingSystemPrompt(language) {
  const languageName = LANGUAGE_NAME[language] || LANGUAGE_NAME.en

  return `You are TuniVisa Assistant, a careful visa-information assistant for Tunisian passport holders.

Follow these rules:
1. Answer in ${languageName}.
2. Use ONLY the CONTEXT provided in the user message. Do not use outside knowledge, assumptions or memory.
3. If the context does not contain the answer, say that TuniVisa does not have that detail and point the user to the official source or a TuniVisa page from the context.
4. Never predict, estimate or guarantee visa approval, entry or processing outcomes. Never present TuniVisa's readiness checklist as an approval probability.
5. Never ask for or repeat passport numbers, bank details, home addresses or other sensitive personal data.
6. Be concise: 2 to 5 short paragraphs or a short bullet list. Prefer exact fees, durations, documents and steps only when they appear in the context.
7. Do not invent fees, deadlines, phone numbers or URLs. Only cite official links from the context.
8. The UI displays official sources and related TuniVisa links separately, so do not dump a long reference list in the answer.
9. Reply with plain text only (no JSON, no markdown fences).

Data context: TuniVisa's 20 detailed destination guides were last checked on ${KNOWLEDGE_META.dataLastVerified}. The current date is ${new Date().toISOString().slice(0, 10)}.`
}

export function buildStreamingUserPrompt({ message, context }) {
  return `CONTEXT:
${context || 'No matching TuniVisa knowledge was found.'}

USER QUESTION:
${message}`
}

export function buildGroqMessages({ system, history, prompt }) {
  return [
    { role: 'system', content: system },
    ...history.map((item) => ({ role: item.role, content: item.content })),
    { role: 'user', content: prompt },
  ]
}

export function buildGeminiContents({ history, prompt }) {
  return [
    ...history.map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    })),
    { role: 'user', parts: [{ text: prompt }] },
  ]
}

export function defaultSuggestions(language, { countryName, visaTypeLabel } = {}) {
  if (language === 'fr') {
    if (countryName && visaTypeLabel) {
      return [
        `Quels documents pour le visa ${visaTypeLabel.toLowerCase()} pour ${countryName} ?`,
        `Quels sont les frais et le délai de traitement pour ${countryName} ?`,
        `Où se trouve l'ambassade ou le centre de visa pour ${countryName} ?`,
      ]
    }
    if (countryName) {
      return [
        `Ai-je besoin d'un visa pour ${countryName} ?`,
        `Quels documents faut-il pour ${countryName} ?`,
        `Combien de temps puis-je rester en ${countryName} ?`,
      ]
    }
    return [
      'Puis-je voyager sans visa avec un passeport tunisien ?',
      'Quels documents faut-il pour un visa étudiant ?',
      'Comment fonctionne le score de préparation TuniVisa ?',
    ]
  }

  if (language === 'ar') {
    if (countryName && visaTypeLabel) {
      return [
        `ما الوثائق المطلوبة لتأشيرة ${visaTypeLabel} إلى ${countryName}؟`,
        `ما الرسوم ومدة المعالجة لتأشيرة ${countryName}؟`,
        `أين تقع السفارة أو مركز تقديم التأشيرات في ${countryName}؟`,
      ]
    }
    if (countryName) {
      return [
        `هل أحتاج إلى تأشيرة لدخول ${countryName}؟`,
        `ما الوثائق المطلوبة لـ ${countryName}؟`,
        `كم مدة الإقامة المسموح بها في ${countryName}؟`,
      ]
    }
    return [
      'ما الدول التي يمكنني زيارتها دون تأشيرة بجواز سفر تونسي؟',
      'ما الوثائق المطلوبة لتأشيرة الدراسة؟',
      'كيف يعمل مقياس الجاهزية في TuniVisa؟',
    ]
  }

  if (countryName && visaTypeLabel) {
    return [
      `What documents do I need for the ${visaTypeLabel.toLowerCase()} for ${countryName}?`,
      `What are the fees and processing time for ${countryName}?`,
      `Where is the embassy or visa centre for ${countryName}?`,
    ]
  }
  if (countryName) {
    return [
      `Do I need a visa for ${countryName}?`,
      `What documents do I need for ${countryName}?`,
      `How long can I stay in ${countryName}?`,
    ]
  }
  return [
    'Which countries are visa-free for Tunisian passport holders?',
    'What documents do I need for a student visa?',
    'How does the TuniVisa readiness score work?',
  ]
}

export function fallbackAnswer(language) {
  if (language === 'fr') {
    return "Je n'ai pas trouvé de réponse fiable dans les guides TuniVisa pour cette question. Vérifiez la page du pays ou la source officielle indiquée avant de poursuivre."
  }
  if (language === 'ar') {
    return 'لم أجد إجابة موثوقة في أدلة TuniVisa لهذا السؤال. تحقق من صفحة البلد أو المصدر الرسمي المذكور قبل اتخاذ أي إجراء.'
  }
  return 'I could not find a reliable answer in the TuniVisa guides for this question. Check the country page or the official source before proceeding.'
}

export function buildKnowledgeAnswer({ language, retrieved }) {
  const docs = retrieved?.docs?.slice(0, 2) || []
  if (docs.length === 0) return fallbackAnswer(language)

  const intro = language === 'fr'
    ? 'Les réponses automatiques sont momentanément indisponibles. Voici un extrait des guides TuniVisa :'
    : language === 'ar'
      ? 'الردود الآلية غير متاحة حاليًا. إليك مقتطفًا من أدلة TuniVisa:'
      : 'Automated answers are temporarily unavailable. Here is an extract from the TuniVisa guides:'
  const notice = language === 'fr'
    ? 'Vérifiez toujours la page du pays et la source officielle avant toute démarche.'
    : language === 'ar'
      ? 'تحقق دائمًا من صفحة البلد والمصدر الرسمي قبل اتخاذ أي إجراء.'
      : 'Always check the country page and the official source before taking any action.'
  const body = docs.map((doc) => `${doc.title}: ${doc.text}`).join('\n\n').slice(0, 2200)

  return `${intro}\n\n${body}\n\n${notice}`
}
