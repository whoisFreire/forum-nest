import config from '@whoisfreire/eslint-config'
import { globalIgnores } from 'eslint/config'

export default [
  ...config,
  globalIgnores([
    'data',
    'node_modules',
  ]), {
    rules: {
      'no-undef': 'off',
      'no-useless-constructor': 'off',
    }
  }
]
