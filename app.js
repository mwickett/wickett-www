require('dotenv').config({ silent: true })

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const sugarss = require('sugarss')
const DatoCMS = require('spike-datocms')
const env = process.env.NODE_ENV

const locals = {}

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock'],
  reshape: htmlStandards({
    root: process.cwd() + '/views',
    parser: sugarml,
    locals: ctx => {
      return Object.assign(locals, { pageId: pageId(ctx) })
    },
    minify: env === 'production'
  }),
  postcss: cssStandards({
    parser: sugarss,
    minify: env === 'production',
    warnForDuplicates: env !== 'production'
  }),
  babel: jsStandards(),
  plugins: [
    new DatoCMS({
      addDataTo: locals,
      token: process.env.DATO_KEY,
      models: [
        {
          name: 'about_page'
        },
        {
          name: 'contact_page'
        },
        {
          name: 'article_page'
        },
        {
          name: 'home_page'
        },
        {
          name: 'article',
          template: {
            path: 'views/layouts/article_template.sgr',
            output: article => {
              return `articles/${article.slug}.html`
            }
          }
        }
      ],
      json: 'data.json'
    })
  ]
}
