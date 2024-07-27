import { MR2Globals } from "magic-research-2-modding-sdk";
import {
  ActionArea,
  ActionSubcategory,
} from "magic-research-2-modding-sdk/modding-decs/backend/action/ActionAreas";
import { Building } from "magic-research-2-modding-sdk/modding-decs/backend/buildings/Building";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";
import { Resource } from "magic-research-2-modding-sdk/modding-decs/backend/Resources";
import { SpellElement } from "magic-research-2-modding-sdk/modding-decs/backend/spells/Elements";

export function ADmod(MR2: MR2Globals) {
  //wow
  MR2.registerTransformation(
    [[MR2.TransformationTags.ChannelingEfficiency, "channelFire"]],
    "AD mod",
    "AD mod",
    MR2.TransformationType.Multiplier,
    (state) => 0,
  );
  MR2.registerTransformation(
    [[MR2.TransformationTags.ChannelingEfficiency, "channelEarth"]],
    "AD mod",
    "AD mod",
    MR2.TransformationType.Multiplier,
    (state) => 0,
  );
  MR2.registerTransformation(
    [[MR2.TransformationTags.ChannelingEfficiency, "channelWater"]],
    "AD mod",
    "AD mod",
    MR2.TransformationType.Multiplier,
    (state) => 0,
  );
  MR2.registerTransformation(
    [[MR2.TransformationTags.ChannelingEfficiency, "channelWind"]],
    "AD mod",
    "AD mod",
    MR2.TransformationType.Multiplier,
    (state) => 0,
  );

  // Building
  const calculateIncome = (state: GameState) =>
    MR2.applyTransformations(
      [MR2.TransformationTags.Production, MR2.Resource.Mana, "manaGeyser"],
      state,
      20.0,
    );
  const explainIncome = (state: GameState) =>
    MR2.explainTransformationsText(
      [MR2.TransformationTags.Production, MR2.Resource.Mana, "manaGeyser"],
      state,
      20.0,
      { unit: ":mana:" },
    );

  class ManaGeyser extends MR2.Building {
    getId(): string {
      return "ad1";
    }

    getName(): string {
      return "1st Antimatter Dimension";
    }

    getBaseLandRequired(): number {
      return 1;
    }

    canTurnOff(): boolean {
      return true;
    }

    getDisplayDescription(state: GameState): string {
      return "A strong source of :antimatter:.";
    }

    getDisplayEffect(state: GameState): string {
      const income = calculateIncome(state);
      const incomeExplanation = explainIncome(state);
      return `^${MR2.formatNumber(
        income,
      )}^<${incomeExplanation}>:antimatter:/sec`;
    }
  }

  const manaGeyser = new ManaGeyser();

  MR2.IncomeOverTimeProducers.register(
    new MR2.IncomeOverTimeProducer(
      manaGeyser.getId(),
      manaGeyser.getName(),
      (state) => ({
        Mana:
          calculateIncome(state) *
          MR2.getBuildingAmountTurnedOn(state, manaGeyser),
      }),
    ),
  );

  MR2.Buildings.register(manaGeyser);

  class BuildManaGeyser extends MR2.BuildingSpell {
    getBuilding(): Building {
      return manaGeyser;
    }

    getAreas(): Partial<Record<ActionArea, ActionSubcategory[]>> {
      return { HOME: [MR2.ActionSubcategories.MANA] };
    }

    getBaseResourceCost(): Partial<Record<Resource, number>> {
      return {
        WaterEssence: 500,
        EarthEssence: 500,
      };
    }

    getBaseResourceScale(): Partial<Record<Resource, number>> {
      return {
        WaterEssence: 1.4,
        EarthEssence: 1.2,
      };
    }

    getBaseAlternateLandUnawareBuildingAmount(): number {
      return 2;
    }

    isVisible(state: GameState): boolean {
      return true;
    }

    getLevelRequirements(): Partial<Record<SpellElement, number>> {
      return { Earth: 1 };
    }

    getElement(): SpellElement | undefined {
      return MR2.SpellElement.Earth;
    }
  }

  const buildManaGeyser = new BuildManaGeyser();

  MR2.BuildingAmountListeners.register((state, building) => {
    if (building == manaGeyser) {
      state = MR2.clearCalculatedIncomeCache(state);
    }
    return state;
  });

  MR2.registerSpell(buildManaGeyser);
}
