const fs = require('fs');
const { getCSSLanguageService } = require('vscode-css-languageservice');
const { TextDocument } = require('vscode-languageserver-textdocument');
const css = fs.readFileSync('__tmp_style.css', 'utf8');
const document = TextDocument.create('file:///__tmp_style.css', 'css', 1, css);
const service = getCSSLanguageService();
const stylesheet = service.parseStylesheet(document);
const diagnostics = service.doValidation(document, stylesheet);
for (const d of diagnostics) {
  console.log(`${d.range.start.line + 1}:${d.range.start.character + 1} ${d.message} [${d.code}]`);
}
console.log('count', diagnostics.length);
