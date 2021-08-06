﻿function loadImages($$) {		$$.backgrounds = [];	$$.backgrounds.push((function() {		var obj = {};		obj.image = new Image();		obj.image.src = 'assets/tileable-classic-nebula-space-patterns/' + Math.floor(1 + Math.random() * 8) + '.jpg';		obj.pattern = $$.canvasContext.createPattern(obj.image, 'repeat');			return obj;	})());		$$.imageSets = new Array();	$$.imageSets["player_eos"] = new ImageSet("pack1.png", 0, 0, 48, 50, 0, 5, 1);	$$.imageSets["mine0"] = new ImageSet("pack1.png", 100, 50, 48, 52, 1, 3, 1);	$$.imageSets["mine1"] = new ImageSet("pack1.png", 50, 50, 48, 52, 1, 3, 1);	$$.imageSets["mine2"] = new ImageSet("pack1.png", 0, 50, 48, 52, 1, 3, 1);	$$.imageSets["laser0"] = new ImageSet("pack1.png", 0, 700, 18, 22, 0, 3, 1, 'lighter');	$$.imageSets["diamond0"] = new ImageSet("pack1.png", 0, 259, 22, 22, 0, 5, 1);	$$.imageSets["diamond1"] = new ImageSet("pack1.png", 0, 281, 22, 22, 0, 5, 1);	$$.imageSets["diamond2"] = new ImageSet("pack1.png", 0, 304, 22, 22, 0, 5, 1);	$$.imageSets["green_diamond"] = new ImageSet("pack1.png", 0, 282, 22, 2, 0, 5, 1);	$$.imageSets["blue_diamond"] = new ImageSet("pack1.png", 0, 304, 22, 22, 0, 5, 1);	$$.imageSets["big_explosion_0"] = new ImageSet("pack1.png", 0, 340, 48, 56, 0, 11, 1);	$$.imageSets["small_explosion_0"] = new ImageSet("pack1.png", 0, 400, 24, 24, 0, 5, 1);	$$.imageSets["small_explosion_1"] = new ImageSet("pack1.png", 0, 450, 24, 24, 0, 13, 1);	$$.imageSets["small_explosion_2"] = new ImageSet("pack1.png", 0, 500, 24, 28, 0, 8, 1);	$$.imageSets["enemy0"] = new ImageSet("pack1.png", 0, 550, 48, 46, 0, 1, 1);	$$.imageSets["enemy1"] = new ImageSet("pack1.png", 0, 1000, 48, 46, 0, 1, 1);	$$.imageSets["enemy2"] = new ImageSet("pack1.png", 400, 0, 22, 28, 1, 6, 1);    $$.imageSets["red_fighter"] = new ImageSet("pack1.png", 250, 0, 98, 104, 0, 1, 1);    $$.imageSets["enemy4"] = new ImageSet("liviu_ship_1.png", 0, 0, 60, 60, 0, 1, 1);    $$.imageSets["enemy5"] = new ImageSet("liviu_ship_2.png", 0, 0, 84, 70, 0, 1, 1);	$$.imageSets["bomb0"] = new ImageSet("pack1.png", 0, 600, 14, 14, 0, 3, 1, 'lighter');    $$.imageSets["bomb1"] = new ImageSet("pack1.png", 50, 698, 12, 12, 0, 1, 1, 'lighter');	$$.imageSets["red_star"] = new ImageSet("pack1.png", 0, 750, 18, 18, 0, 3, 1);	$$.imageSets["green_star"] = new ImageSet("pack1.png", 0, 768, 18, 18, 0, 3, 1);	$$.imageSets["blue_star"] = new ImageSet("pack1.png", 0, 786, 18, 18, 0, 3, 1);	$$.imageSets["red_pulse_0"] = new ImageSet("pack1.png", 0, 650, 20, 28, 0, 3, 1);	$$.imageSets["blue_pulse_0"] = new ImageSet("pack1.png", 0, 900, 16, 20, 0, 1, 1);	$$.imageSets["green_pulse_0"] = new ImageSet("pack1.png", 0, 950, 24, 16, 0, 1, 1);}	function loadData($$) {	// Create weapons	$$.weaponDefs = {		"red_laser": {			cooldown: 10,			mp: 6,			dmg: 5,            audioOnFire: "audio/low-bump-2.ogg",			projectiles: {				id: "laser0",				speed: 4,				angle: 0			}		},		"red_pulse": {			cooldown: 18,			mp: 8,			dmg: 1.8,            audioOnFire: "audio/low-bump-2.ogg",			projectiles: {				id: "red_pulse_0",				speed: 3,				angle: 0,				hits: 10			}		},		"green_pulse": {			cooldown: 10,			mp: 6,			dmg: 10,            audioOnFire: "audio/low-bump-2.ogg",			projectiles: {				id: "green_pulse_0",				speed: 5,				angle: 0			}		},		"blue_pulse": {			cooldown: 13,			mp: 6,			dmg: 7,            audioOnFire: "audio/low-bump-2.ogg",			projectiles: {				id: "blue_pulse_0",				speed: 4,				angle: 0			}		}	};										// Create ships	$$.playerShipDefs = {		"player_eos": {			hp: 50,			sp: 80,			mp: 24,			spPerTick: 5,			mpPerTick: 6,            speed: 2,			w: $$.imageSets["player_eos"].destW,			h: $$.imageSets["player_eos"].destH,			weaponDef: $$.weaponDefs["red_laser"],			imageSet: "player_eos",			dmg: 0.5,			spPerTickMultiplier: 0.05,			mpPerTickMultiplier: 0.03,			maxHpMultiplier: 0.5,			maxSpMultiplier: 0.5,			maxMpMultiplier: 0.5,			weaponDmgMultiplier: 0.05,			weaponCooldownMultiplier: 0.05,			speedMultiplier: 0.003		},			"player_perses": {			hp: 60,			sp: 90,			mp: 40,			spPerTick: 6,			mpPerTick: 8,			speed: 2,			w: $$.imageSets["player_eos"].destW,			h: $$.imageSets["player_eos"].destH,			weaponDef: $$.weaponDefs["red_pulse"],			imageSet: "player_eos",            dmg: 0.5,			spPerTickMultiplier: 0.05,			mpPerTickMultiplier: 0.03,			maxHpMultiplier: 0.5,			maxSpMultiplier: 0.5,			maxMpMultiplier: 0.5,			weaponDmgMultiplier: 0.03,			weaponCooldownMultiplier: 0.05,			speedMultiplier: 0.003		},			"player_valkyrie": {			hp: 70,			sp: 100,			mp: 40,			spPerTick: 6,			mpPerTick: 10,			speed: 2.5,			w: $$.imageSets["player_eos"].destW,			h: $$.imageSets["player_eos"].destH,			weaponDef: $$.weaponDefs["green_pulse"],			imageSet: "player_eos",            dmg: 0.5,			spPerTickMultiplier: 0.05,			mpPerTickMultiplier: 0.03,			maxHpMultiplier: 0.5,			maxSpMultiplier: 0.5,			maxMpMultiplier: 1.5,			weaponDmgMultiplier: 0.05,			weaponCooldownMultiplier: 0.05,			speedMultiplier: 0.006		},		"player_athena": {			hp: 120,			sp: 170,			mp: 70,			spPerTick: 10,			mpPerTick: 8,            speed: 2,			w: $$.imageSets["player_eos"].destW,			h: $$.imageSets["player_eos"].destH,			weaponDef: $$.weaponDefs["blue_pulse"],			imageSet: "player_eos",            dmg: 0.5,			spPerTickMultiplier: 0.15,			mpPerTickMultiplier: 0.15,			maxHpMultiplier: 1.5,			maxSpMultiplier: 1.5,			maxMpMultiplier: 0.5,			weaponDmgMultiplier: 0.05,			weaponCooldownMultiplier: 0.05,			speedMultiplier: 0.003		}					}	var e;	$$.entityDefs = {};		// player_*	for (i in $$.playerShipDefs) {			var def = $$.playerShipDefs[i];			e = {};		e[POSITION_COMPONENT] = {			w: def.w,			h: def.h		};						e[RENDER_COMPONENT] = {			imageSet: def.imageSet,			imageNumber: 2		};		e[PLAYER_COMPONENT] = {			mp: def.mp,			weaponCooldown: 0		};			e[HEALTH_COMPONENT] = {			hp: def.hp,			sp: def.sp		};										e[DAMAGE_COMPONENT] = {			dmg: def.dmg		};										e[COLLISION_COMPONENT] = {			group: COLLISION_GROUP_PLAYER		};		e[EXPLOSION_COMPONENT] = {			id: "big_explosion_0"		}		e[PLAYER_SHIP_DEF_COMPONENT] = {			def: def		};	        e[AUDIO_COMPONENT] = {            onHit: "audio/hullhit.ogg",			volume: 0.25,        }		$$.entityDefs[i] = e;			}		// mine0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["mine0"].destW,		h: $$.imageSets["mine0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "mine0",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[HEALTH_COMPONENT] = {		hp: 30	};									e[DAMAGE_COMPONENT] = {		dmg: 5	};									e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 0.6						}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0",		count: 2	}	$$.entityDefs["mine0"] = e;		// mine1	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["mine1"].destW,		h: $$.imageSets["mine1"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "mine1",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[HEALTH_COMPONENT] = {		hp: 60	};									e[DAMAGE_COMPONENT] = {		dmg: 5	};									e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 0.8							}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0",		count: 3	}	$$.entityDefs["mine1"] = e;		// mine2	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["mine2"].destW,		h: $$.imageSets["mine2"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "mine2",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[HEALTH_COMPONENT] = {		hp: 90	};									e[DAMAGE_COMPONENT] = {		dmg: 5	};									e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 1							}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0",		count: 4	}			$$.entityDefs["mine2"] = e;		// laser0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["laser0"].destW,		h: $$.imageSets["laser0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "laser0",		imageNumber: 0,		imageLoop: false	};	e[HEALTH_COMPONENT] = {		hp: 0	};	e[COLLISION_COMPONENT] = {		group: 0	};	e[EXPLOSION_COMPONENT] = {		id: "small_explosion_0"	}			$$.entityDefs["laser0"] = e;				// red_pulse_0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["red_pulse_0"].destW,		h: $$.imageSets["red_pulse_0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "red_pulse_0",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[HEALTH_COMPONENT] = {		hp: 0	};	e[COLLISION_COMPONENT] = {		group: 0,		hits: 3	};	e[EXPLOSION_COMPONENT] = {		id: "small_explosion_0"	}			$$.entityDefs["red_pulse_0"] = e;	// green_pulse_0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["green_pulse_0"].destW,		h: $$.imageSets["green_pulse_0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "green_pulse_0",		imageNumber: 0	};	e[HEALTH_COMPONENT] = {		hp: 0	};	e[COLLISION_COMPONENT] = {		group: 0,		hits: 3	};	e[EXPLOSION_COMPONENT] = {		id: "small_explosion_0"	}			$$.entityDefs["green_pulse_0"] = e;	// blue_pulse_0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["blue_pulse_0"].destW,		h: $$.imageSets["blue_pulse_0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "blue_pulse_0",		imageNumber: 0	};	e[HEALTH_COMPONENT] = {		hp: 0	};	e[COLLISION_COMPONENT] = {		group: 0,		hits: 3	};	e[EXPLOSION_COMPONENT] = {		id: "small_explosion_0"	}			$$.entityDefs["blue_pulse_0"] = e;					// bomb0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["bomb0"].destW,		h: $$.imageSets["bomb0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "bomb0",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[HEALTH_COMPONENT] = {		hp: 0	};	e[COLLISION_COMPONENT] = {		group: 1	};	e[EXPLOSION_COMPONENT] = {		id: "small_explosion_0"	};	    e[AUDIO_COMPONENT] = {   //     onCreate: "audio/enemylaser1.ogg"    };	$$.entityDefs["bomb0"] = e;		// bomb1	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["bomb1"].destW,		h: $$.imageSets["bomb1"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "bomb1",		imageNumber: 0	};	e[HEALTH_COMPONENT] = {		hp: 0	};	e[COLLISION_COMPONENT] = {		group: 1	};	e[EXPLOSION_COMPONENT] = {		id: "small_explosion_1",		count: 3	};      e[AUDIO_COMPONENT] = {   //     onCreate: "audio/enemylaser2.ogg"    };			$$.entityDefs["bomb1"] = e;					// diamond0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["diamond0"].destW,		h: $$.imageSets["diamond0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "diamond0",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[COLLISION_COMPONENT] = {		group: COLLISION_GROUP_BONUSES	};	e[BONUS_COMPONENT] = {		statBonus: STAT_BONUS_RED,		statBonusValue: 1	}	$$.entityDefs["diamond0"] = e;			// diamond1	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["diamond1"].destW,		h: $$.imageSets["diamond1"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "diamond1",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[COLLISION_COMPONENT] = {		group: COLLISION_GROUP_BONUSES	};	e[BONUS_COMPONENT] = {		statBonus: STAT_BONUS_GREEN,		statBonusValue: 1	}	$$.entityDefs["diamond1"] = e;			// diamond2	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["diamond2"].destW,		h: $$.imageSets["diamond2"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "diamond2",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	e[COLLISION_COMPONENT] = {		group: COLLISION_GROUP_BONUSES	};	e[BONUS_COMPONENT] = {		statBonus: STAT_BONUS_BLUE,		statBonusValue: 1	}	$$.entityDefs["diamond2"] = e;		// big_explosion_0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["big_explosion_0"].destW,		h: $$.imageSets["big_explosion_0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "big_explosion_0",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 2,		imageLoopStep: 0,		imageKillAfterLoop: true	};    e[AUDIO_COMPONENT] = {        onCreate: "audio/exp.ogg",		volume: 0.25,    }	$$.entityDefs["big_explosion_0"] = e;		// small_explosion_0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["small_explosion_0"].destW,		h: $$.imageSets["small_explosion_0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "small_explosion_0",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 4,		imageLoopStep: 0,		imageKillAfterLoop: true	};    e[AUDIO_COMPONENT] = {        onCreate: "audio/hit.ogg",		volume: 0.25,    }	$$.entityDefs["small_explosion_0"] = e;		// small_explosion_1	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["small_explosion_1"].destW,		h: $$.imageSets["small_explosion_1"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "small_explosion_1",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 2,		imageLoopStep: 0,		imageKillAfterLoop: true	};    e[AUDIO_COMPONENT] = {        onCreate: "audio/low-bump-2.ogg",		volume: 0.25,    }	$$.entityDefs["small_explosion_1"] = e;		// small_explosion_2	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["small_explosion_2"].destW,		h: $$.imageSets["small_explosion_2"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "small_explosion_2",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 4,		imageLoopStep: 0,		imageKillAfterLoop: true	};    e[AUDIO_COMPONENT] = {        onCreate: "audio/low-bump-2.ogg",		volume: 0.25,    }	$$.entityDefs["small_explosion_2"] = e;		// enemy0	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["enemy0"].destW,		h: $$.imageSets["enemy0"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "enemy0",		imageNumber: 0	};	e[HEALTH_COMPONENT] = {		hp: 20	};	e[DAMAGE_COMPONENT] = {		dmg: 5	};	e[WEAPON_COMPONENT] = [{		weapon: "bomb0",		dmg: 15,		speed: 2,		cooldownSteps: 60,		cooldownStep: 0	}];	e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 0.6	}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0",		count: 2	}			$$.entityDefs["enemy0"] = e;		// enemy1	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["enemy1"].destW,		h: $$.imageSets["enemy1"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "enemy1",		imageNumber: 0	};	e[HEALTH_COMPONENT] = {		hp: 20	};	e[DAMAGE_COMPONENT] = {		dmg: 5	};	e[WEAPON_COMPONENT] = [{		weapon: "bomb0",		dmg: 15,		speed: 3,		cooldownSteps: 10,		cooldownStep: 0    }];	e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 0.9							}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0",		count: 3	}			$$.entityDefs["enemy1"] = e;		// enemy2	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["enemy2"].destW,		h: $$.imageSets["enemy2"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "enemy2",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 4,		imageLoopStep: 0,		imageLoopJump: true	};	e[HEALTH_COMPONENT] = {		hp: 10	};	e[DAMAGE_COMPONENT] = {		dmg: 5	};	e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 0.1							}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0"	}			$$.entityDefs["enemy2"] = e;		    // enemy3    e = {};    e[POSITION_COMPONENT] = {        w: $$.imageSets["red_fighter"].destW,        h: $$.imageSets["red_fighter"].destH    };                  e[RENDER_COMPONENT] = {        imageSet: "red_fighter",        imageNumber: 0    };    e[HEALTH_COMPONENT] = {        hp: 50    };    e[DAMAGE_COMPONENT] = {        dmg: 5    };    e[WEAPON_COMPONENT] = [{        weapon: "bomb1",        dmg: 50,        speed: 1,        cooldownSteps: 70,        cooldownStep: 0,        moveX: -1,        moveY: -1    }, {        weapon: "bomb1",        dmg: 50,        speed: 1,        cooldownSteps: 70,        cooldownStep: 0,        moveX: -1,        moveY: +1    }, {        weapon: "bomb1",        dmg: 50,        speed: 1,        cooldownSteps: 70,        cooldownStep: 0,        moveX: 1,        moveY: -1    }, {        weapon: "bomb1",        dmg: 50,        speed: 1,        cooldownSteps: 70,        cooldownStep: 0,        moveX: 1,        moveY: +1    }];    e[COLLISION_COMPONENT] = {        group: 1    };    e[BONUS_COMPONENT] = {        giveDiamondChance: 0.9                      }    e[EXPLOSION_COMPONENT] = {        id: "big_explosion_0",        count: 7    }           $$.entityDefs["enemy3"] = e;        // enemy4    e = {};    e[POSITION_COMPONENT] = {        w: $$.imageSets["enemy4"].destW,        h: $$.imageSets["enemy4"].destH    };                  e[RENDER_COMPONENT] = {        imageSet: "enemy4",        imageNumber: 0    };    e[HEALTH_COMPONENT] = {        hp: 150    };    e[DAMAGE_COMPONENT] = {        dmg: 5    };    e[WEAPON_COMPONENT] = [{        weapon: "bomb0",        dmg: 20,        speed: 1,        cooldownSteps: 20,        cooldownStep: 0,        moveX: -0.1,        moveY: +5    }, {        weapon: "bomb0",        dmg: 20,        speed: 1,        cooldownSteps: 20,        cooldownStep: 0,        moveX: +0.1,        moveY: +5    }];    e[COLLISION_COMPONENT] = {        group: 1    };    e[BONUS_COMPONENT] = {        giveDiamondChance: 1              }    e[EXPLOSION_COMPONENT] = {        id: "big_explosion_0",        count: 10    }           $$.entityDefs["enemy4"] = e;        // enemy5    e = {};    e[POSITION_COMPONENT] = {        w: $$.imageSets["enemy5"].destW,        h: $$.imageSets["enemy5"].destH    };                  e[RENDER_COMPONENT] = {        imageSet: "enemy5",        imageNumber: 0    };    e[HEALTH_COMPONENT] = {        hp: 200    };    e[DAMAGE_COMPONENT] = {        dmg: 5    };    e[WEAPON_COMPONENT] = [{        weapon: "diamond0",        dmg: 0,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: 0,        moveY: -0.1    }, {        weapon: "bomb0",        dmg: 20,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: -1,        moveY: -1    }, {        weapon: "bomb0",        dmg: 20,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: +1,        moveY: -1    }, {        weapon: "bomb0",        dmg: 20,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: -1,        moveY: +1    }, {        weapon: "bomb0",        dmg: 20,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: +1,        moveY: +1    }, {        weapon: "bomb1",        dmg: 40,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: +1,        moveY: 0    }, {        weapon: "bomb1",        dmg: 40,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: -1,        moveY: 0    }, {        weapon: "bomb1",        dmg: 40,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: 0,        moveY: +1    }, {        weapon: "bomb1",        dmg: 40,        speed: 0.5,        cooldownSteps: 20,        cooldownStep: 0,        moveX: 0,        moveY: -1    }];    e[COLLISION_COMPONENT] = {        group: 1    };    e[BONUS_COMPONENT] = {        giveDiamondChance: 1    }    e[EXPLOSION_COMPONENT] = {        id: "big_explosion_0",        count: 15    }           $$.entityDefs["enemy5"] = e;	// enemy6	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["enemy5"].destW,		h: $$.imageSets["enemy5"].destH	};	e[RENDER_COMPONENT] = {		imageSet: "enemy5",		imageNumber: 0	};	e[HEALTH_COMPONENT] = {		hp: 200	};	e[DAMAGE_COMPONENT] = {		dmg: 5	};	e[WEAPON_COMPONENT] = [{		weapon: "enemy0",		dmg: 0,		speed: 0.5,		cooldownSteps: 20,		cooldownStep: 0,		moveX: 0,		moveY: -1,	}, {		weapon: "diamond2",		dmg: 0,		speed: 0.5,		cooldownSteps: 20,		cooldownStep: 0,		moveX: 1,		moveY: -1,	}, {		weapon: "diamond2",		dmg: 0,		speed: 0.5,		cooldownSteps: 20,		cooldownStep: 0,		moveX: -1,		moveY: -1,	}];	e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 1	}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0",		count: 20	}	$$.entityDefs["enemy6"] = e;	// enemy6	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["enemy5"].destW,		h: $$.imageSets["enemy5"].destH	};	e[RENDER_COMPONENT] = {		imageSet: "enemy5",		imageNumber: 0	};	e[HEALTH_COMPONENT] = {		hp: 2000	};	e[DAMAGE_COMPONENT] = {		dmg: 5	};	e[WEAPON_COMPONENT] = [{		weapon: "enemy2",		dmg: 0,		speed: 1,		cooldownSteps: 1000,		cooldownStep: 0,		moveX: -1,		moveY: -1,	}, {		weapon: "enemy2",		dmg: 0,		speed:1,		cooldownSteps: 1000,		cooldownStep: 0,		moveX: 1,		moveY: -1,	}, {		weapon: "enemy2",		dmg: 0,		speed:1,		cooldownSteps: 1000,		cooldownStep: 0,	}, {		weapon: "diamond2",		dmg: 0,		speed: 0.5,		cooldownSteps: 2,		cooldownStep: 0,		moveX: 1,		moveY: -1,	}, {		weapon: "diamond2",		dmg: 0,		speed: 0.5,		cooldownSteps: 2,		cooldownStep: 0,		moveX: -1,		moveY: -1,	}, {		weapon: "diamond1",		dmg: 0,		speed: 0.5,		cooldownSteps: 10,		cooldownStep: 0,		moveX: 1,		moveY: 1,	}, {		weapon: "diamond1",		dmg: 0,		speed: 0.5,		cooldownSteps: 10,		cooldownStep: 0,		moveX: -1,		moveY: 1,	}];	e[COLLISION_COMPONENT] = {		group: 1	};	e[BONUS_COMPONENT] = {		giveDiamondChance: 1	}	e[EXPLOSION_COMPONENT] = {		id: "big_explosion_0",		count: 20	}	$$.entityDefs["enemy7"] = e;		// red_star	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["red_star"].destW,		h: $$.imageSets["red_star"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "red_star",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	$$.entityDefs["red_star"] = e;		// green_star	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["green_star"].destW,		h: $$.imageSets["green_star"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "green_star",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	$$.entityDefs["green_star"] = e;		// blue_star	e = {};	e[POSITION_COMPONENT] = {		w: $$.imageSets["blue_star"].destW,		h: $$.imageSets["blue_star"].destH	};					e[RENDER_COMPONENT] = {		imageSet: "blue_star",		imageNumber: 0,		imageLoop: true,		imageLoopDirection: 0,		imageLoopSteps: 10,		imageLoopStep: 0	};	$$.entityDefs["blue_star"] = e;	}