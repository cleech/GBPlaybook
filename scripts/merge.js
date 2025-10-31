#!/usr/bin/env bun

const enFile = "GB-Playbook-4-7.json";
const zhFile = "GB-Playbook-4-7.zh.json";

const en = await Bun.file(enFile).json();
const zh = await Bun.file(zhFile).json();

for (let play of zh["Character Plays"]) {
	if (play.text === "" || play.text === undefined) {
		const fallback = en["Character Plays"].find(ct => ct.name === play.name);
		play.text = fallback.text;
	}
}

for (let trait of zh["Character Traits"]) {
	if (trait.text === "" || trait.text === undefined) {
		const fallback = en["Character Traits"].find(ct => ct.name === trait.name);
		trait.text = fallback.text;
	}
}

console.log(JSON.stringify(zh, null, 2));


