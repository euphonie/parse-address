import { readdirSync } from "fs";

export default class GrammarSpecifications {

  constructor(){
    this.grammars = {};
    this.loadGrammars();
  }

  loadGrammars(){
    let vm = this;
    const grammarDirectory = `${__dirname}/grammars/`;
    const files = readdirSync(grammarDirectory);
    files.forEach(function (file) {
      const filename = file.split('.');
      const country = filename[1] || 'unk';
      vm.grammars[country] = require(`${__dirname}/grammars/${filename[0]}.${filename[1]}`);
    });
  }
}
