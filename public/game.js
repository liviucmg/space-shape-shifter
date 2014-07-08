var POSITION_COMPONENT = 0,
	MOVE_COMPONENT = 1,
	RENDER_COMPONENT = 2,
	PLAYER_COMPONENT = 3,
	PLAYER_SHIP_DEF_COMPONENT = 4,
	COLLISION_COMPONENT = 5,
	HEALTH_COMPONENT = 6,
	DAMAGE_COMPONENT = 7,
	BONUS_COMPONENT = 8,
	EXPLOSION_COMPONENT = 9,
	WEAPON_COMPONENT = 10,
    AUDIO_COMPONENT = 11;

var COLLISION_GROUP_PLAYER_PROJECTILES = 0,
	COLLISION_GROUP_ENEMIES = 1,
	COLLISION_GROUP_BONUSES = 2,
	COLLISION_GROUP_PLAYER = 3;

var STAT_BONUS_RED = 0,
	STAT_BONUS_GREEN = 1,
	STAT_BONUS_BLUE = 2;
	
var MOVE_AXIS = 0,
	MOVE_SPIROGRAPH = 1;

function getPointsOnSpirograph(R, r, O, t) {

	var x = (R - r) * Math.cos(t) + O * Math.cos(((R - r) / r) * t);
	var y = (R - r) * Math.sin(t) - O * Math.sin(((R - r) / r) * t);
	return [x, y];
	
}

function clone(obj) {

	var newObj = (obj instanceof Array) ? [] : {};
	for (i in obj) {
	
		if (obj[i] && typeof obj[i] == "object") {
			newObj[i] = clone(obj[i]);
		}
		else {
			newObj[i] = obj[i];
		}
	}
	return newObj;
	
};

function extend(obj1, obj2) {

	var newObj = (obj1 instanceof Array) ? [] : {};
	newObj = clone(obj1);
	for (i in obj2) {
	
		if (obj2[i] && typeof obj2[i] == "object") {
			extend(newObj[i], obj2[i]);
		}
		else {
			newObj[i] = obj2[i];
		}
	}
	return newObj;
	
};

function Position(options) {

	this.x = options.x;
	this.y = options.y;
	this.w = options.w;
	this.h = options.h;
	this.top = options.top;
	this.right = options.right;
	this.bottom = options.bottom;
	this.left = options.left;
	
	Position.prototype.setCenter = function(x, y) {
	
		this.x = x;
		this.y = y;
		this.top = this.y - this.h / 2;					
		this.right = this.x + this.w / 2;
		this.bottom = this.y + this.h / 2;
		this.left = this.x - this.w / 2;
	
	}

}

function Game(options) {

	var $$ = this,
		log = new Log(),
		keyDown = new Array(),
		entities = {},
		components = {},
		dropEntityQueue = new Array(),
		nextEntityId = 0,
		nextFpsTime,
		currentFps,
		previousFps;
	
	$$.collisionGroups = new Array();
		
	$$.divMp = document.getElementById("game_bars_mp");
	$$.divSp = document.getElementById("game_bars_sp");
	$$.divHp = document.getElementById("game_bars_hp");
	$$.divScore = document.getElementById("game_score");
	$$.divShipSpeed = document.getElementById("game_shipStats_speed");
	$$.divShipShieldRecharge = document.getElementById("game_shipStats_shieldRecharge");
	$$.divShipManaRecharge = document.getElementById("game_shipStats_manaRecharge");
	$$.divWeaponDamage = document.getElementById("game_shipStats_weaponDamage");
	$$.divWeaponCooldown = document.getElementById("game_shipStats_weaponCooldown");
	
	$$.divMaxMp = document.getElementById("game_shipStats_maxMp");
	$$.divMaxHp = document.getElementById("game_shipStats_maxSp");
	$$.divMaxSp = document.getElementById("game_shipStats_maxHp");
	
	$$.divRedDiamonds = document.getElementById("game_bonusStats_redDiamonds");
	$$.divGreenDiamonds = document.getElementById("game_bonusStats_greenDiamonds");
	$$.divBlueDiamonds = document.getElementById("game_bonusStats_blueDiamonds");
	
	$$.playerShipBorder = 4;
		
	this.options = options;
	this.canvas = document.getElementById(options.canvasId);
	this.canvasContext = this.canvas.getContext("2d");
	// TODO
	//this.canvasContext.mozImageSmoothingEnabled = false;
	
	$$.screenWidth = this.canvas.width;
	$$.screenHeight = this.canvas.height;
	gameActive = false;
					
	loadImages($$);
	attachEvents();
	
	loadData($$);
	
	$$.randomEnemies = [{
		aDiff: 0, // minutes
		bDiff: 6, // minutes
		aSteps: 3, // seconds
		bSteps: 0.2, // seconds
		f: function() {createRandomMine(0);}
	}, {
		aDiff: 1 / 60 * 6,
		bDiff: 8,
		aSteps: 6,
		bSteps: 0.5,
		f: function() {createRandomMine(1);}
	}, {
		aDiff: 1 / 60 * 30,
		bDiff: 10,
		aSteps: 12,
		bSteps: 0.5,
		f: function() {createRandomMine(2);}
	}, {
		aDiff: 1 / 60 * 10,
		bDiff: 12,
		aSteps: 8,
		bSteps: 1,
		f: function() {createRandomEnemy(0, 60, 1);}
	}, {
		aDiff: 1 / 60 * 20,
		bDiff: 12,
		aSteps: 10,
		bSteps: 2,
		f: function() {createRandomEnemy(1, 30, 1);}
	}, {
		aDiff: 4,
		bDiff: 12,
		aSteps: 20,
		bSteps: 2,
		f: function() {createRandomEnemy(1, 20, 2);}
	}, {
		aDiff: 1 / 60 * 40,
		bDiff: 10,
		aSteps: 20,
		bSteps: 2,
		f: function() {createRandomEnemy(1, 10, 1);}
	}, {
		aDiff: 1,
		bDiff: 10,
		aSteps: 20,
		bSteps: 10,
		f: function() {createRandomEnemy(1, 5, 4);}
	}, {
		aDiff: 1.1,
		bDiff: 10,
		aSteps: 10,
		bSteps: 1,
		f: function() {createRandomEnemy(2, 30, 3);}
	}, {
		aDiff: 0,
		bDiff: 1 / 60 * 10,
		aSteps: 0.05,
		bSteps: 0.4,
		infinite: false,
		f: function() {createRandomDiamond(Math.floor(Math.random() * 3));}
	}, {
		aDiff: 1 / 60 * 15,
		bDiff: 1 / 60 * 25,
		aSteps: 0.05,
		bSteps: 1.1,
		infinite: false,
		f: function() {createRandomDiamond(2);}
	}, {
		aDiff: 1 / 60 * 35,
		bDiff: 1 / 60 * 45,
		aSteps: 0.05,
		bSteps: 1.1,
		infinite: false,
		f: function() {createRandomDiamond(1);}
	}, {
		aDiff: 1 / 60 * 55,
		bDiff: 1 / 60 * 65,
		aSteps: 0.05,
		bSteps: 1.1,
		infinite: false,
		f: function() {createRandomDiamond(0);}
	}, {
		aDiff: 1 / 60 * 5,
		bDiff: 12,
		aSteps: 2,
		bSteps: 10,
		f: function() {createRandomDiamond(Math.floor(Math.random() * 3));}
	}, {
		aDiff: 1 / 60 * 60,
		bDiff: 6,
		aSteps: 30,
		bSteps: 7,
		f: function() {createRandomEnemy(3, null, 1.5);}
	}, {
        aDiff: 0.5,
        bDiff: 10,
        aSteps: 30,
        bSteps: 5,
        f: function() {createRandomEnemy(4, 50, 1);}
    }, {
        aDiff: 1,
        bDiff: 15,
        aSteps: 70,
        bSteps: 5,
        f: function() {createRandomEnemy(5, 50, 1);}
    }];
	for (i in $$.randomEnemies) {
		$$.randomEnemies[i].aDiff *= 60;
		$$.randomEnemies[i].bDiff *= 60;
		$$.randomEnemies[i].aSteps *= 60;
		$$.randomEnemies[i].bSteps *= 60;
		$$.randomEnemies[i].step = $$.randomEnemies[i].aSteps;
		if (typeof $$.randomEnemies[i].infinite === 'undefined') {
			$$.randomEnemies[i].infinite = true;
		}
	}
	
	function createRandomDiamond(number) {
		
		x = Math.floor(Math.random() * $$.screenWidth);
		y = -$$.imageSets["diamond" + number].destH;
		speed = Math.random() * 2 + 1;
		
		var o = {};
		o[POSITION_COMPONENT] = {
			x: x,
			y: y
		}
		o[MOVE_COMPONENT] = {
			x: 0,
			y: speed,
			mode: 0
		}
		createGenericEntity("diamond" + number, o);
		
	}
	
	function createRandomMine(mineNumber) {
	
		x = Math.floor(Math.random() * $$.screenWidth);
		y = -$$.imageSets["mine" + mineNumber].destH;
		speed = Math.random() * 1 + 1;
		
		var o = {};
		o[POSITION_COMPONENT] = {
			x: x,
			y: y
		};
		o[MOVE_COMPONENT] = {
			x: 0,
			y: speed,
			mode: 0
		};						
		createGenericEntity("mine" + mineNumber, o);
		
	}
	
	function createRandomEnemy(number, cooldownSteps, minSpeed) {
		
		var entityId = "enemy" + number;
		
		x = Math.floor(Math.random() * $$.screenWidth);
		y = -$$.imageSets[$$.entityDefs[entityId][RENDER_COMPONENT].imageSet].destH;
		speed = Math.random() * 2 + minSpeed;
		
		var o = {};
		o[POSITION_COMPONENT] = {
			x: x,
			y: y
		}
		o[MOVE_COMPONENT] = {
			x: 0,
			y: speed,
			mode: 0
		}
		var id = createGenericEntity("enemy" + number, o);
        if (cooldownSteps !== null) {
            for (var i = 0; i < components[WEAPON_COMPONENT][id].length; i++) {            
                components[WEAPON_COMPONENT][id][i].cooldownSteps = cooldownSteps;
            }
        }
	}
	
	function revertMetamorphosis() {
		
		if ($$.playerMetamorphosis == false) {
			return false;
		}
		
		dropEntity($$.playerShipStars[0]);
		$$.playerShipStars = [];
		
		var pos = components[POSITION_COMPONENT][playerId];
		
		var o = {};
		o[POSITION_COMPONENT] = {
			x: $$.screenWidth / 2,
			y: $$.screenHeight / 2
		}
		
		dropEntity(playerId);
		createPlayer("player_eos", pos.x, pos.y);
		
		$$.playerMetamorphosis = false;
	
	}
	
	function metamorphosis(ship) {
	
		//if ($$.playerMetamorphosis) {
		if ($$.playerMetamorphosis == true && $$.playerMetamorphosisShip == ship) {
			return false;
		}
	
		var minDiamonds = 3;
		var star;
		var diamonds;
	
		switch (ship) {
		
			case "player_perses":
				diamonds = STAT_BONUS_RED;
				star = "red_star";
				break;
				
			case "player_valkyrie":
				diamonds = STAT_BONUS_GREEN;
				star = "green_star";
				break;
				
			case "player_athena":
				diamonds = STAT_BONUS_BLUE;
				star = "blue_star";
				break;
				
		}
		
		if ($$.playerStatBonuses[diamonds] < minDiamonds) {
			log.add("Insufficient diamonds.");
			return false;
		}
		
		if ($$.playerMetamorphosis == true) {
			revertMetamorphosis();
		}
		
		$$.playerStatBonuses[diamonds] -= minDiamonds;
		
		var pos = components[POSITION_COMPONENT][playerId];
		
		var o = {};
		o[POSITION_COMPONENT] = {
			x: $$.screenWidth / 2,
			y: $$.screenHeight / 2
		}
		
		dropEntity(playerId);
		createPlayer(ship, pos.x, pos.y);
		
		var o = {};
		o[MOVE_COMPONENT] = {
			mode: MOVE_SPIROGRAPH,
			R: 27,
			r: 9,
			O: 20,
			t: 0,
			tStep: 0.05,
			x: pos.x,
			y: pos.y
		};
		$$.playerShipStars.push(createGenericEntity(star, o));
			
		$$.playerMetamorphosis = true;
		$$.playerMetamorphosisSteps = 0;
		$$.playerMetamorphosisDiamonds = diamonds;
		$$.playerMetamorphosisShip = ship;
	
	}
	
	this.start = function() {
	
		$$.playerAlive = true;
		nextFpsTime = 0;
		currentFps = 0;
		previousFps = 0;
	
		this.tickSteps = 30;
		this.tickStep = 0;
		
		this.gameActive = true;
		setInterval(step, 1000 / 60);
		
		$$.difficulty = 0;
		
		components[POSITION_COMPONENT] = new Array();
		components[MOVE_COMPONENT] = new Array();
		components[RENDER_COMPONENT] = new Array();
		components[PLAYER_COMPONENT] = new Array();
		components[PLAYER_SHIP_DEF_COMPONENT] = new Array();
		components[COLLISION_COMPONENT] = new Array();
		components[HEALTH_COMPONENT] = new Array();
		components[DAMAGE_COMPONENT] = new Array();
		components[BONUS_COMPONENT] = new Array();
		components[EXPLOSION_COMPONENT] = new Array();
        components[WEAPON_COMPONENT] = new Array();
        components[AUDIO_COMPONENT] = new Array();
		
		$$.collisionGroups[COLLISION_GROUP_PLAYER_PROJECTILES] = new Array(); // Player projectiles
		$$.collisionGroups[COLLISION_GROUP_ENEMIES] = new Array(); // Enemy ships and projectiles
		$$.collisionGroups[COLLISION_GROUP_BONUSES] = new Array(); // Bonuses
		$$.collisionGroups[COLLISION_GROUP_PLAYER] = new Array(); // Player
		
			
		$$.playerScore = 0;
		$$.playerStatBonuses = {};
		$$.playerStatBonuses[STAT_BONUS_RED] = 20;//60;
		$$.playerStatBonuses[STAT_BONUS_GREEN] = 20;//60;
		$$.playerStatBonuses[STAT_BONUS_BLUE] = 20;//60;
		
		$$.playerShipStars = new Array();		
		$$.playerMetamorphosis = false;
		
		createPlayer("player_eos", $$.screenWidth / 2, $$.screenHeight / 2);
        
		var backgroundMusic = [
			'Eric_Skiff_-_04_-_All_of_Us.ogg',
			'Eric_Skiff_-_07_-_Were_the_Resistors.ogg'
		];
		
		var sound = new Howl({
			urls: ['assets/audio/' + backgroundMusic[Math.floor(Math.random() * backgroundMusic.length)]],
			volume: 0.75,
			loop: true
		}).play();
	}
	
	function getNextAvailableId() {
	
		id = nextEntityId;
		nextEntityId++;
		entities[id] = id;					
		return id;
	
	}
	
	function createPlayer(ship, x, y) {
	
		var o = {};
		o[POSITION_COMPONENT] = {
			x: x,
			y: y
		}			
		playerId = createGenericEntity(ship, o);
		updatePlayerStatBonuses();
		components[HEALTH_COMPONENT][playerId].sp = components[PLAYER_COMPONENT][playerId].maxSp;
		components[HEALTH_COMPONENT][playerId].hp = components[PLAYER_COMPONENT][playerId].maxHp;
		components[PLAYER_COMPONENT][playerId].mp = components[PLAYER_COMPONENT][playerId].maxMp;
	
	}
	
	function createGenericEntity(defId, options) {
	
		def = $$.entityDefs[defId];
		id = getNextAvailableId();
		
		for (i in def) {
			components[i][id] = clone(def[i]);
		}
		
		for (i in options) {
		
			components[i][id] = extend(components[i][id], options[i]);
			
		}
		
		var pos = components[POSITION_COMPONENT][id];
		if (pos != undefined) {
		
			setPositionCenter(pos, pos.x, pos.y);
		
		}
		
		if (components[COLLISION_COMPONENT][id] != undefined) {
			addEntityToCollisionQueue({
				id: id,
				group: components[COLLISION_COMPONENT][id].group
			});
		}
		
		// Play audio        
        if (components[AUDIO_COMPONENT][id] != undefined) {
            if (components[AUDIO_COMPONENT][id].onCreate != undefined) {    
				var sound = new Howl({
					urls: ["assets/" + components[AUDIO_COMPONENT][id].onCreate]
				}).play();
            }
        }
		
		return id;
		
	}

	function updatePlayerStatBonuses() {
	
		player = components[PLAYER_COMPONENT][playerId];
		playerShipDef = components[PLAYER_SHIP_DEF_COMPONENT][playerId];		
		
		// Green
		player.spPerTickBonus = playerShipDef.def.spPerTickMultiplier * $$.playerStatBonuses[STAT_BONUS_BLUE];
		player.spPerTick = playerShipDef.def.spPerTick + player.spPerTickBonus;
		
		player.maxHpBonus = playerShipDef.def.maxHpMultiplier * $$.playerStatBonuses[STAT_BONUS_BLUE];
		player.maxHp = playerShipDef.def.hp + player.maxHpBonus;
		
		player.maxSpBonus = playerShipDef.def.maxSpMultiplier * $$.playerStatBonuses[STAT_BONUS_BLUE];
		player.maxSp = playerShipDef.def.sp + player.maxSpBonus;
		
		// Blue
		player.mpPerTickBonus = playerShipDef.def.mpPerTickMultiplier * $$.playerStatBonuses[STAT_BONUS_GREEN];
		player.mpPerTick = playerShipDef.def.mpPerTick + player.mpPerTickBonus;
		
		player.speedBonus = Math.min(4 - playerShipDef.def.speed, playerShipDef.def.speedMultiplier * $$.playerStatBonuses[STAT_BONUS_GREEN]);
		player.speed = playerShipDef.def.speed + player.speedBonus;
		
		player.maxMpBonus = playerShipDef.def.maxMpMultiplier * $$.playerStatBonuses[STAT_BONUS_GREEN];
		player.maxMp = playerShipDef.def.mp + player.maxMpBonus;
		
		// Red
		player.weaponDmgBonus = playerShipDef.def.weaponDmgMultiplier * $$.playerStatBonuses[STAT_BONUS_RED];
		
		player.weaponCooldownBonus = playerShipDef.def.weaponCooldownMultiplier * $$.playerStatBonuses[STAT_BONUS_RED];
	
	}
	
	function step() {
	
		if ($$.playerAlive == false) {
			return false;
		}
	
		// Metamorphosis steps!
		if ($$.playerMetamorphosis == true) {
		
			$$.playerMetamorphosisSteps++;
			if ($$.playerMetamorphosisSteps > 60 * 5) {
				$$.playerStatBonuses[$$.playerMetamorphosisDiamonds]--;
				if ($$.playerStatBonuses[$$.playerMetamorphosisDiamonds] <= 0) {
					$$.playerStatBonuses[$$.playerMetamorphosisDiamonds] = 0;
					revertMetamorphosis();
				}
				$$.playerMetamorphosisSteps = 0;
			}
		
		}
	
		// Difficulty!
		$$.difficulty += 1/60;
	
		// Player
		var player = components[PLAYER_COMPONENT][playerId];
		var playerShipDef = components[PLAYER_SHIP_DEF_COMPONENT][playerId];
		var health = components[HEALTH_COMPONENT][playerId];
		player.weaponCooldown = Math.max(0, player.weaponCooldown - 1);
		
		$$.tickStep++;
		if ($$.tickStep == $$.tickSteps) {
			
			$$.tickStep = 0;
			player.mp = Math.min(player.maxMp, player.mp + player.mpPerTick);
			health.sp = Math.min(player.maxSp, health.sp + player.spPerTick);
	
		}
		
		// Collision detection
		for (cd0 in $$.collisionGroups[COLLISION_GROUP_PLAYER]) {	
		
			for (cd1 in $$.collisionGroups[COLLISION_GROUP_ENEMIES]) {	
			
				if (boundingBoxCollision(
					components[POSITION_COMPONENT][cd0],
					components[POSITION_COMPONENT][cd1]
				)) {
					
					var dead0 = giveDamage(cd0, components[DAMAGE_COMPONENT][cd1]),
						dead1 = giveDamage(cd1, components[DAMAGE_COMPONENT][cd0]);
					
					if (dead0 == false && dead1 == false) {
						
						var pos0 = components[POSITION_COMPONENT][cd0];
						var pos1 = components[POSITION_COMPONENT][cd1];
					
						var wRatio = 1 / (1 + pos0.w / pos1.w);
						var hRatio = 1 / (1 + pos0.h / pos1.h);
					
						var o = {};
						o[POSITION_COMPONENT] = {
							x: pos0.x * (1 - wRatio) + pos1.x * wRatio + ((Math.random() - 0.5) * (pos0.w + pos1.w) / 8),
							y: pos0.y * (1 - hRatio) + pos1.y * hRatio + ((Math.random() - 0.5) * (pos0.h + pos1.h) / 8)
						}						
						createGenericEntity("small_explosion_2", o);
					
					}
					
					//log.add("Coll: " + cd0 + " - " + cd1);					
                    
                    // Play audio        
                    if (components[AUDIO_COMPONENT][cd0] != undefined) {
                        if (components[AUDIO_COMPONENT][cd0].onHit != undefined) { 
							var sound = new Howl({
								urls: ["assets/" + components[AUDIO_COMPONENT][cd0].onHit]
							}).play();
                        }
                    }
                    if (components[AUDIO_COMPONENT][cd1] != undefined) {
                        if (components[AUDIO_COMPONENT][cd1].onHit != undefined) {
							var sound = new Howl({
								urls: ["assets/" + components[AUDIO_COMPONENT][cd1].onHit]
							}).play();
                        }
                    }
                    
					
				}
				
			}
		
			for (cd1 in $$.collisionGroups[COLLISION_GROUP_BONUSES]) {
			
				if (boundingBoxCollision(
					components[POSITION_COMPONENT][cd0],
					components[POSITION_COMPONENT][cd1]
				)) {
					
					bonus = components[BONUS_COMPONENT][cd1];
					if (bonus != undefined) {
					
						if (bonus.score != undefined) {
						
							$$.playerScore += bonus.score;
						
						}
					
						if (bonus.statBonus != undefined) {
							$$.playerStatBonuses[bonus.statBonus] += bonus.statBonusValue;
                            
							var sound = new Howl({
								urls: ["assets/audio/coin" + Math.floor(Math.random() * 5 + 1) + ".ogg"],
								volume: 0.4
							}).play();
                            
							updatePlayerStatBonuses();
						}
					
					}
					
					killEntity(cd1);
					
				}	
				
			}	
			
		}
		
		for (cd0 in $$.collisionGroups[COLLISION_GROUP_PLAYER_PROJECTILES]) {	
		
			for (cd1 in $$.collisionGroups[COLLISION_GROUP_ENEMIES]) {
			
				if (boundingBoxCollision(
					components[POSITION_COMPONENT][cd0],
					components[POSITION_COMPONENT][cd1]
				)) {
					
					giveDamage(cd0, components[DAMAGE_COMPONENT][cd1]),
					giveDamage(cd1, components[DAMAGE_COMPONENT][cd0]);			
					
				}	
				
			}		
			
		}
		
		
		// Create random enemies
		for (i in $$.randomEnemies) {
		
			var r = $$.randomEnemies[i];
			
			if (
				$$.difficulty >= r.aDiff &&
				(r.infinite == true || $$.difficulty <= r.bDiff)
			) {
			
				var x = (Math.min($$.difficulty, r.bDiff) - r.aDiff) / (r.bDiff - r.aDiff);
				var steps = r.aSteps - x * (r.aSteps - r.bSteps);
								
				r.step++;
				if (r.step >= steps) {
					r.step = 0;
					r.f();
				
				}
			
			}
		
		}
	
		playerShipHasMoved = false;
	
		pos = components[POSITION_COMPONENT][playerId];
		playerShipDef = components[PLAYER_SHIP_DEF_COMPONENT][playerId];
	
		// Left arrow
		if (keyDown[37]) {
			pos.x -= player.speed;
			playerShipHasMoved = true;
		}
		
		// Right arrow
		if (keyDown[39]) {
			pos.x += player.speed;
			playerShipHasMoved = true;
		}
	
		// Up arrow
		if (keyDown[38]) {
			pos.y -= player.speed;
			playerShipHasMoved = true;
		}
	
		// Down arrow
		if (keyDown[40]) {
			pos.y += player.speed;
			playerShipHasMoved = true;
		}
		
		if (playerShipHasMoved) {
		
			var top    = $$.playerShipBorder + pos.h / 2,
				right  = $$.screenWidth - $$.playerShipBorder - pos.w / 2,
				bottom = $$.screenHeight - $$.playerShipBorder - pos.h / 2,
				left   = $$.playerShipBorder + pos.w / 2;
			
			if (pos.x < left) {
				pos.x = left;
			}
			
			if (pos.x > right) {
				pos.x = right;
			}
			
			if (pos.y < top) {
				pos.y = top;
			}
			
			if (pos.y > bottom) {
				pos.y = bottom;
			}
		
			setPositionCenter(pos, pos.x, pos.y);
			
			for (i in $$.playerShipStars) {
			
				var move = components[MOVE_COMPONENT][$$.playerShipStars[i]];
				move.x = pos.x;
				move.y = pos.y;
				
			}
		
		}
	
		// Space
		if (keyDown[32]) {
			fire();
		}
	
		// Q
		if (keyDown[81]) {
			revertMetamorphosis();
			keyDown[81] = false;
		}
		
		// W
		if (keyDown[87]) {
			metamorphosis("player_perses");
			keyDown[87] = false;
		}
		
		// E
		if (keyDown[69]) {
			metamorphosis("player_valkyrie");
			keyDown[69] = false;
		}
		
		// R
		if (keyDown[82]) {
			metamorphosis("player_athena");
			keyDown[82] = false;
		}
		
		for (e in components[MOVE_COMPONENT]) {
		
			var move = components[MOVE_COMPONENT][e];
			var pos = components[POSITION_COMPONENT][e];
			
			switch (move.mode) {
			
				case MOVE_AXIS:
					setPositionCenter(pos, pos.x + move.x, pos.y + move.y);
					if ((move.x < 0 && pos.right <= 0) ||
						(move.y < 0 && pos.bottom <= 0) ||
						(move.x > 0 && pos.left >= $$.screenWidth) ||
						(move.y > 0 && pos.top >= $$.screenHeight)) {
						
						dropEntity(e);
						
					}
					break;
			
				case MOVE_SPIROGRAPH:
					move.t += move.tStep;
					var p = getPointsOnSpirograph(move.R, move.r, move.O, move.t);
					setPositionCenter(pos, move.x + p[0], move.y + p[1]);
					break;
					
			}
			
		}	
		
		for (e in components[WEAPON_COMPONENT]) {
		
			var pos = components[POSITION_COMPONENT][e];
			var playerPos = components[POSITION_COMPONENT][playerId];			
			var c = components[WEAPON_COMPONENT][e];
			if (!Array.isArray(c)) {
				c = [c];
			}
			
			for (weaponId in c) {
				var weapon = c[weaponId];
			
				if (weapon.cooldownStep == 0) {				
					weapon.cooldownStep = weapon.cooldownSteps;
					
					var o = {};
					o[POSITION_COMPONENT] = {
						x: pos.x,
						y: pos.y
					};
					if (weapon.moveX || weapon.moveY) {						
						o[MOVE_COMPONENT] = {
							x: weapon.moveX,
							y: weapon.moveY,
							mode: MOVE_AXIS
						};	
					}
					else {								
						// Target player.
						var x = (pos.x - playerPos.x),
							y = (pos.y - playerPos.y),
							ip = Math.sqrt(x * x + y * y);
							
						o[MOVE_COMPONENT] = {
							x: -x / ip,
							y: -y / ip,
							mode: MOVE_AXIS
						};		
					}
					
					// Take speed into consideration.
					o[MOVE_COMPONENT].x *= weapon.speed;
					o[MOVE_COMPONENT].y *= weapon.speed;
					
					o[DAMAGE_COMPONENT] = {
						dmg: weapon.dmg
					};					
					createGenericEntity(weapon.weapon, o);
					
				}
				else {							
					weapon.cooldownStep--;
				}
			
			}
		
		}
		
		// Drop entity queue
		for (e in dropEntityQueue) {
								
			// Remove from collision groups
			col = components[COLLISION_COMPONENT][dropEntityQueue[e]];
			if (col != undefined) {
			
				removeEntityFromCollisionQueue({
					group: col.group,
					id: dropEntityQueue[e]
				});
				
			}
								
			for (c in components) {
			
				//components[c].splice(dropEntityQueue[e], 1);
				delete components[c][dropEntityQueue[e]];
			
			}
			//log.add("Entity " + dropEntityQueue[e] + " removed.");
				
		}

		dropEntityQueue = new Array();
		
		draw();
		
		// Fps
		currentFps++;
		
		var date = new Date();
		var time = date.getTime();
		if (time >= nextFpsTime) {
		
			nextFpsTime = time + 1000;
			previousFps = currentFps;
			currentFps = 0;
			
			document.getElementById("game_fps").innerHTML = previousFps;
					
			// Score!
			$$.playerScore += 1;
		
		}
	
	}
	
	/**
	Gives damage to an entity. Return true if entity is killed.
	*/
	function giveDamage(id, damage) {
	
		var health = components[HEALTH_COMPONENT][id];
		var collision = components[COLLISION_COMPONENT][id];
		
		if (collision.hits != undefined && collision.hits > 0) {
		
			collision.hits--;
			createKillExplosion(id);
						
			return false;
			
		}
		
		if (health != undefined && damage != undefined) {
		
			var dmg = damage.dmg;
			
			if (health.sp > 0) {
			
				health.sp -= dmg;
				if (health.sp < 0) {
					dmg = -health.sp;
					health.sp = 0;
				}
				else {
					dmg = 0;
				}
				
			}
			if (health.hp >= 0) {
			
				health.hp -= dmg;
				if (health.hp <= 0) {
					killEntity(id);
					return true;
				}
			
			}
			
		}
							
		return false;
		
	}
	
	function draw() {
        var offset_x = 0;
        var offset_y = $$.difficulty * 30;		
        $$.canvasContext.translate(offset_x, offset_y);		
		if (!$$.backgrounds[0].pattern) {
			$$.backgrounds[0].pattern = $$.canvasContext.createPattern($$.backgrounds[0].image, 'repeat');
		}
		$$.canvasContext.fillStyle = $$.backgrounds[0].pattern;//"#000"; 
		$$.canvasContext.fillRect(-offset_x, -offset_y, $$.screenWidth, $$.screenHeight);
        $$.canvasContext.translate(-offset_x, -offset_y);
		
		for (e in components[RENDER_COMPONENT]) {
		
			render = components[RENDER_COMPONENT][e];
			pos = components[POSITION_COMPONENT][e];
			
			if (render.delay > 0) {
				render.delay--;
				continue;
			}
			
			if (render.imageLoop) {
			
				render.imageLoopStep++;
				
				if (render.imageLoopStep >= render.imageLoopSteps) {
				
					render.imageLoopStep = 0;
					
					switch (render.imageLoopDirection) {
					
						case 0:
							render.imageNumber++;
							if (render.imageNumber == $$.imageSets[render.imageSet].images - 1) {
							
								if (render.imageKillAfterLoop) {
									killEntity(e);
								}
								
								if (render.imageLoopJump) {
									render.imageNumber = 0;
								}
								else {
									render.imageLoopDirection = 1;
								}
							}
							break;
					
						case 1:
							render.imageNumber--;
							if (render.imageNumber == 0) {
							
								if (render.imageKillAfterLoop) {
									killEntity(e);
								}
								
								if (render.imageLoopJump) {
									render.imageNumber = $$.imageSets[render.imageSet].images - 1;
								}
								else {
									render.imageLoopDirection = 0;
								}
								
							}
							break;
					}
					
				}
				
			}
			
			drawImageFromSet(render.imageSet, render.imageNumber, pos.left, pos.top, render.blend);
			
			//$$.canvasContext.strokeStyle="white";
			//$$.canvasContext.strokeRect(pos.left, pos.top, pos.w, pos.h);
		
		}					
	
		// Stats
		player = components[PLAYER_COMPONENT][playerId];
		playerShipDef = components[PLAYER_SHIP_DEF_COMPONENT][playerId];
		health = components[HEALTH_COMPONENT][playerId];
		
		function updateStatusBar(e, value, max) {
		
			e.childNodes[0].innerHTML = Math.floor(value) + " / " + Math.floor(max);
			e.childNodes[1].style.width = Math.floor(e.offsetWidth * (value / max));
			
		}
		
		function updateAttrBar(e, base, bonus) {
		
			if (bonus > 0) {
				e.innerHTML = (Math.floor((base + bonus) * 10) / 10) + " <i>(" + (Math.floor(base * 10) / 10) + " + <b>" + (Math.floor(bonus * 100) / 100) + "</b>)</i>";				
			}
			else if (bonus < 0) {
				e.innerHTML = (Math.max(0, Math.floor((base + bonus)) * 10) / 10) + " <i>(" + (Math.floor(base * 10) / 10) + " - <b>" + (Math.floor(-bonus * 100) / 100) + "</b>)</i>";				
			}
			else {
				e.innerHTML = base;			
			}
			
		}
		
		updateStatusBar($$.divSp, health.sp, player.maxSp);
		updateStatusBar($$.divHp, health.hp, player.maxHp);
		updateStatusBar($$.divMp, player.mp, player.maxMp);
		updateAttrBar($$.divShipSpeed, playerShipDef.def.speed, player.speedBonus);
		updateAttrBar($$.divShipManaRecharge, playerShipDef.def.mpPerTick, player.mpPerTickBonus);
		updateAttrBar($$.divShipShieldRecharge, playerShipDef.def.spPerTick, player.spPerTickBonus);
		updateAttrBar($$.divWeaponDamage, playerShipDef.def.weaponDef.dmg, player.weaponDmgBonus);
		updateAttrBar($$.divWeaponCooldown, playerShipDef.def.weaponDef.cooldown, -player.weaponCooldownBonus);
		
		updateAttrBar($$.divMaxMp, playerShipDef.def.mp, player.maxMpBonus);
		updateAttrBar($$.divMaxSp, playerShipDef.def.sp, player.maxSpBonus);
		updateAttrBar($$.divMaxHp, playerShipDef.def.hp, player.maxHpBonus);
		
		$$.divRedDiamonds.innerHTML = $$.playerStatBonuses[0];
		$$.divGreenDiamonds.innerHTML = $$.playerStatBonuses[1];
		$$.divBlueDiamonds.innerHTML = $$.playerStatBonuses[2];
		
		$$.divScore.innerHTML = $$.playerScore;
	
	}
	
	function fire() {
		
		player = components[PLAYER_COMPONENT][playerId];
		playerShipDef = components[PLAYER_SHIP_DEF_COMPONENT][playerId];
		
		if (player.weaponCooldown <= 0 && player.mp >= playerShipDef.def.weaponDef.mp) {
		
			player.weaponCooldown = playerShipDef.def.weaponDef.cooldown - player.weaponCooldownBonus;
			player.mp -= playerShipDef.def.weaponDef.mp;

			var o = {};
			o[POSITION_COMPONENT] = {
				x: components[POSITION_COMPONENT][playerId].x,
				y: components[POSITION_COMPONENT][playerId].y
			}
			o[MOVE_COMPONENT] = {
				mode: 0,
				x: 0,
				y: -playerShipDef.def.weaponDef.projectiles.speed
			}
			o[DAMAGE_COMPONENT] = {
				dmg: playerShipDef.def.weaponDef.dmg + player.weaponDmgBonus
			}
			o[COLLISION_COMPONENT] = {
				hits: playerShipDef.def.weaponDef.projectiles.hits
			}
			createGenericEntity(playerShipDef.def.weaponDef.projectiles.id, o);						
            
            // Play audio
            if (playerShipDef.def.weaponDef.audioOnFire) {
				var sound = new Howl({
					urls: ["assets/" + playerShipDef.def.weaponDef.audioOnFire]
				}).play();
            }

		}
		
	}
	
	function boundingBoxCollision(object1, object2) {
							
		m = 0.1;
		w1 = object1.w * m;
		h1 = object1.h * m;
		w2 = object2.w * m;
		h2 = object2.h * m;
		
		left1 = object1.left + w1;
		left2 = object2.left + w2;
		right1 = object1.right - w1;
		right2 = object2.right - w2;
		top1 = object1.top + h1;
		top2 = object2.top + h2;
		bottom1 = object1.bottom - h1;
		bottom2 = object2.bottom - h2;

		if (bottom1 < top2) return false;
		if (top1 > bottom2) return false;

		if (right1 < left2) return false;
		if (left1 > right2) return false;

		return true;

	};
	
	function addEntityToCollisionQueue(options) {
		
		$$.collisionGroups[options.group][options.id] = true;
		
	}
	
	function removeEntityFromCollisionQueue(options) {
		
		delete $$.collisionGroups[options.group][options.id];
		
	}
	
	function createKillExplosion(id) {
	
		var explosion = components[EXPLOSION_COMPONENT][id];
		if (explosion != undefined) {
			
			var position = components[POSITION_COMPONENT][id];
			var move = components[MOVE_COMPONENT][id];
			
			if (typeof explosion.count === 'undefined') {
				explosion.count = 1;
			}
			
			for (var i = 0; i < explosion.count; i++) {
				
				var o = {};
				if (i == 0) {
					o[POSITION_COMPONENT] = {
						x: position.x,
						y: position.y
					};
				}
				else {
					o[POSITION_COMPONENT] = {
						x: position.x + Math.floor(Math.random() * position.w - position.w / 2),
						y: position.y + Math.floor(Math.random() * position.h - position.h / 2)
					};
					o[RENDER_COMPONENT] = {
						delay: Math.floor(Math.random() * explosion.count * 5)
					};
				}
				if (move != undefined) {
					o[MOVE_COMPONENT] = {
						x: move.x / 2,
						y: move.y / 2,
						mode: move.mode
					};	
				}
				
				createGenericEntity(explosion.id, o);
				
			}
			
		}
		
	}
	
	function killEntity(id) {
	
		if (playerId == id) {
			$$.playerAlive = false;
			log.add("You have fought valiantly.");
		}
	
		var position = components[POSITION_COMPONENT][id];
		var move = components[MOVE_COMPONENT][id];
			
		// Check for bonuses
		var bonus = components[BONUS_COMPONENT][id];
		if (bonus != undefined) {
			
			if (Math.random() <= bonus.giveDiamondChance) {
				
				var diamondNumber = Math.floor(Math.random() * 3);
				
				var o = {};
				o[POSITION_COMPONENT] = {
					x: position.x,
					y: position.y
				}
				o[MOVE_COMPONENT] = {
					x: move.x / 2,
					y: move.y / 2,
					mode: move.mode
				}							
				createGenericEntity("diamond" + diamondNumber, o);
				
			}
			
		}
		
		// Explosion
		createKillExplosion(id);
		
		// Drop entity
		dropEntity(id);
	
	}
	
	function dropEntity(id) {
		
		dropEntityQueue.push(id);					
	
	}
	
	function attachEvents() {

		$$.canvas.onmousemove = function(e) {
			onMouseMove(e);
		}
		
		$$.canvas.onkeydown = function(e) {
			onKeyDown(e);
			return false;
		}
		
		$$.canvas.onkeyup = function(e) {
			onKeyUp(e);
			return false;
		}
		
		$$.canvas.onkeypress = function(e) {
			e.preventDefault();
			return false;
		}
	
	}
	
	function onMouseMove(e) {
		
		//log.add("MouseMove!");
	
	}
	
	function onKeyDown(e) {			
		keyDown[e.keyCode] = true;
	}
	
	function onKeyUp(e) {
		keyDown[e.keyCode] = false;
	}
		
	function drawImageFromSet(imageSet, imageNumber, x, y, blend) {
		
		$$.imageSets[imageSet].drawImage($$.canvasContext, imageNumber, x, y);
		
	}
	
	function Weapon(options) {
	
		this.cooldown = options.cooldown;
		this.mpPerFire = options.mpPerFire;
		this.projectileDmg = options.projectileDmg;
		this.projectiles = options.projectiles;
	
	}
	
	function setPositionCenter(c, x, y) {
	
		c.x = x;
		c.y = y;
		c.top = c.y - c.h / 2;					
		c.right = c.x + c.w / 2;
		c.bottom = c.y + c.h / 2;
		c.left = c.x - c.w / 2;
	
	}
	
	function Log() {
	
		this.container = document.getElementById("log");
		
		this.add = function(s) {
			this.container.innerHTML = s;
		}
	
	}

}

function ImageSet(file, x, y, w, h, mode, images, sizeMultiplier, blend) {

	this.srcX = x;
	this.srcY = y;
	this.srcW = w;
	this.srcH = h;
	this.destW = w * sizeMultiplier;
	this.destH = h * sizeMultiplier;
	this.mode = mode;
	this.images = images;
	this.sizeMultiplier = sizeMultiplier;
	this.image = new Image();
	this.image.src = "assets/" + file;
	this.blend = blend;
	
	this.drawImage = function(canvasContext, imageNumber, x, y) {
				
		switch (mode) {
		
			case 0:
				sx = imageNumber * this.srcW;
				sy = 0;
				break;
		
			case 1:
				sx = 0;
				sy = imageNumber * this.srcH;
				break;
				
		}
				
		sx += this.srcX;
		sy += this.srcY;
		dx = x;
		dy = y;
		canvasContext.globalCompositeOperation = this.blend;
		canvasContext.drawImage(this.image, sx, sy, this.srcW, this.srcH, dx, dy, this.destW, this.destH);
		canvasContext.globalCompositeOperation = 'source-over';		
	}

}