import { MR2Globals } from "magic-research-2-modding-sdk";
export function ADmod(MR2: MR2Globals) {
  //what
  //disable all channeling spells
  const allSpells = MR2.Spells.getAll();
  const channelingSpells = allSpells.filter(
    (spell) => spell instanceof MR2.BasicChannelingSpellBase,
  );
  for (let spell of channelingSpells) {
    MR2.Spells.delete(spell.getId());
    MR2.Actions.delete(spell.getId());
  }
  //wow so channeling is disabled, that's fantastic(what)
}
