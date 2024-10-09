export const DEBUG = false;
export const MAX_PASSIVES = 5;

export const CHAR_MAP = {
    Amazon: "AM",
    Assassin: "AI",
    Necromancer: "NE",
    Barbarian: "BA",
    Paladin: "PA",
    Sorceress: "SO",
    Druid: "DZ",
};

export const OTHER = {
    MAX_EIAS: 75, // for a brief period of D2R, this limit did not exist. rip bugged ias frames :(
    MIN_EIAS: -85,
    MAX_EIAS_WEREFORMS: 150,
    MAX_IAS_ACCELERATION_WEAPON: 60,
    MAX_IAS_ACCELERATION_CHARACTER: 88,
    MAX_IAS_ACCELERATION_CHARACTER_TWO_HANDED: 83,
    MAX_IAS_ACCELERATION_MERCENARY: 78,
    MAX_IAS_WEAPON: 120,
};

export const ANIM_DATA = {
    // [model code]{2}[animation mode]{2}[weapon class]{3}: [framesPerDirection, action frame, starting frame, animation speed]
    // 0A - Act 5 Mercenary - originally calculating with only 16 FPD, which one is correct?
    // A1 - normal attack animation 1
    "0AA11HS": [17, 6, 0, 256],
    "0AA12HS": [16, 5, 0, 256],
    // A2 - normal attack animation 2
    "0AA21HS": [17, 9, 0, 256],
    "0AA22HS": [16, 6, 0, 256],
    // 40 - Werewolf
    // A1 - normal attack animation 1
    "40A1HTH": [13, 7, 0, 256],
    // A2 - normal attack animation 2
    "40A2HTH": [13, 7, 0, 256],
    // S3 - bite animation
    "40S3HTH": [10, 6, 0, 240],
    // AI - Assassin
    // A1 - normal attack animation 1
    AIA11HS: [15, 7, 0, 256], // one handed swinging
    AIA11HT: [15, 7, 0, 256], // one handed thrusting
    AIA12HS: [23, 11, 0, 256], // two handed swords
    AIA12HT: [23, 10, 0, 256], // two handed thrusting
    AIA1BOW: [16, 7, 0, 256], // bows
    AIA1HT1: [11, 6, 0, 208], // one claw
    AIA1HT2: [11, 6, 0, 208], // two claws
    AIA1HTH: [11, 6, 0, 256], // unarmed
    AIA1STF: [19, 9, 0, 256], // two handed weapons (but not swords)
    AIA1XBW: [21, 10, 0, 256], // crossbows
    // A2 - normal attack animation 2 (different for HTH, HT1, and HT2)
    AIA21HS: [15, 7, 0, 256], // one handed swinging
    AIA21HT: [15, 7, 0, 256], // one handed thrusting
    AIA22HS: [23, 11, 0, 256], // two handed swords
    AIA22HT: [23, 10, 0, 256], // two handed thrusting
    AIA2HT1: [12, 6, 0, 227], // one claw: 208->227 in 2.5
    AIA2HT2: [12, 6, 0, 227], // two claws: 208->227 in 2.5
    AIA2HTH: [12, 6, 0, 256], // unarmed
    AIA2STF: [19, 9, 0, 256], // two handed weapons (but not swords)
    // KK - kicking animation
    AIKK1HS: [13, 4, 0, 256], // one handed swinging
    AIKK1HT: [13, 4, 0, 256], // one handed thrusting
    AIKK2HS: [13, 4, 0, 256], // two handed swords
    AIKK2HT: [13, 4, 0, 256], // two handed thrusting
    AIKKBOW: [13, 4, 0, 256], // bows
    AIKKHT1: [13, 4, 0, 208], // one claw
    AIKKHT2: [13, 4, 0, 208], // two claws
    AIKKHTH: [13, 4, 0, 256], // unarmed
    AIKKSTF: [13, 4, 0, 256], // two handed weapons (but not swords)
    AIKKXBW: [13, 4, 0, 256], // crossbows
    // S2 - trap laying animation
    AIS21HS: [8, 4, 0, 128],
    AIS21HT: [8, 4, 0, 128],
    AIS22HS: [8, 4, 0, 128],
    AIS22HT: [8, 4, 0, 128],
    AIS2BOW: [8, 4, 0, 128],
    AIS2HT1: [8, 4, 0, 128],
    AIS2HT2: [8, 4, 0, 128],
    AIS2HTH: [8, 4, 0, 128],
    AIS2STF: [8, 4, 0, 128],
    AIS2XBW: [8, 4, 0, 128],
    // S4 - second weapon melee animation while dual wielding for Assassin
    AIS4HT2: [12, 6, 0, 227], // two claws: 208->227 in 2.5
    // TH - throwing animation
    AITH1HS: [16, 7, 0, 256], // one handed swinging
    AITH1HT: [16, 7, 0, 256], // one handed thrusting
    // AM - Amazon
    // A1 - normal attack animation 1
    AMA11HS: [16, 10, 2, 256], // one handed swinging
    AMA11HT: [15, 9, 2, 256], // one handed thrusting
    AMA12HS: [20, 12, 2, 256], // two handed swords
    AMA12HT: [18, 11, 2, 256], // two handed thrusting
    AMA1BOW: [14, 6, 0, 256], // bows
    AMA1HTH: [13, 8, 1, 256], // unarmed
    AMA1STF: [20, 12, 2, 256], // two handed weapons (but not swords)
    AMA1XBW: [20, 9, 0, 256], // crossbows
    // A2 - normal attack animation 2 (identical to A1)
    AMA21HS: [16, 10, 2, 256], // one handed swinging
    AMA21HT: [15, 9, 2, 256], // one handed thrusting
    AMA22HS: [20, 12, 2, 256], // two handed swords
    AMA22HT: [18, 11, 2, 256], // two handed thrusting
    AMA2STF: [20, 12, 2, 256], // two handed weapons (but not swords)
    // KK - kicking animation
    AMKK1HS: [12, 5, 0, 256], // one handed swinging
    AMKK1HT: [12, 5, 0, 256], // one handed thrusting
    AMKK2HS: [12, 5, 0, 256], // two handed swords
    AMKK2HT: [12, 5, 0, 256], // two handed thrusting
    AMKKBOW: [12, 5, 0, 256], // bows
    AMKKHTH: [12, 5, 0, 256], // unarmed
    AMKKSTF: [12, 5, 0, 256], // two handed weapons (but not swords)
    AMKKXBW: [12, 5, 0, 256], // crossbows
    // S1 - dodge animation (action frame omitted because not relevant and not all animations had an action frame)
    AMS11HS: [9, 0, 0, 256], // one handed swinging
    AMS11HT: [9, 0, 0, 256], // one handed thrusting
    AMS12HS: [9, 0, 0, 256], // two handed swords
    AMS12HT: [9, 0, 0, 256], // two handed thrusting
    AMS1BOW: [9, 0, 0, 256], // bows
    AMS1HTH: [9, 0, 0, 256], // unarmed
    AMS1STF: [9, 0, 0, 256], // two handed weapons (but not swords)
    AMS1XBW: [9, 0, 0, 256], // crossbows
    // TH - throwing animation
    AMTH1HS: [16, 9, 0, 256], // one handed swinging
    AMTH1HT: [16, 9, 0, 256], // one handed thrusting
    //AMTHHTH: [16, 9, 0, 256],		// ?
    // BA - Barbarian
    // A1 - normal attack animation 1
    BAA11HS: [16, 7, 0, 256], // one handed swinging
    BAA11HT: [16, 7, 0, 256], // one handed thrusting
    BAA11JS: [16, 7, 0, 256], // glove-side hand thrusting, boot-side hand swinging
    BAA11JT: [16, 7, 0, 256], // two thrusting weapons
    BAA11SS: [16, 7, 0, 256], // two swinging weapons
    BAA11ST: [16, 7, 0, 256], // glove-side hand swinging, boot-side hand thrusting
    BAA12HS: [18, 8, 0, 256], // two handed swords
    BAA12HT: [19, 9, 0, 256], // two handed thrusting
    BAA1BOW: [15, 7, 0, 256], // bows
    BAA1HTH: [12, 6, 0, 256], // unarmed
    BAA1STF: [19, 9, 0, 256], // two handed weapons (but not swords)
    BAA1XBW: [20, 10, 0, 256], // crossbows
    // A2 - normal attack animation 2 (identical)
    BAA11HS: [16, 7, 0, 256], // one handed swinging
    BAA11HT: [16, 7, 0, 256], // one handed thrusting
    BAA11JS: [16, 7, 0, 256], // glove-side hand thrusting, boot-side hand swinging
    BAA11JT: [16, 7, 0, 256], // two thrusting weapons
    BAA11SS: [16, 7, 0, 256], // two swinging weapons
    BAA11ST: [16, 7, 0, 256], // glove-side hand swinging, boot-side hand thrusting
    BAA12HS: [18, 8, 0, 256], // two handed swords
    BAA12HT: [19, 9, 0, 256], // two handed thrusting
    BAA1HTH: [12, 6, 0, 256], // unarmed
    BAA1STF: [19, 9, 0, 256], // two handed weapons (but not swords)
    // KK - kicking animation
    BAKK1HS: [12, 4, 0, 256], // one handed swinging
    BAKK1HT: [12, 4, 0, 256], // one handed thrusting
    BAKK1JS: [12, 4, 0, 256], // glove-side hand thrusting, boot-side hand swinging
    BAKK1JT: [12, 4, 0, 256], // two thrusting weapons
    BAKK1SS: [12, 4, 0, 256], // two swinging weapons
    BAKK1ST: [12, 4, 0, 256], // glove-side hand swinging, boot-side hand thrusting
    BAKK2HS: [12, 4, 0, 256], // two handed swords
    BAKK2HT: [12, 4, 0, 256], // two handed thrusting
    BAKKBOW: [12, 4, 0, 256], // bows
    BAKKHTH: [12, 4, 0, 256], // unarmed
    BAKKSTF: [12, 4, 0, 256], // two handed weapons (but not swords)
    BAKKXBW: [12, 4, 0, 256], // crossbows
    // S3 - second weapon melee animation while dual wielding for Barbarian
    BAS31JS: [12, 8, 0, 256], // glove-side hand thrusting, boot-side hand swinging
    BAS31JT: [12, 8, 0, 256], // two thrusting weapons
    BAS31SS: [12, 7, 0, 256], // two swinging weapons
    BAS31ST: [12, 7, 0, 256], // glove-side hand swinging, boot-side hand thrusting
    // S4 - second weapon throw animation while dual wielding for Barbarian
    BAS41JS: [16, 8, 0, 256], // glove-side hand thrusting, boot-side hand swinging
    BAS41JT: [16, 8, 0, 256], // two thrusting weapons
    BAS41SS: [16, 9, 0, 256], // two swinging weapons
    BAS41ST: [16, 9, 0, 256], // glove-side hand swinging, boot-side hand thrusting
    // TH - throwing animation
    BATH1HS: [16, 8, 0, 256], // one handed swinging
    BATH1HT: [16, 8, 0, 256], // one handed thrusting
    BATH1JS: [16, 8, 0, 256], // glove-side hand thrusting, boot-side hand swinging
    BATH1JT: [16, 8, 0, 256], // two thrusting weapons
    BATH1SS: [16, 8, 0, 256], // two swinging weapons
    BATH1ST: [16, 8, 0, 256], // glove-side hand swinging, boot-side hand thrusting
    //BATHHTH: [16, 8, 0, 256],		// ?
    // DZ - Druid
    // A1 - normal attack animation 1
    DZA11HS: [19, 9, 0, 256], // one handed swinging
    DZA11HT: [19, 8, 0, 256], // one handed thrusting
    DZA12HS: [21, 10, 0, 256], // two handed swords
    DZA12HT: [23, 9, 0, 256], // two handed thrusting
    DZA1BOW: [16, 8, 0, 256], // bows
    DZA1HTH: [16, 8, 0, 256], // unarmed
    DZA1STF: [17, 9, 0, 256], // two handed weapons (but not swords)
    DZA1XBW: [20, 10, 0, 256], // crossbows
    // A2 - normal attack animation 2 (identical to A1)
    DZA21HS: [19, 9, 0, 256], // one handed swinging
    DZA21HT: [19, 8, 0, 256], // one handed thrusting
    DZA22HS: [21, 10, 0, 256], // two handed swords
    DZA22HT: [23, 9, 0, 256], // two handed thrusting
    DZA2STF: [17, 9, 0, 256], // two handed weapons (but not swords)
    // KK - kicking animation
    DZKK1HS: [12, 5, 0, 224], // one handed swinging
    DZKK1HT: [12, 5, 0, 256], // one handed thrusting
    DZKK2HS: [12, 5, 0, 224], // two handed swords
    DZKK2HT: [12, 5, 0, 256], // two handed thrusting
    DZKKBOW: [12, 5, 0, 256], // bows
    DZKKHTH: [12, 5, 0, 256], // unarmed
    DZKKSTF: [12, 5, 0, 256], // two handed weapons (but not swords)
    DZKKXBW: [12, 5, 0, 256], // crossbows
    // TH - throwing animation
    DZTH1HS: [18, 8, 0, 256], // one handed swinging
    DZTH1HT: [18, 8, 0, 256], // one handed thrusting
    //DZTHHTH: [18, 9, 0, 256],		// ?
    // GU - Act 2 Mercenary
    // A1 - normal attack animation 1
    GUA1HTH: [16, 11, 0, 256],
    // IW - Act 3 Mercenary
    // A1 - normal attack animation 1
    IWA11HS: [15, 6, 0, 256],
    // NE - Necromancer
    // A1 - normal attack animation 1
    NEA11HS: [19, 9, 0, 256], // one handed swinging
    NEA11HT: [19, 9, 0, 256], // one handed thrusting
    NEA12HS: [23, 11, 0, 256], // two handed swords
    NEA12HT: [24, 10, 0, 256], // two handed thrusting
    NEA1BOW: [18, 9, 0, 256], // bows
    NEA1HTH: [15, 8, 0, 256], // unarmed
    NEA1STF: [20, 11, 0, 256], // two handed weapons (but not swords)
    NEA1XBW: [20, 11, 0, 256], // crossbows
    // A2 - normal attack animation 2 (identical to A1)
    NEA21HS: [19, 9, 0, 256], // one handed swinging
    NEA21HT: [19, 9, 0, 256], // one handed thrusting
    NEA22HS: [23, 11, 0, 256], // two handed swords
    NEA22HT: [24, 10, 0, 256], // two handed thrusting
    NEA2HTH: [15, 8, 0, 256], // unarmed
    NEA2STF: [20, 11, 0, 256], // two handed weapons (but not swords)
    // KK - kicking animation
    NEKK1HS: [12, 6, 0, 256], // one handed swinging
    NEKK1HT: [12, 6, 0, 256], // one handed thrusting
    NEKK2HS: [12, 6, 0, 256], // two handed swords
    NEKK2HT: [12, 6, 0, 256], // two handed thrusting
    NEKKBOW: [12, 6, 0, 256], // bows
    NEKKHTH: [12, 6, 0, 256], // unarmed
    NEKKSTF: [12, 6, 0, 256], // two handed weapons (but not swords)
    NEKKXBW: [12, 6, 0, 256], // crossbows
    // TH - throwing animation
    NETH1HS: [20, 10, 0, 256], // one handed swinging
    NETH1HT: [20, 10, 0, 256], // one handed thrusting
    //NETHHTH: [20, 10, 0, 256],		// ?
    // PA - Paladin
    // A1 - normal attack animation 1
    PAA11HS: [15, 7, 0, 256], // one handed swinging
    PAA11HT: [17, 8, 0, 256], // one handed thrusting
    PAA12HS: [18, 8, 0, 256], // two handed swords
    PAA12HT: [20, 8, 0, 256], // two handed thrusting
    PAA1BOW: [16, 8, 0, 256], // bows
    PAA1HTH: [14, 7, 0, 256], // unarmed
    PAA1STF: [18, 9, 0, 256], // two handed weapons (but not swords)
    PAA1XBW: [20, 10, 0, 256], // crossbows
    // A2 - normal attack animation 2 (2HS is different)
    PAA21HS: [15, 7, 0, 256], // one handed swinging
    PAA21HT: [17, 8, 0, 256], // one handed thrusting
    PAA22HS: [19, 8, 0, 256], // two handed swords
    PAA22HT: [20, 8, 0, 256], // two handed thrusting
    PAA2HTH: [14, 7, 0, 256], // unarmed
    PAA2STF: [18, 9, 0, 256], // two handed weapons (but not swords)
    // KK - kicking animation
    PAKK1HS: [12, 5, 0, 256], // one handed swinging
    PAKK1HT: [12, 5, 0, 256], // one handed thrusting
    PAKK2HS: [12, 5, 0, 256], // two handed swords
    PAKK2HT: [12, 5, 0, 256], // two handed thrusting
    PAKKBOW: [12, 5, 0, 256], // bows
    PAKKHTH: [12, 5, 0, 256], // unarmed
    PAKKSTF: [12, 5, 0, 256], // two handed weapons (but not swords)
    PAKKXBW: [12, 5, 0, 256], // crossbows
    // S1 - smite
    PAS11HS: [12, 7, 0, 256], // one handed swinging
    PAS11HT: [12, 7, 0, 256], // one handed thrusting
    PAS1HTH: [12, 7, 0, 256], // unarmed
    // TH - throwing animation
    PATH1HS: [16, 8, 0, 256], // one handed swinging
    PATH1HT: [16, 8, 0, 256], // one handed thrusting
    //PATHHTH: [12, 6, 0, 256],		// ?
    // RG - Act 1 Mercenary
    // A1 - normal attack animation 1
    RGA1HTH: [15, 6, 0, 256],
    // SO - Sorceress
    // A1 - normal attack animation 1
    SOA11HS: [20, 12, 2, 256], // one handed swinging
    SOA11HT: [19, 11, 2, 256], // one handed thrusting
    SOA12HS: [24, 14, 2, 256], // two handed swords
    SOA12HT: [23, 13, 2, 256], // two handed thrusting
    SOA1BOW: [17, 9, 0, 256], // bows
    SOA1HTH: [16, 9, 1, 256], // unarmed
    SOA1STF: [18, 11, 2, 256], // two handed weapons (but not swords)
    SOA1XBW: [20, 11, 0, 256], // crossbows
    // A2 - normal attack animation 2 (identical to A1)
    AMA21HS: [16, 10, 2, 256], // one handed swinging
    AMA21HT: [15, 9, 2, 256], // one handed thrusting
    AMA22HS: [20, 12, 2, 256], // two handed swords
    AMA22HT: [18, 11, 2, 256], // two handed thrusting
    AMA2STF: [20, 12, 2, 256], // two handed weapons (but not swords)
    // KK - kicking animation
    SOKK1HS: [12, 5, 0, 256], // one handed swinging
    SOKK1HT: [12, 5, 0, 256], // one handed thrusting
    SOKK2HS: [12, 5, 0, 256], // two handed swords
    SOKK2HT: [12, 5, 0, 256], // two handed thrusting
    SOKKBOW: [12, 5, 0, 256], // bows
    SOKKHTH: [12, 5, 0, 256], // unarmed
    SOKKSTF: [12, 5, 0, 256], // two handed weapons (but not swords)
    SOKKXBW: [12, 5, 0, 256], // crossbows
    // TH - throwing animation
    SOTH1HS: [16, 9, 0, 256], // one handed swinging
    SOTH1HT: [16, 9, 0, 256], // one handed thrusting
    //AMTHHTH: [16, 9, 0, 256],		// ?
    // TG - Werebear
    // A1 - normal attack animation 1
    TGA1HTH: [12, 7, 0, 224],
    // A2 - normal attack animation 2 (identical to A1)
    TGA2HTH: [12, 7, 0, 224],
    // S3 - bite animation
    TGS3HTH: [10, 6, 0, 208],
};
