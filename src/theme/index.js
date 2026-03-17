import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

/**
 * VidSplit theme — Aura base with full dark-mode brand overrides.
 * Colors:
 *   --mint  #CFFFE2  primary text / highlights
 *   --teal  #A2D5C6  secondary accents
 *   --black #000000  background
 *   --white #F6F6F6  body text
 */
const VidSplitPreset = definePreset(Aura, {
  primitive: {
    // Brand palette injected as primitive tokens
    mint: {
      50:  '#f0fff6',
      100: '#CFFFE2',
      200: '#A2D5C6',
      300: '#7abfae',
      400: '#52a895',
      500: '#35907c',
      600: '#277364',
      700: '#1b574b',
      800: '#113c34',
      900: '#09221d',
      950: '#040e0c',
    },
  },

  semantic: {
    primary: {
      50:  '{mint.50}',
      100: '{mint.100}',
      200: '{mint.200}',
      300: '{mint.300}',
      400: '{mint.400}',
      500: '{mint.500}',
      600: '{mint.600}',
      700: '{mint.700}',
      800: '{mint.800}',
      900: '{mint.900}',
      950: '{mint.950}',
    },

    colorScheme: {
      dark: {
        primary: {
          color:           '{mint.100}',
          contrastColor:   '#000000',
          hoverColor:      '{mint.200}',
          activeColor:     '{mint.300}',
        },
        highlight: {
          background:      '{mint.100}',
          focusBackground: '{mint.200}',
          color:           '#000000',
          focusColor:      '#000000',
        },
        surface: {
          0:   '#ffffff',
          50:  '#F6F6F6',
          100: '#d0d0d0',
          200: '#aaaaaa',
          300: '#888888',
          400: '#666666',
          500: '#444444',
          600: '#2e2e2e',
          700: '#1e1e1e',
          800: '#111111',
          900: '#080808',
          950: '#000000',
        },
        text: {
          color:           '{mint.100}',
          hoverColor:      '{mint.100}',
          mutedColor:      '{mint.200}',
          hoverMutedColor: '{mint.100}',
        },
        content: {
          background:       '#000000',
          hoverBackground:  'rgba(207,255,226,0.06)',
          borderColor:      'rgba(162,213,198,0.3)',
          color:            '{mint.100}',
          hoverColor:       '{mint.100}',
        },
        overlay: {
          select: {
            background: '#000000',
            borderColor: '{mint.200}',
            color:       '{mint.100}',
          },
          popover: {
            background: '#0d0d0d',
            borderColor: '{mint.200}',
            color:       '{mint.100}',
          },
          modal: {
            background: '#000000',
            borderColor: '{mint.200}',
            color:       '{mint.100}',
          },
        },
        list: {
          option: {
            focusBackground: 'rgba(207,255,226,0.1)',
            selectedBackground: 'rgba(207,255,226,0.15)',
            selectedFocusBackground: 'rgba(207,255,226,0.2)',
            color: '{mint.100}',
            focusColor: '{mint.100}',
            selectedColor: '{mint.100}',
            selectedFocusColor: '{mint.100}',
          },
        },
        navigation: {
          item: {
            focusBackground:    'rgba(207,255,226,0.1)',
            activeBackground:   'rgba(207,255,226,0.15)',
            color:              '{mint.100}',
            focusColor:         '{mint.100}',
            activeColor:        '{mint.100}',
          },
        },
      },
    },
  },

  // ── Per-component token overrides ──────────────────────────────────────────
  components: {
    button: {
      borderRadius: '0px',
      paddingX:     '1.25rem',
      paddingY:     '0.75rem',
      sm: { fontSize: '0.6rem', paddingX: '1rem',   paddingY: '0.6rem' },
      lg: { fontSize: '0.7rem', paddingX: '1.5rem', paddingY: '0.9rem' },
      colorScheme: {
        dark: {
          root: {
            primary: {
              background:       '{mint.100}',
              hoverBackground:  '{mint.200}',
              activeBackground: '{mint.300}',
              borderColor:      '{mint.100}',
              hoverBorderColor: '{mint.200}',
              activeBorderColor:'{mint.300}',
              color:            '#000000',
              hoverColor:       '#000000',
              activeColor:      '#000000',
            },
            secondary: {
              background:        'transparent',
              hoverBackground:   'rgba(207,255,226,0.08)',
              activeBackground:  'rgba(207,255,226,0.14)',
              borderColor:       '{mint.200}',
              hoverBorderColor:  '{mint.100}',
              activeBorderColor: '{mint.100}',
              color:             '{mint.200}',
              hoverColor:        '{mint.100}',
              activeColor:       '{mint.100}',
            },
            danger: {
              background:       'transparent',
              hoverBackground:  'rgba(255,112,112,0.1)',
              borderColor:      '#ff7070',
              color:            '#ffaaaa',
              hoverColor:       '#ffaaaa',
            },
          },
          outlined: {
            primary: {
              hoverBackground:  'rgba(207,255,226,0.08)',
              activeBackground: 'rgba(207,255,226,0.14)',
              borderColor:      '{mint.100}',
              color:            '{mint.100}',
            },
          },
        },
      },
    },

    progressbar: {
      borderRadius: '0px',
      height:       '1.125rem',
      colorScheme: {
        dark: {
          root: {
            background: 'rgba(0,0,0,0.6)',
            borderColor: '{mint.200}',
          },
          value: {
            background: 'linear-gradient(90deg, {mint.200} 0%, {mint.100} 100%)',
          },
          label: {
            color: '#000000',
          },
        },
      },
    },

    card: {
      borderRadius: '0px',
      shadow:       'none',
      colorScheme: {
        dark: {
          root: {
            background:  'rgba(162,213,198,0.03)',
            color:       '{mint.100}',
          },
          body: { padding: '1.25rem' },
          caption: { gap: '0.375rem' },
          title: { fontSize: '0.5rem', fontWeight: '400', color: '{mint.100}' },
          subtitle: { color: '{mint.200}' },
        },
      },
    },

    message: {
      borderRadius: '0px',
      colorScheme: {
        dark: {
          error: {
            background:  'rgba(255,112,112,0.08)',
            borderColor: '#ff7070',
            color:       '#ffaaaa',
            shadow:      'none',
          },
          success: {
            background:  'rgba(207,255,226,0.08)',
            borderColor: '{mint.200}',
            color:       '{mint.100}',
            shadow:      'none',
          },
          info: {
            background:  'rgba(162,213,198,0.06)',
            borderColor: '{mint.200}',
            color:       '{mint.200}',
            shadow:      'none',
          },
        },
      },
    },

    tag: {
      borderRadius: '0px',
      colorScheme: {
        dark: {
          primary: {
            background: '{mint.100}',
            color:      '#000000',
          },
          secondary: {
            background: 'rgba(162,213,198,0.15)',
            color:      '{mint.200}',
          },
        },
      },
    },

    divider: {
      colorScheme: {
        dark: {
          horizontal: {
            margin:      '0.375rem 0 1.125rem',
            borderColor: 'rgba(162,213,198,0.12)',
          },
        },
      },
    },

    toast: {
      borderRadius: '0px',
      colorScheme: {
        dark: {
          success: {
            background:  '#000000',
            borderColor: '{mint.100}',
            color:       '{mint.100}',
            detailColor: '{mint.200}',
            shadow:      '4px 4px 0 {mint.200}',
          },
        },
      },
    },
  },
})

export default VidSplitPreset
