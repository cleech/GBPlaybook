#!/usr/bin/env bun

const fileMap = {
  en: "GB-Playbook-4-8.json",
  es: "GB-Playbook-4-8.es.json",
  fr: "GB-Playbook-4-8.fr.json",
  zh: "GB-Playbook-4-8.zh.json",
}

async function main(lang) {
  const en = await Bun.file(fileMap.en).json();
  const trFile = Bun.file(fileMap[lang]);
  const translation = await trFile.json();

  if (!en || !translation) {
    console.error('Bad Filename');
    return;
  }

  for (let fallback of en["Models"]) {
    const model = translation["Models"].find(m => m.id === fallback.id);
    if (fallback.heroic != undefined && model.heroic === undefined) {
      model.heroic = fallback.heroic;
    }
    if (fallback.legendary != undefined && model.legendary === undefined) {
      model.legendary = fallback.legendary;
    }
  }

  for (let play of translation["Character Plays"]) {
    if (play.text === "" || play.text === undefined) {
      const fallback = en["Character Plays"].find(ct => ct.name === play.name);
      play.text = fallback.text;
    }
  }

  for (let trait of translation["Character Traits"]) {
    if (trait.text === "" || trait.text === undefined) {
      const fallback = en["Character Traits"].find(ct => ct.name === trait.name);
      trait.text = fallback.text;
    }
  }

  // console.log(JSON.stringify(translation, null, 2));
  Bun.write(trFile, JSON.stringify(translation, null, 2));
}

const lang = Bun.argv[2];
await main(lang);
