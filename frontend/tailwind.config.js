export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        /* Dark mode: True Black / Deep Gray */
        surface:             '#000000',
        'surface-2':         '#1E1F20',
        'surface-elevated':  '#1E1F20',
        panel:               '#2A2B2C',
        'panel-hover':       '#323334',
        border:              '#3C3D3E',
        'border-subtle':     '#2A2B2C',

        'text-primary':      '#E8EAED',
        'text-secondary':    '#9AA0A6',
        'text-muted':        '#5F6368',
        muted:               '#5F6368',
        'muted-strong':      '#3C3D3E',

        /* Accent */
        accent:              '#7fff5f',
        'accent-dim':        '#5ab340',
        'accent-muted':      'rgba(127,255,95,0.12)',

        /* Primary button */
        primary:             '#2A2B2C',
        'primary-hover':     '#323334',

        /* Track colours */
        blue:                '#4285F4',
        green:               '#34A853',
        purple:              '#9C27B0',
        amber:               '#F9AB00',

        /* Semantic */
        correct:             '#34A853',
        'correct-bg':        'rgba(52,168,83,0.08)',
        incorrect:           '#EA4335',
        'incorrect-bg':      'rgba(234,67,53,0.08)',
        warning:             '#F9AB00',
      },
      borderRadius: {
        DEFAULT:      '8px',
        gemini:       '12px',
        'gemini-lg':  '16px',
        lg:           '12px',
        xl:           '16px',
        '2xl':        '20px',
      },
      boxShadow: {
        gemini: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
