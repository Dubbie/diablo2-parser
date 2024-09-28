export function useItemCalculator(reactiveItem) {
    const calculateStats = () => {
        if (!reactiveItem || !reactiveItem.value || !reactiveItem.value.modifiers) {
            return;
        }

        const { base_stats } = reactiveItem.value;
        const stats = {};

        if (base_stats.min_ac > 0) {
            stats.defense = calculateDefense();
        }

        if (base_stats.min_damage > 0 ||
            base_stats.min_2h_damage > 0 ||
            base_stats.min_missile_damage > 0
        ) {
            stats.damage = calculateDamage();
        }

        if (base_stats.required_level > 0) {
            stats.required_level = calculateLevel();
        }

        if (base_stats.required_str > 0) {
            stats.required_str = calculateRequiredStr();
        }

        if (base_stats.required_dex > 0) {
            stats.required_dex = calculateRequiredDex();
        }

        return stats;
    }

    const calculateDefense = () => {
        const { base_stats, set_stats } = reactiveItem.value;
        const baseDefense = hasModifier('item_armor_percent')
            ? base_stats.max_ac + 1
            : set_stats?.defense || 0;

        const defenseModifiers = getModifierValue('armorclass') || 0;
        const defenseMultiplier = getModifierValue('item_armor_percent', true) || 1;

        const isModified = defenseModifiers > 0 || defenseMultiplier > 1;
        const finalDefense = Math.floor(baseDefense * defenseMultiplier + defenseModifiers);

        return { value: finalDefense, modified: isModified };
    };

    const calculateDamage = () => {
        const damage = {};
        const { base_stats } = reactiveItem.value;

        if (base_stats.min_damage > 0) {
            damage['one_handed'] = calculateDamageByKey('min_damage', 'max_damage');
        }
        if (base_stats.min_2h_damage > 0) {
            damage['two_handed'] = calculateDamageByKey('min_2h_damage', 'max_2h_damage');
        }
        if (base_stats.min_missile_damage > 0) {
            damage['missile'] = calculateDamageByKey('min_missile_damage', 'max_missile_damage');
        }

        return damage;
    };

    const calculateLevel = () => {
        const { base_stats } = reactiveItem.value;

        return { value: base_stats.required_level, modified: false };
    }

    const calculateRequiredStr = () => {
        const { base_stats } = reactiveItem.value;
        let isModified = false;

        const strMultiplier = getModifierValue('item_req_percent', true) || 1;
        if (strMultiplier > 1) {
            isModified = true;
        }

        return { value: Math.ceil(base_stats.required_str * strMultiplier), modified: isModified };
    }

    const calculateRequiredDex = () => {
        const { base_stats } = reactiveItem.value;
        let isModified = false;

        const dexMultiplier = getModifierValue('item_req_percent', true) || 1;
        if (dexMultiplier > 1) {
            isModified = true;
        }

        return { value: Math.ceil(base_stats.required_dex * dexMultiplier), modified: isModified };
    }

    // Utility function to calculate damage by keys
    const calculateDamageByKey = (minKey, maxKey) => {
        const { base_stats } = reactiveItem.value;
        let _min = base_stats[minKey];
        let _max = base_stats[maxKey];
        let _minAdd = 0;
        let _maxAdd = 0;

        const dmgMultiplier = getModifierValue('maxdamage_percent', true) || 1;

        reactiveItem.value.modifiers.forEach(modifier => {
            if (modifier.name === 'minimum_dmg') {
                _minAdd += parseInt(modifier.values.value);
            }
            if (modifier.name === 'maximum_dmg') {
                _maxAdd += parseInt(modifier.values.value);
            }
            if (modifier.name === 'dmg_normal') {
                _minAdd += parseInt(modifier.values.minValue);
                _maxAdd += parseInt(modifier.values.maxValue);
            }
        });

        const isModified = _minAdd > 0 || _maxAdd > 0 || dmgMultiplier > 1;

        const finalMin = Math.floor(_min * dmgMultiplier + _minAdd);
        const finalMax = Math.floor(_max * dmgMultiplier + _maxAdd);

        return {
            value: { min: finalMin, max: finalMax },
            modified: isModified
        };
    };

    // Utility function to check for modifier
    const hasModifier = (modifierName) => {
        return reactiveItem.value.modifiers.some(mod => mod.name === modifierName);
    };

    // Utility function to get the value of a modifier
    const getModifierValue = (modifierName, isMultiplier) => {
        const modifier = reactiveItem.value.modifiers.find(mod => mod.name === modifierName);

        if (isMultiplier) {
            return modifier ? (parseInt(modifier.values.value) / 100 + 1) : null;
        } else {
            return modifier ? parseInt(modifier.values.value) : null;
        }
    };

    // Return functions to use in components
    return {
        calculateStats,
    };
}
