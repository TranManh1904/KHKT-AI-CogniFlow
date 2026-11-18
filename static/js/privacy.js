(function () {
  'use strict';

  const patterns = [
    { category: 'Email address', regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, replacement: '[email hidden]' },
    { category: 'Vietnamese phone number', regex: /(?<!\d)(?:\+?84|0)(?:[\s.-]?\d){9,10}(?!\d)/g, replacement: '[phone hidden]' },
    { category: 'International phone number', regex: /(?<!\w)\+\d{1,3}[\s.-]?(?:\d[\s.-]?){7,12}(?!\w)/g, replacement: '[phone hidden]' },
    { category: 'National ID-like number', regex: /(?<!\d)\d{12}(?!\d)/g, replacement: '[ID number hidden]' },
    { category: 'API or access token', regex: /\b(?:gsk_[A-Za-z0-9]{16,}|sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|AIza[\w-]{30,})\b/g, replacement: '[token hidden]' }
  ];

  function scanText(value) {
    const text = String(value || '');
    const matches = [];
    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          category: pattern.category,
          replacement: pattern.replacement
        });
        if (match[0].length === 0) pattern.regex.lastIndex += 1;
      }
    }
    matches.sort((a, b) => a.start - b.start || b.end - a.end);
    const result = [];
    let lastEnd = -1;
    for (const match of matches) {
      if (match.start >= lastEnd) {
        result.push(match);
        lastEnd = match.end;
      }
    }
    return result;
  }

  function maskText(value, spans) {
    const text = String(value || '');
    let output = '';
    let cursor = 0;
    for (const span of spans || []) {
      output += text.slice(cursor, span.start) + span.replacement;
      cursor = span.end;
    }
    output += text.slice(cursor);
    return output;
  }

  window.CogniFlowPrivacy = { scanText, maskText };
})();
