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
  // Building
  const calculateIncomePerGeyser = (state: GameState) =>
    MR2.applyTransformationsCached(
      [MR2.TransformationTags.Production, MR2.Resource.Mana, "manaGeyser"],
      state,
      20.0,
    );
  const calculateExpensePerGeyser = (state: GameState) =>
    MR2.applyTransformationsCached(
      [
        MR2.TransformationTags.Consumption,
        MR2.Resource.EarthEssence,
        "manaGeyser",
      ],
      state,
      200.0,
    );
  const explainIncomePerGeyser = (state: GameState) =>
    MR2.explainTransformationsText(
      [MR2.TransformationTags.Production, MR2.Resource.Mana, "manaGeyser"],
      state,
      20.0,
      { unit: ":mana:" },
    );
  const explainExpensePerGeyser = (state: GameState) =>
    MR2.explainTransformationsText(
      [
        MR2.TransformationTags.Consumption,
        MR2.Resource.EarthEssence,
        "manaGeyser",
      ],
      state,
      200.0,
      { unit: ":earthessence:" },
    );

  class ManaGeyser extends MR2.Building {
    getId(): string {
      return "manaGeyser";
    }

    getName(): string {
      return "Mana Geyser";
    }

    getBaseLandRequired(): number {
      return 1;
    }

    canTurnOff(): boolean {
      return true;
    }
    getDisplayDescription(state: GameState): string {
      return "A strong source of :mana:. Draws from the power of :earthessence:.";
    }

    getDisplayEffect(state: GameState): string {
      const income = calculateIncomePerGeyser(state);
      const expense = calculateExpensePerGeyser(state);
      const incomeExplanation = explainIncomePerGeyser(state);
      const expenseExplanation = explainExpensePerGeyser(state);
      return `^${MR2.formatNumber(
        income,
      )}^<${incomeExplanation}>:mana:/sec; ^-${MR2.formatNumber(
        expense,
      )}^<${expenseExplanation}>:earthessence:/sec`;
    }
  }

  const manaGeyser = new ManaGeyser();

  MR2.IncomeOverTimeProducers.register(
    new MR2.IncomeOverTimeProducer(
      manaGeyser.getId(),
      manaGeyser.getName(),
      (state) => ({
        Mana:
          calculateIncomePerGeyser(state) *
          MR2.getBuildingAmountTurnedOn(state, manaGeyser),
        EarthEssence:
          -1 *
          calculateExpensePerGeyser(state) *
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
