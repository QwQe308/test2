/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/MR2TestMods.ts":
/*!****************************!*\
  !*** ./src/MR2TestMods.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   description: () => (/* binding */ description),
/* harmony export */   id: () => (/* binding */ id),
/* harmony export */   load: () => (/* binding */ load),
/* harmony export */   name: () => (/* binding */ name),
/* harmony export */   preload: () => (/* binding */ preload),
/* harmony export */   version: () => (/* binding */ version)
/* harmony export */ });
/* harmony import */ var _mod_AntimatterDimensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mod/AntimatterDimensions */ "./src/mod/AntimatterDimensions.ts");
/* harmony import */ var _mod_AntimatterElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mod/AntimatterElement */ "./src/mod/AntimatterElement.ts");


const PACKAGE = __webpack_require__(/*! ../package.json */ "./package.json");
function load(MR2) {
  MR2.alert("Loading mod", "Beginning to load");
  (0,_mod_AntimatterElement__WEBPACK_IMPORTED_MODULE_1__.loadElementCreationTestMod)(MR2);
  (0,_mod_AntimatterDimensions__WEBPACK_IMPORTED_MODULE_0__.ADmod)(MR2);
}
function preload(MR2) {
  MR2.alert("Preloading mod", "Beginning to preload");
  (0,_mod_AntimatterElement__WEBPACK_IMPORTED_MODULE_1__.preloadElementCreationTestMod)(MR2);
}
const id = PACKAGE.name;
const name = PACKAGE.description;
const version = PACKAGE.version;
const description = "A set of MR2 test mods to try out the modding feature.";

/***/ }),

/***/ "./src/mod/AntimatterDimensions.ts":
/*!*****************************************!*\
  !*** ./src/mod/AntimatterDimensions.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ADmod: () => (/* binding */ ADmod)
/* harmony export */ });
function ADmod(MR2) {
  const calculateIncomePerGeyser = state => MR2.applyTransformationsCached([MR2.TransformationTags.Production, MR2.Resource.Mana, "manaGeyser"], state, 20.0);
  const calculateExpensePerGeyser = state => MR2.applyTransformationsCached([MR2.TransformationTags.Consumption, MR2.Resource.EarthEssence, "manaGeyser"], state, 200.0);
  const explainIncomePerGeyser = state => MR2.explainTransformationsText([MR2.TransformationTags.Production, MR2.Resource.Mana, "manaGeyser"], state, 20.0, {
    unit: ":mana:"
  });
  const explainExpensePerGeyser = state => MR2.explainTransformationsText([MR2.TransformationTags.Consumption, MR2.Resource.EarthEssence, "manaGeyser"], state, 200.0, {
    unit: ":earthessence:"
  });
  class ManaGeyser extends MR2.Building {
    getId() {
      return "manaGeyser";
    }
    getName() {
      return "Mana Geyser";
    }
    getBaseLandRequired() {
      return 1;
    }
    canTurnOff() {
      return true;
    }
    getDisplayDescription(state) {
      return "A strong source of :mana:. Draws from the power of :earthessence:.";
    }
    getDisplayEffect(state) {
      const income = calculateIncomePerGeyser(state);
      const expense = calculateExpensePerGeyser(state);
      const incomeExplanation = explainIncomePerGeyser(state);
      const expenseExplanation = explainExpensePerGeyser(state);
      return `^${MR2.formatNumber(income)}^<${incomeExplanation}>:mana:/sec; ^-${MR2.formatNumber(expense)}^<${expenseExplanation}>:earthessence:/sec`;
    }
  }
  const manaGeyser = new ManaGeyser();
  MR2.IncomeOverTimeProducers.register(new MR2.IncomeOverTimeProducer(manaGeyser.getId(), manaGeyser.getName(), state => ({
    Mana: calculateIncomePerGeyser(state) * MR2.getBuildingAmountTurnedOn(state, manaGeyser),
    EarthEssence: -1 * calculateExpensePerGeyser(state) * MR2.getBuildingAmountTurnedOn(state, manaGeyser)
  })));
  MR2.Buildings.register(manaGeyser);
  class BuildManaGeyser extends MR2.BuildingSpell {
    getBuilding() {
      return manaGeyser;
    }
    getAreas() {
      return {
        HOME: [MR2.ActionSubcategories.MANA]
      };
    }
    getBaseResourceCost() {
      return {
        WaterEssence: 500,
        EarthEssence: 500
      };
    }
    getBaseResourceScale() {
      return {
        WaterEssence: 1.4,
        EarthEssence: 1.2
      };
    }
    getBaseAlternateLandUnawareBuildingAmount() {
      return 2;
    }
    isVisible(state) {
      return true;
    }
    getLevelRequirements() {
      return {
        Earth: 1
      };
    }
    getElement() {
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

/***/ }),

/***/ "./src/mod/AntimatterElement.ts":
/*!**************************************!*\
  !*** ./src/mod/AntimatterElement.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadElementCreationTestMod: () => (/* binding */ loadElementCreationTestMod),
/* harmony export */   preloadElementCreationTestMod: () => (/* binding */ preloadElementCreationTestMod)
/* harmony export */ });
const ELEMENT_NAME = "Antimatter";
const RESOURCE_NAME = ELEMENT_NAME;
function preloadElementCreationTestMod(MR2) {
  const antimatterTheme = isDark => {
    const exportedColors = !isDark ? {
      colors: {
        primary: "rgb(135, 82, 0)",
        onPrimary: "rgb(255, 255, 255)",
        primaryContainer: "rgb(255, 221, 186)",
        onPrimaryContainer: "rgb(43, 23, 0)",
        secondary: "rgb(113, 90, 65)",
        onSecondary: "rgb(255, 255, 255)",
        secondaryContainer: "rgb(253, 221, 189)",
        onSecondaryContainer: "rgb(40, 24, 5)",
        tertiary: "rgb(85, 99, 60)",
        onTertiary: "rgb(255, 255, 255)",
        tertiaryContainer: "rgb(216, 233, 183)",
        onTertiaryContainer: "rgb(20, 31, 2)",
        error: "rgb(186, 26, 26)",
        onError: "rgb(255, 255, 255)",
        errorContainer: "rgb(255, 218, 214)",
        onErrorContainer: "rgb(65, 0, 2)",
        background: "rgb(255, 251, 255)",
        onBackground: "rgb(31, 27, 22)",
        surface: "rgb(255, 251, 255)",
        onSurface: "rgb(31, 27, 22)",
        surfaceVariant: "rgb(241, 224, 208)",
        onSurfaceVariant: "rgb(80, 69, 58)",
        outline: "rgb(130, 117, 104)",
        outlineVariant: "rgb(212, 196, 181)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(53, 47, 42)",
        inverseOnSurface: "rgb(249, 239, 231)",
        inversePrimary: "rgb(255, 184, 101)",
        elevation: {
          level0: "transparent",
          level1: "rgb(249, 243, 242)",
          level2: "rgb(245, 238, 235)",
          level3: "rgb(242, 232, 227)",
          level4: "rgb(241, 231, 224)",
          level5: "rgb(238, 227, 219)"
        },
        surfaceDisabled: "rgba(31, 27, 22, 0.12)",
        onSurfaceDisabled: "rgba(31, 27, 22, 0.38)",
        backdrop: "rgba(57, 47, 36, 0.4)"
      }
    } : {
      colors: {
        primary: "rgb(255, 184, 101)",
        onPrimary: "rgb(72, 42, 0)",
        primaryContainer: "rgb(102, 61, 0)",
        onPrimaryContainer: "rgb(255, 221, 186)",
        secondary: "rgb(224, 193, 163)",
        onSecondary: "rgb(63, 45, 23)",
        secondaryContainer: "rgb(88, 67, 43)",
        onSecondaryContainer: "rgb(253, 221, 189)",
        tertiary: "rgb(189, 205, 157)",
        onTertiary: "rgb(40, 52, 18)",
        tertiaryContainer: "rgb(62, 75, 39)",
        onTertiaryContainer: "rgb(216, 233, 183)",
        error: "rgb(255, 180, 171)",
        onError: "rgb(105, 0, 5)",
        errorContainer: "rgb(147, 0, 10)",
        onErrorContainer: "rgb(255, 180, 171)",
        background: "rgb(31, 27, 22)",
        onBackground: "rgb(235, 225, 217)",
        surface: "rgb(31, 27, 22)",
        onSurface: "rgb(235, 225, 217)",
        surfaceVariant: "rgb(80, 69, 58)",
        onSurfaceVariant: "rgb(212, 196, 181)",
        outline: "rgb(157, 142, 129)",
        outlineVariant: "rgb(80, 69, 58)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(235, 225, 217)",
        inverseOnSurface: "rgb(53, 47, 42)",
        inversePrimary: "rgb(135, 82, 0)",
        elevation: {
          level0: "transparent",
          level1: "rgb(42, 35, 26)",
          level2: "rgb(49, 40, 28)",
          level3: "rgb(56, 44, 31)",
          level4: "rgb(58, 46, 32)",
          level5: "rgb(62, 49, 33)"
        },
        surfaceDisabled: "rgba(235, 225, 217, 0.12)",
        onSurfaceDisabled: "rgba(235, 225, 217, 0.38)",
        backdrop: "rgba(57, 47, 36, 0.4)"
      }
    };
    return exportedColors.colors;
  };
  const antimatterIcon = __webpack_require__(/*! ./image/Antimatter.png */ "./src/mod/image/Antimatter.png");
  MR2.registerGameIcon(ELEMENT_NAME.toLowerCase(), antimatterIcon);
  MR2.registerGameIcon("antimatter", antimatterIcon);
  MR2.registerResource(RESOURCE_NAME, {
    id: RESOURCE_NAME,
    name: "Antimatter",
    resourceInfo: {
      baseCap: Number.MAX_SAFE_INTEGER,
      icon: "antimatter"
    }
  });
  MR2.registerSpellElement({
    colors: antimatterTheme,
    id: ELEMENT_NAME,
    name: "Antimatter",
    description: "A mysterious Element. Nothing is known about it except that it's ridiculous."
  });
  MR2.registerExtraElementToResourceMapping(ELEMENT_NAME, RESOURCE_NAME);
}
function loadElementCreationTestMod(MR2) {
  class ChannelAntimatter extends MR2.BasicChannelingSpellBase {
    getId() {
      return "channelAntimatter";
    }
    getSpellName() {
      return "Channel Antimatter";
    }
    getElement() {
      return ELEMENT_NAME;
    }
    getDisplayDescription(state) {
      return "Channel some of your Mana into Antimatter Essence, a basic resource.";
    }
    getLevelRequirements() {
      return {
        Antimatter: 1
      };
    }
    getManaCostProportion() {
      return 0.3;
    }
    getBaseEssenceEfficiency() {
      return 10;
    }
  }
  const channelAntimatter = new ChannelAntimatter();
  MR2.registerSpell(channelAntimatter);
  MR2.registerChannelingSpellForElement("Antimatter", channelAntimatter);
  MR2.createAndLoadElementalShard("Antimatter", __webpack_require__(/*! ./image/Antimatter.png */ "./src/mod/image/Antimatter.png"), 0.25);
  MR2.SaveDataCompatibilityTransforms.register(state => {
    state = MR2.unlockElement(ELEMENT_NAME)(state);
    return state;
  }, "antimatterUnlocker");
}

/***/ }),

/***/ "./node_modules/magic-research-2-modding-sdk/index.js":
/*!************************************************************!*\
  !*** ./node_modules/magic-research-2-modding-sdk/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   minGameVersion: () => (/* binding */ minGameVersion)
/* harmony export */ });
const minGameVersion = (__webpack_require__(/*! ./package.json */ "./node_modules/magic-research-2-modding-sdk/package.json").minGameVersion);



/***/ }),

/***/ "./src/mod/image/Antimatter.png":
/*!**************************************!*\
  !*** ./src/mod/image/Antimatter.png ***!
  \**************************************/
/***/ ((module) => {

module.exports = "data:image/png;base64,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";

/***/ }),

/***/ "./node_modules/magic-research-2-modding-sdk/package.json":
/*!****************************************************************!*\
  !*** ./node_modules/magic-research-2-modding-sdk/package.json ***!
  \****************************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"magic-research-2-modding-sdk","version":"1.7.5","minGameVersion":"1.7.4","description":"Type declarations for Magic Research 2 modding","main":"index.js","types":"modding-decs/backend/modding/Modding.d.ts","scripts":{"test":"echo \\"Error: no test specified\\" && exit 1"},"repository":{"type":"git","url":"git+https://github.com/mcolotto/magic-research-2-modding-sdk.git"},"author":"maticolotto","license":"MIT","bugs":{"url":"https://github.com/mcolotto/magic-research-2-modding-sdk/issues"},"homepage":"https://github.com/mcolotto/magic-research-2-modding-sdk#readme","dependencies":{"react-native":"^0.74.3"}}');

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"dependencies":{"magic-research-2-modding-sdk":"^1.7.5","moment":"^2.30.1","react":"^18.3.1","typescript":"^5.5.3"},"devDependencies":{"@callstack/react-theme-provider":"^3.0.9","@expo/webpack-config":"^19.0.1","@types/react":"^18.3.3","@webpack-cli/generators":"^3.0.7","expo":"^51.0.22","react-native-paper":"^5.12.3","ts-loader":"^9.5.1","undici-types":"^6.19.2","url-loader":"^4.1.1","webpack":"^5.93.0"},"name":"mr2-test-mods","description":"MR2 Test Mods","version":"1.0.2","scripts":{"build":"webpack --node-env=production","build:dev":"webpack --node-env=development","build:prod":"webpack --node-env=production","watch":"webpack --watch","upgrade-sdk":"yarn upgrade --latest magic-research-2-modding-sdk"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   description: () => (/* binding */ description),
/* harmony export */   id: () => (/* binding */ id),
/* harmony export */   load: () => (/* binding */ load),
/* harmony export */   minGameVersion: () => (/* binding */ minGameVersion),
/* harmony export */   name: () => (/* binding */ name),
/* harmony export */   preload: () => (/* binding */ preload),
/* harmony export */   version: () => (/* binding */ version)
/* harmony export */ });
const minGameVersion = (__webpack_require__(/*! magic-research-2-modding-sdk */ "./node_modules/magic-research-2-modding-sdk/index.js").minGameVersion);
const {
  load,
  preload,
  id,
  name,
  version,
  description
} = __webpack_require__(/*! ./MR2TestMods */ "./src/MR2TestMods.ts");

var __webpack_export_target__ = this;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=mr2-test-mods.js.map