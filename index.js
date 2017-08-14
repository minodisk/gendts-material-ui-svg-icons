const {get} = require('https')
const {readdir, readFile, writeFile} = require('fs')
const {join, extname, basename, dirname, relative} = require('path')

const token = process.env.GITHUB_ACCESS_TOKEN || ''

const toMixedCase = (name) => {
  let dist = name[0].toUpperCase()
  for (let i = 1; i < name.length; i++) {
    const c = name[i]
    if (c !== '-') {
      dist += c
      continue
    }
    i++
    dist += name[i].toUpperCase()
  }
  return dist
}

const github = (path) => new Promise((resolve, reject) => {
  get({
    headers: {'user-agent': 'minodisk/generate-dts'},
    host: 'api.github.com',
    path,
  }, (res) => {
    if ((res.statusCode / 100 >> 0) != 2) {
      reject(`GitHub response: ${res.statusCode} ${res.statusMessage}`)
      return
    }
    let data = '';
    res
      .on('data', (chunk) => data += chunk)
      .on('end', () => resolve(JSON.parse(data)))
  }).on('error', reject)
})

const categories = () => github(`/repos/callemall/material-ui/contents/src/svg-icons?ref=master&access_token=${token}`)

const contents = (path) => github(`/repos/callemall/material-ui/contents/${path}?ref=master&access_token=${token}`)

const collator = new Intl.Collator()

const readText = (filename) => new Promise((resolve, reject) => {
  readFile(filename, 'utf8', (err, data) => {
    if (err != null) {
      reject(err)
      return
    }
    resolve(data)
  })
})

const writeText = (filename, text) => new Promise((resolve, reject) => {
  writeFile(filename, text, 'utf8', (err) => {
    if (err != null) {
      reject(err)
      return
    }
    resolve()
  })
})

const inject = (content) => {
  content.category = this.name
  return content
}

const file = join(process.cwd(), 'index.d.ts');
const rMark = /(\/{2} \{{3} Generated with minodisk\/gendts-material-ui-svg-icons)[\s\S]*?(\/{2} \}{3})/g

categories()
  .then((cats) => Promise.all(Array.prototype.map.call(cats, (cat) => contents(cat.path)
    .then((cons) => Array.prototype.map.call(cons, (con) => {
      con.category = cat.name
      return con
    }))
  )))
  .then((contentsList) => Array.prototype.concat.apply([], contentsList)
    .map((content) => {
      const {path} = content
      const name = basename(path, extname(path))
      content.id = join(relative('src', dirname(path)), name)
      content.className = toMixedCase(content.category) + toMixedCase(name)
      return content
    })
    .sort((a, b) => collator.compare(a.id, b.id))
    .reduce((prev, content)  => {
      const {individuals, summarizeds} = prev
      individuals.push(`declare module 'material-ui/${content.id}' {
    export import ${content.className} = __MaterialUI.SvgIcon;
    export default ${content.className};
}`)
      summarizeds.push(`    export import ${content.className} = __MaterialUI.SvgIcon; // require('material-ui/${content.id}');`)
      return prev
    }, {individuals: [], summarizeds: []})
)
  .then(({individuals, summarizeds}) => {
    let index = 0
    return readText(file)
      .then((script) => writeText(file, script.replace(rMark, (_, p1, p2) => {
        let text = ''
        switch (index) {
          case 0:
            text = individuals.join('\n\n')
            break
          case 1:
            text = `declare module 'material-ui/svg-icons' {
${summarizeds.join('\n')}
}
`
            break
        }
        index++
        return p1 + '\n' + text + '\n' + p2
      })))
  })
  .catch((err) => console.error(err))
