#!/usr/bin/env bun

const fileMap = {
  en: "GB-Playbook-4-7.json",
  es: "GB-Playbook-4-7.es.json",
  fr: "GB-Playbook-4-7.fr.json",
  zh: "GB-Playbook-4-7.zh.json",
}

async function main(lang) {
  const en = await Bun.file(fileMap.en).json();
  const trFile = Bun.file(fileMap[lang]);
  const translation = await trFile.json();

  if (!en || !translation) {
    console.error('Bad Filename');
    return;
  }

  translation["Models"].forEach((model, index) => {
    let fallback = en["Models"][index];
    model.character_plays = fallback.character_plays;
    model.character_traits = fallback.character_traits;
  })

  translation["Character Plays"].forEach((play, index) => {
    let fallback = en["Character Plays"][index];
    play.name = fallback.name;
  })

  translation["Character Traits"].forEach((trait, index) => {
    let fallback = en["Character Traits"][index];
    trait.name = fallback.name;
  })

  // console.log(JSON.stringify(translation, null, 2));
  Bun.write(trFile, JSON.stringify(translation, null, 2));
}

const lang = Bun.argv[2];
await main(lang);
