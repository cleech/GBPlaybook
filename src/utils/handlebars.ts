import Handlebars from "handlebars";
import asyncHelpers from "handlebars-async-helpers-ts";

const hb = asyncHelpers(Handlebars);

hb.registerHelper("trait", async function (this: any, name: string, ...rest: any[]) {
  const db = this?.db;
  if (!db) {
    console.error(`Database not provided for trait lookup: ${name}`);
    return "";
  }
  const trait = await db.character_traits.findOne(name).exec().then((doc: any) => doc?.toJSON());
  if (!trait) {
    console.error(`can not find trait ${name}`);
    return "";
  }
  const qualifier = (rest.length > 1) ? rest[0] : undefined;
  const depth = this?.depth || 1;
  
  if (depth === 1) {
    const text = await resolveText(trait.text, db, 2);
    return new hb.SafeString(`(_${trait.name}${qualifier ? ` [${qualifier}]` : ''}: ${text}_)`);
  } else {
    return new hb.SafeString(`(_${trait.name}${qualifier ? ` [${qualifier}]` : ''}: ${trait.text}_)`);
  }
});

hb.registerHelper("play", async function (this: any, name: string, ...rest: any[]) {
  const db = this?.db;
  if (!db) {
    console.error(`Database not provided for play lookup: ${name}`);
    return "";
  }
  const play = await db.character_plays.findOne(name).exec().then((doc: any) => doc?.toJSON());
  if (!play) {
    console.error(`can not find play ${name}`);
    return "";
  }
  const qualifier = (rest.length > 1) ? rest[0] : undefined;
  const depth = this?.depth || 1;
  
  if (depth === 1) {
    const text = await resolveText(play.text, db, 2);
    return new hb.SafeString(`(_${play.name}${qualifier ? ` [${qualifier}]` : ''}: ${text}_)`);
  } else {
    return new hb.SafeString(`(_${play.name}${qualifier ? ` [${qualifier}]` : ''}: ${play.text}_)`);
  }
});

hb.registerHelper("helperMissing", function (this: any, ...args: any[]) {
  const options = args[args.length - 1];
  return `:${options.name}:`;
});

export async function resolveText(text: string | undefined, db: any, depth: number = 1): Promise<string> {
  if (!text) return "";
  const template = hb.compile(text);
  return await template({ db, depth });
}

export default hb;
