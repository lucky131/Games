/**
 * 合成配方定义
 *
 * 配方格式：
 * {
 *   resultId: 'bf_sword',         // 产物 itemId
 *   materials: [                   // 材料列表（支持2~3件）
 *     { id: 'long_sword', count: 2 }
 *   ],
 *   goldCost: 0                    // 额外需要金币
 * }
 */

export const recipes = [
  // ====================================
  // 二级装备 (2×L1)
  // ====================================
  {
    resultId: 'giants_belt',
    materials: [
      { id: 'ruby_crystal', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'crystalline_racer',
    materials: [
      { id: 'ruby_crystal', count: 1 },
      { id: 'healing_bead', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'kindlegem',
    materials: [
      { id: 'ruby_crystal', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'tunneler',
    materials: [
      { id: 'ruby_crystal', count: 1 },
      { id: 'long_sword', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'catalyst_of_aeons',
    materials: [
      { id: 'ruby_crystal', count: 1 },
      { id: 'sapphire_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'bramble_vest',
    materials: [
      { id: 'ruby_crystal', count: 1 },
      { id: 'cloth_armor', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'haunting_guise',
    materials: [
      { id: 'ruby_crystal', count: 1 },
      { id: 'amplifying_tome', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'serrated_dirk',
    materials: [
      { id: 'long_sword', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'zeal',
    materials: [
      { id: 'long_sword', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'recurve_bow',
    materials: [
      { id: 'long_sword', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'caulfields_warhammer',
    materials: [
      { id: 'long_sword', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'vampiric_scepter',
    materials: [
      { id: 'long_sword', count: 1 },
      { id: 'healing_bead', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'hextech_alternator',
    materials: [
      { id: 'amplifying_tome', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'fiendish_codex',
    materials: [
      { id: 'amplifying_tome', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'seekers_armguard',
    materials: [
      { id: 'amplifying_tome', count: 1 },
      { id: 'cloth_armor', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'blighting_jewel',
    materials: [
      { id: 'amplifying_tome', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'verdant_barrier',
    materials: [
      { id: 'amplifying_tome', count: 1 },
      { id: 'null_magic_mantle', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'aegis_of_the_legion',
    materials: [
      { id: 'cloth_armor', count: 1 },
      { id: 'null_magic_mantle', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'wardens_mail',
    materials: [
      { id: 'cloth_armor', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'glacial_buckler',
    materials: [
      { id: 'cloth_armor', count: 1 },
      { id: 'sapphire_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'negatron_cloak',
    materials: [
      { id: 'null_magic_mantle', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'spectres_cowl',
    materials: [
      { id: 'null_magic_mantle', count: 1 },
      { id: 'healing_bead', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'forbidden_idol',
    materials: [
      { id: 'sapphire_crystal', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'bandleglass_mirror',
    materials: [
      { id: 'glowing_mote', count: 1 },
      { id: 'sapphire_crystal', count: 1 }
    ],
    goldCost: 2
  },

  // ====================================
  // 三级装备（材料以二级为主，允许掺一级：掺了就低于 26c，是有意为之）
  // ====================================
  {
    resultId: 'heartsteel',
    materials: [
      { id: 'giants_belt', count: 2 },
      { id: 'ruby_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    resultId: 'warmogs_armor',
    materials: [
      { id: 'ruby_crystal', count: 1 },
      { id: 'crystalline_racer', count: 2 }
    ],
    goldCost: 2
  },
  {
    resultId: 'sunfire_aegis',
    materials: [
      { id: 'giants_belt', count: 1 },
      { id: 'kindlegem', count: 1 },
      { id: 'cloth_armor', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 注意：这条混了一级材料，价值 21c 会低于纯二级配方的 26c，是有意允许的
    resultId: 'thornmail',
    materials: [
      { id: 'wardens_mail', count: 1 },
      { id: 'bramble_vest', count: 1 },
      { id: 'ruby_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（掘道钻头 8 + 红水晶 3 + 长剑 3 + 2）
    resultId: 'steraks_gage',
    materials: [
      { id: 'tunneler', count: 1 },
      { id: 'ruby_crystal', count: 1 },
      { id: 'long_sword', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（燃烧宝石 8 + 幽魂斗篷 8 + 红水晶 3 + 2）
    resultId: 'spirit_visage',
    materials: [
      { id: 'kindlegem', count: 1 },
      { id: 'spectres_cowl', count: 1 },
      { id: 'ruby_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（巨人腰带 8 + 燃烧宝石 8 + 蓝水晶 3 + 2）
    resultId: 'winters_approach',
    materials: [
      { id: 'giants_belt', count: 1 },
      { id: 'kindlegem', count: 1 },
      { id: 'sapphire_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（巨人腰带 8 + 守望者铠甲 8 + 2）
    resultId: 'randuins_omen',
    materials: [
      { id: 'giants_belt', count: 1 },
      { id: 'wardens_mail', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（巨人腰带 8 + 增幅典籍 3 + 增幅典籍 3 + 2）
    resultId: 'rylais_crystal_scepter',
    materials: [
      { id: 'giants_belt', count: 1 },
      { id: 'amplifying_tome', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（掘道钻头 8 + 红水晶 3 + 长剑 3 + 2）
    resultId: 'hullbreaker',
    materials: [
      { id: 'tunneler', count: 1 },
      { id: 'ruby_crystal', count: 1 },
      { id: 'long_sword', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（巨人腰带 8 + 掘道钻头 8 + 长剑 3 + 2）
    resultId: 'titanic_hydra',
    materials: [
      { id: 'giants_belt', count: 1 },
      { id: 'tunneler', count: 1 },
      { id: 'long_sword', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 26c（巨人腰带 8 + 守望者铠甲 8 + 负极斗篷 8 + 2）
    resultId: 'jaksho_the_protean',
    materials: [
      { id: 'giants_belt', count: 1 },
      { id: 'wardens_mail', count: 1 },
      { id: 'negatron_cloak', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（负极斗篷 8 + 幽魂斗篷 8 + 红水晶 3 + 2）
    resultId: 'kaenic_rookern',
    materials: [
      { id: 'negatron_cloak', count: 1 },
      { id: 'spectres_cowl', count: 1 },
      { id: 'ruby_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（燃烧宝石 8 + 军团圣盾 8 + 2）
    resultId: 'locket_of_the_iron_solari',
    materials: [
      { id: 'kindlegem', count: 1 },
      { id: 'aegis_of_the_legion', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（燃烧宝石 8 + 负极斗篷 8 + 2）
    resultId: 'abyssal_mask',
    materials: [
      { id: 'kindlegem', count: 1 },
      { id: 'negatron_cloak', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（幽魂面具 8 + 海克斯科技发电机 8 + 2）
    resultId: 'liandrys_torment',
    materials: [
      { id: 'haunting_guise', count: 1 },
      { id: 'hextech_alternator', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（幽魂面具 8 + 恶魔法典 8 + 2）
    resultId: 'riftmaker',
    materials: [
      { id: 'haunting_guise', count: 1 },
      { id: 'fiendish_codex', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（燃烧宝石 8 + 反曲之弓 8 + 增幅典籍 3 + 2）
    resultId: 'dusk_and_dawn',
    materials: [
      { id: 'kindlegem', count: 1 },
      { id: 'recurve_bow', count: 1 },
      { id: 'amplifying_tome', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（燃烧宝石 8 + 布甲 3 + 抗魔斗篷 3 + 2）
    resultId: 'zekes_convergence',
    materials: [
      { id: 'kindlegem', count: 1 },
      { id: 'cloth_armor', count: 1 },
      { id: 'null_magic_mantle', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（燃烧宝石 8 + 掘道钻头 8 + 长剑 3 + 2）
    resultId: 'black_cleaver',
    materials: [
      { id: 'kindlegem', count: 1 },
      { id: 'tunneler', count: 1 },
      { id: 'long_sword', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 26c（掘道钻头 8 + 狂热 8 + 考尔菲德的战锤 8 + 2）
    resultId: 'trinity_force',
    materials: [
      { id: 'tunneler', count: 1 },
      { id: 'zeal', count: 1 },
      { id: 'caulfields_warhammer', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（掘道钻头 8 + 锯齿短匕 8 + 2）
    resultId: 'edge_of_night',
    materials: [
      { id: 'tunneler', count: 1 },
      { id: 'serrated_dirk', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（幽魂面具 8 + 恶魔法典 8 + 2）
    // 与裂隙制造者同材料：合成表会并列出现两条配方，由玩家自己选产物
    resultId: 'bloodletters_curse',
    materials: [
      { id: 'haunting_guise', count: 1 },
      { id: 'fiendish_codex', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（万世催化石 8 ×2 + 2）
    resultId: 'rod_of_ages',
    materials: [
      { id: 'catalyst_of_aeons', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（狂热 8 + 反曲之弓 8 + 2）
    // 狂热 / 反曲之弓也分别被三相之力、黄昏与黎明用到，属部分重叠，不是同材料重复配方
    resultId: 'fiendhunter_bolts',
    materials: [
      { id: 'zeal', count: 1 },
      { id: 'recurve_bow', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（吸血鬼节杖 8 + 考尔菲德的战锤 8 + 2）
    resultId: 'endless_hunger',
    materials: [
      { id: 'vampiric_scepter', count: 1 },
      { id: 'caulfields_warhammer', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（掘道钻头 8 + 军团圣盾 8 + 2）
    resultId: 'guardian_angel',
    materials: [
      { id: 'tunneler', count: 1 },
      { id: 'aegis_of_the_legion', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 26c（锯齿短匕 8 + 狂热 8 + 反曲之弓 8 + 2）
    // 三件二级装备同源于长剑×2，凑一件无尽之刃要 6 把长剑
    resultId: 'infinity_edge',
    materials: [
      { id: 'serrated_dirk', count: 1 },
      { id: 'zeal', count: 1 },
      { id: 'recurve_bow', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（锯齿短匕 8 + 狂热 8 + 长剑 3 + 2）
    resultId: 'lord_dominiks_regards',
    materials: [
      { id: 'serrated_dirk', count: 1 },
      { id: 'zeal', count: 1 },
      { id: 'long_sword', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（狂热 8 + 吸血鬼节杖 8 + 治疗宝珠 3 + 2）
    resultId: 'bloodthirster',
    materials: [
      { id: 'zeal', count: 1 },
      { id: 'vampiric_scepter', count: 1 },
      { id: 'healing_bead', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（反曲之弓 8 + 负极斗篷 8 + 荧尘 3 + 2）
    resultId: 'wits_end',
    materials: [
      { id: 'recurve_bow', count: 1 },
      { id: 'negatron_cloak', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（反曲之弓 8 + 长剑 3 + 增幅典籍 3 + 2）
    resultId: 'guinsoos_rageblade',
    materials: [
      { id: 'recurve_bow', count: 1 },
      { id: 'long_sword', count: 1 },
      { id: 'amplifying_tome', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（吸血鬼节杖 8 + 海克斯科技发电机 8 + 2）
    resultId: 'hextech_gunblade',
    materials: [
      { id: 'vampiric_scepter', count: 1 },
      { id: 'hextech_alternator', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（反曲之弓 8 + 吸血鬼节杖 8 + 长剑 3 + 2）
    resultId: 'blade_of_the_ruined_king',
    materials: [
      { id: 'recurve_bow', count: 1 },
      { id: 'vampiric_scepter', count: 1 },
      { id: 'long_sword', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（反曲之弓 8 + 海克斯科技发电机 8 + 2）
    resultId: 'terminus',
    materials: [
      { id: 'recurve_bow', count: 1 },
      { id: 'hextech_alternator', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（考尔菲德的战锤 8 + 禁忌雕像 8 + 2）
    resultId: 'essence_reaver',
    materials: [
      { id: 'caulfields_warhammer', count: 1 },
      { id: 'forbidden_idol', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（狂热 8 ×2 + 2）
    // 狂热也散在三相之力、猎魔人弩箭等配方里，但「狂热×2」只有这一条
    resultId: 'navori_flickerblade',
    materials: [
      { id: 'zeal', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（锯齿短匕 8 ×2 + 2）
    resultId: 'the_collector',
    materials: [
      { id: 'serrated_dirk', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（锯齿短匕 8 + 考尔菲德的战锤 8 + 2）
    resultId: 'seryldas_grudge',
    materials: [
      { id: 'serrated_dirk', count: 1 },
      { id: 'caulfields_warhammer', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（锯齿短匕 8 + 长剑 3 ×2 + 2）
    resultId: 'serpents_fang',
    materials: [
      { id: 'serrated_dirk', count: 1 },
      { id: 'long_sword', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 13c（锯齿短匕 8 + 荧尘 3 + 2）
    resultId: 'hubris',
    materials: [
      { id: 'serrated_dirk', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 13c（枯萎宝珠 8 + 红水晶 3 + 2）
    resultId: 'mejais_soulstealer',
    materials: [
      { id: 'blighting_jewel', count: 1 },
      { id: 'ruby_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（海克斯科技发电机 8 + 恶魔法典 8 + 2）
    resultId: 'blackfire_torch',
    materials: [
      { id: 'hextech_alternator', count: 1 },
      { id: 'fiendish_codex', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（反曲之弓 8 + 恶魔法典 8 + 荧尘 3 + 2）
    resultId: 'nashors_tooth',
    materials: [
      { id: 'recurve_bow', count: 1 },
      { id: 'fiendish_codex', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（恶魔法典 8 + 增幅典籍 3 ×2 + 2）
    resultId: 'malignance',
    materials: [
      { id: 'fiendish_codex', count: 1 },
      { id: 'amplifying_tome', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（枯萎宝珠 8 ×2 + 2）
    resultId: 'void_staff',
    materials: [
      { id: 'blighting_jewel', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（海克斯科技发电机 8 + 恶魔法典 8 + 蓝水晶 3 + 2）
    resultId: 'ludens_echo',
    materials: [
      { id: 'hextech_alternator', count: 1 },
      { id: 'fiendish_codex', count: 1 },
      { id: 'sapphire_crystal', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（恶魔法典 8 + 枯萎宝珠 8 + 治疗宝珠 3 + 2）
    resultId: 'cryptbloom',
    materials: [
      { id: 'fiendish_codex', count: 1 },
      { id: 'blighting_jewel', count: 1 },
      { id: 'healing_bead', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 26c（海克斯科技发电机 8 ×2 + 枯萎宝珠 8 + 2）
    resultId: 'rabadons_deathcap',
    materials: [
      { id: 'hextech_alternator', count: 2 },
      { id: 'blighting_jewel', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（海克斯科技发电机 8 + 探索者的护臂 8 + 2）
    resultId: 'zhonyas_hourglass',
    materials: [
      { id: 'hextech_alternator', count: 1 },
      { id: 'seekers_armguard', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（枯萎宝珠 8 + 增幅典籍 3 ×2 + 2）
    resultId: 'shadowflame',
    materials: [
      { id: 'blighting_jewel', count: 1 },
      { id: 'amplifying_tome', count: 2 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 21c（冰川圆盾 8 + 守望者铠甲 8 + 荧尘 3 + 2）
    resultId: 'frozen_heart',
    materials: [
      { id: 'glacial_buckler', count: 1 },
      { id: 'wardens_mail', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 价值 18c（晶体护腕 8 + 班德尔玻璃镜 8 + 2）
    resultId: 'redemption',
    materials: [
      { id: 'crystalline_racer', count: 1 },
      { id: 'bandleglass_mirror', count: 1 }
    ],
    goldCost: 2
  },
  {
    // 混了一级材料，价值 16c（燃烧宝石 8 + 治疗宝珠 3 + 荧尘 3 + 2）
    resultId: 'moonstone_renewer',
    materials: [
      { id: 'kindlegem', count: 1 },
      { id: 'healing_bead', count: 1 },
      { id: 'glowing_mote', count: 1 }
    ],
    goldCost: 2
  }
]

/**
 * 根据产物ID获取配方
 * @param {string} resultId
 * @returns {Object|undefined}
 */
export function getRecipeByResultId (resultId) {
  return recipes.find(r => r.resultId === resultId)
}

/**
 * 获取所有配方
 * @returns {Array}
 */
export function getAllRecipes () {
  return recipes
}

/**
 * 获取材料里直接写了某件装备的配方列表
 * 只看一层：用于「手上这件装备现在能合成什么」，材料必须真的在手
 * @param {string} itemId
 * @returns {Array}
 */
export function getRecipesContaining (itemId) {
  return recipes.filter(r => r.materials.some(m => m.id === itemId))
}

/**
 * 判断一条配方的材料链里是否用到了某件装备（递归追溯到底）
 * 与 getRecipesContaining 的区别：三级配方的材料是二级装备，二级装备又由一级装备合成，
 * 想查「用红水晶能做出什么」就必须顺着配方树一直往下找，只看 recipe.materials 是找不到的。
 * @param {Object} recipe 配方
 * @param {string} itemId 装备 id
 * @returns {boolean}
 */
export function recipeContainsItem (recipe, itemId) {
  return materialsContainItem(recipe.materials, itemId, new Set())
}

/**
 * 递归查找材料链中是否出现某件装备
 * @param {Array} materials 形如 [{ id, count }]
 * @param {string} itemId 装备 id
 * @param {Set<string>} visiting 当前这条链上已经展开过的装备 id，配方成环时用来断链
 * @returns {boolean}
 */
function materialsContainItem (materials, itemId, visiting) {
  return (materials || []).some(mat => {
    if (mat.id === itemId) return true
    if (visiting.has(mat.id)) return false
    const sub = getRecipeByResultId(mat.id)
    if (!sub) return false
    visiting.add(mat.id)
    const hit = materialsContainItem(sub.materials, itemId, visiting)
    visiting.delete(mat.id)
    return hit
  })
}

export default {
  recipes,
  getRecipeByResultId,
  getAllRecipes,
  getRecipesContaining,
  recipeContainsItem
}
