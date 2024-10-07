export function useItemCalculator(item, level) {
    const calculateStats = () => {
        if (!item) {
            return;
        }

        const { base_stats } = item;
        const stats = {};

        const statConfig = [
            { key: "min_ac", calcFn: calculateDefense, statKey: "defense" },
            {
                key: "min_damage",
                calcFn: () => calculateDamageByKey("min_damage", "max_damage"),
                statKey: "damage.one_handed",
            },
            {
                key: "min_2h_damage",
                calcFn: () =>
                    calculateDamageByKey("min_2h_damage", "max_2h_damage"),
                statKey: "damage.two_handed",
            },
            {
                key: "min_missile_damage",
                calcFn: () =>
                    calculateDamageByKey(
                        "min_missile_damage",
                        "max_missile_damage"
                    ),
                statKey: "damage.missile",
            },
            {
                key: "required_level",
                calcFn: calculateLevel,
                statKey: "required_level",
            },
            {
                key: "required_str",
                calcFn: calculateStatWithMultiplier("required_str"),
                statKey: "required_str",
            },
            {
                key: "required_dex",
                calcFn: calculateStatWithMultiplier("required_dex"),
                statKey: "required_dex",
            },
            { key: "block", calcFn: calculateBlock, statKey: "block" },
        ];

        statConfig.forEach(({ key, calcFn, statKey }) => {
            if (base_stats[key] > 0) {
                setStat(stats, statKey, calcFn());
            }
        });

        return stats;
    };

    // Generic stat calculator for required_str, required_dex, etc.
    const calculateStatWithMultiplier = (statKey) => () => {
        const { base_stats } = item;
        let isModified = false;

        const multiplier = getModifierValue("item_req_percent", true) || 1;
        if (multiplier > 1) {
            isModified = true;
        }

        return {
            value: Math.ceil(base_stats[statKey] * multiplier),
            modified: isModified,
        };
    };

    const calculateDefense = () => {
        const { base_stats, set_stats } = item;

        const baseDefense = hasModifier("item_armor_percent")
            ? base_stats.max_ac + 1
            : set_stats?.defense || 0;

        const defenseModifiers = getModifierValue("armorclass") || 0;
        const defensePerLevelModifiers =
            getModifierPerLevel("item_armor_perlevel") || 0;
        const defenseMultiplier =
            getModifierValue("item_armor_percent", true) || 1;
        const isModified =
            defenseModifiers > 0 ||
            defensePerLevelModifiers > 0 ||
            defenseMultiplier > 1;
        const finalDefense = Math.floor(
            baseDefense * defenseMultiplier +
                defenseModifiers +
                defensePerLevelModifiers
        );

        return { value: finalDefense, modified: isModified };
    };

    const calculateBlock = () => {
        const { base_stats } = item;
        let isModified = false;

        const blockModifiers = getModifierValue("toblock") || 0;

        if (blockModifiers > 0) {
            isModified = true;
        }

        return {
            value: base_stats.block + blockModifiers,
            modified: isModified,
        };
    };

    // Damage calculation remains similar but using helper function
    const calculateDamageByKey = (minKey, maxKey) => {
        const { base_stats } = item;
        let _min = base_stats[minKey];
        let _max = base_stats[maxKey];
        let _minAdd = 0;
        let _maxAdd = 0;

        const dmgMultiplier = getModifierValue("maxdamage_percent", true) || 1;

        item.modifiers.forEach((modifier) => {
            _minAdd += getModifierDamage(modifier, "minimum_dmg", "minValue");
            _maxAdd += getModifierDamage(modifier, "maximum_dmg", "maxValue");
        });

        const isModified = _minAdd > 0 || _maxAdd > 0 || dmgMultiplier > 1;

        const finalMin = Math.floor(_min * dmgMultiplier + _minAdd);
        const finalMax = Math.floor(_max * dmgMultiplier + _maxAdd);

        console.log("Calculated final damage:", finalMin, finalMax);

        return {
            value: { min: finalMin, max: finalMax },
            modified: isModified,
        };
    };

    const getModifierDamage = (modifier, modifierName, valueKey) => {
        if (modifier.name === modifierName) {
            return parseInt(modifier.values[valueKey] || 0);
        }
        return 0;
    };

    const calculateLevel = () => {
        const { base_stats } = item;
        return { value: base_stats.required_level, modified: false };
    };

    // Utility function to safely set stats in nested objects
    const setStat = (stats, path, value) => {
        const keys = path.split(".");
        let current = stats;

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        });
    };

    const hasModifier = (modifierName) => {
        return item.modifiers.some((mod) => mod.name === modifierName);
    };

    const getModifierValue = (modifierName, isMultiplier) => {
        const modifier = getModifier(modifierName);

        if (isMultiplier) {
            return modifier ? parseInt(modifier.values.value) / 100 + 1 : null;
        } else {
            return modifier ? parseInt(modifier.values.value) : null;
        }
    };

    const getModifierPerLevel = (modifierName) => {
        const modifier = getModifier(modifierName);
        return modifier ? parseFloat(modifier.values.perLevel) * level : null;
    };

    const getModifier = (modifierName) => {
        return item.modifiers.find((mod) => mod.name === modifierName);
    };

    return {
        calculateStats,
    };
}
