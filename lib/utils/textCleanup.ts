// utils/textCleanup.ts
export function normalizeUnicode(text: string): string {
  if (!text) return text;

  const replacements: [RegExp, string][] = [
    // Fancy minus signs to standard minus
    [/\u2013/g, '-'], // en dash
    [/\u2014/g, '-'], // em dash
    [/\u2015/g, '-'], // horizontal bar
    [/\u2212/g, '-'], // minus sign
    [/\u2010/g, '-'], // hyphen
    [/\u2011/g, '-'], // non-breaking hyphen
    [/\u2043/g, '-'], // hyphen bullet
    [/\uFE63/g, '-'], // small hyphen-minus
    
    // Smart quotes to standard quotes
    [/\u2018/g, "'"], // left single quote
    [/\u2019/g, "'"], // right single quote
    [/\u201C/g, '"'], // left double quote
    [/\u201D/g, '"'], // right double quote
    
    // Multiplication signs
    [/\u00D7/g, '×'], // multiplication sign
    [/\u22C5/g, '·'], // dot operator
    
    // Fractions
    [/\u00BC/g, '1/4'],
    [/\u00BD/g, '1/2'],
    [/\u00BE/g, '3/4'],
    
    // Superscripts and subscripts (convert to LaTeX)
    [/\u00B2/g, '^2'],
    [/\u00B3/g, '^3'],
    [/\u2070/g, '^0'],
    [/\u2074/g, '^4'],
    [/\u2075/g, '^5'],
    [/\u2076/g, '^6'],
    [/\u2077/g, '^7'],
    [/\u2078/g, '^8'],
    [/\u2079/g, '^9'],
    [/\u2080/g, '_0'],
    [/\u2081/g, '_1'],
    [/\u2082/g, '_2'],
    [/\u2083/g, '_3'],
    [/\u2084/g, '_4'],
    [/\u2085/g, '_5'],
    [/\u2086/g, '_6'],
    [/\u2087/g, '_7'],
    [/\u2088/g, '_8'],
    [/\u2089/g, '_9'],
    
    // Greek letters (keep as is, these are useful in chemistry)
    // α, β, γ, δ, ε, ζ, η, θ, ι, κ, λ, μ, ν, ξ, ο, π, ρ, σ, τ, υ, φ, χ, ψ, ω
    // These are preserved as Unicode
  ];

  let cleaned = text;
  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  
  return cleaned;
}

// Special symbol toolbar data
export const SYMBOL_TOOLBAR = {
  greek: [
    { label: 'α', value: 'α' },
    { label: 'β', value: 'β' },
    { label: 'γ', value: 'γ' },
    { label: 'δ', value: 'δ' },
    { label: 'ε', value: 'ε' },
    { label: 'ζ', value: 'ζ' },
    { label: 'η', value: 'η' },
    { label: 'θ', value: 'θ' },
    { label: 'ι', value: 'ι' },
    { label: 'κ', value: 'κ' },
    { label: 'λ', value: 'λ' },
    { label: 'μ', value: 'μ' },
    { label: 'ν', value: 'ν' },
    { label: 'ξ', value: 'ξ' },
    { label: 'ο', value: 'ο' },
    { label: 'π', value: 'π' },
    { label: 'ρ', value: 'ρ' },
    { label: 'σ', value: 'σ' },
    { label: 'τ', value: 'τ' },
    { label: 'υ', value: 'υ' },
    { label: 'φ', value: 'φ' },
    { label: 'χ', value: 'χ' },
    { label: 'ψ', value: 'ψ' },
    { label: 'ω', value: 'ω' },
    { label: 'Δ', value: 'Δ' },
    { label: 'Θ', value: 'Θ' },
    { label: 'Λ', value: 'Λ' },
    { label: 'Π', value: 'Π' },
    { label: 'Σ', value: 'Σ' },
    { label: 'Φ', value: 'Φ' },
    { label: 'Ψ', value: 'Ψ' },
    { label: 'Ω', value: 'Ω' },
  ],
  arrows: [
    { label: '→', value: '→' },
    { label: '←', value: '←' },
    { label: '↑', value: '↑' },
    { label: '↓', value: '↓' },
    { label: '↔', value: '↔' },
    { label: '↕', value: '↕' },
    { label: '⇒', value: '⇒' },
    { label: '⇐', value: '⇐' },
    { label: '⇔', value: '⇔' },
  ],
  chemistry: [
    { label: 'H₂O', value: 'H₂O' },
    { label: 'CO₂', value: 'CO₂' },
    { label: 'CH₄', value: 'CH₄' },
    { label: 'NH₃', value: 'NH₃' },
    { label: 'H₂SO₄', value: 'H₂SO₄' },
    { label: 'NaOH', value: 'NaOH' },
    { label: 'HCl', value: 'HCl' },
    { label: 'C₆H₁₂O₆', value: 'C₆H₁₂O₆' },
    { label: '→', value: ' → ' },
    { label: '⇌', value: ' ⇌ ' },
    { label: '↔', value: ' ↔ ' },
    { label: '↑', value: '↑' },
    { label: '↓', value: '↓' },
    { label: '⁺', value: '⁺' },
    { label: '⁻', value: '⁻' },
  ],
};