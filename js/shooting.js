var shooter = {
	methods: {
		
		init: function(){
			dom.score = 0;
			mt.resetDomVar();
			mt.initTimer();
			mt.initEnemy();
			mt.bindScore();
			mt.closePopup();
		},
		
		resetDomVar: function(){
			dom.min = 1;
			dom.sec = 0;			
			dom.enemyArr = [];
			dom.bulletArr = [];
			dom.bulletCount = 0;
			dom.timeLeft = 0;
			dom.enemyArea.innerHTML = "";
			dom.bulletBlock.innerHTML = "";
		},
		
		closePopup: function(){
			dom.popup.style.display = "none";
			dom.overlay.style.display = "none";
		},

		initTimer: function(){
			if(dom.sec == 0){
				dom.sec = 60;
				dom.min--;
			}
			if(dom.min == -1){
				dom.sec = 0;
				mt.stopTimer();
				return;
			}
			dom.sec--;
			mt.bindTimer();
			dom.timerInstance = window.setTimeout(function(){
				mt.initTimer();
			}, 1000);
		},

		stopTimer: function(){
			window.clearTimeout(dom.timerInstance);
			mt.resetDomVar();
			mt.showPopup();
		},

		bindTimer: function(){
			if(dom.score == dom.enemyCount){
				mt.resetDomVar();
				mt.showPopup();
			}
			dom.clock.innerHTML = (dom.min+ " : "+dom.sec);
		},
		
		showPopup: function(){
			dom.popupScore.innerHTML = "You destroyed " + dom.score + " Spaceships";
			dom.popup.style.display = "block";
			dom.overlay.style.display = "block";
		},
		
		bindScore: function(){
			dom.scoreBoard.innerHTML = (dom.score);
		},

		moveGun: function(direction){
			if(direction == 'left'){
				if(dom.gun.offsetLeft > dom.xMin){
					dom.gun.style.left = dom.gun.offsetLeft - dom.step + 'px';
				}
			}else if(direction == 'right'){
				if(dom.gun.offsetLeft < dom.xMax){
					dom.gun.style.left = dom.gun.offsetLeft + dom.step + 'px';
				}
			}
		},

		keyEvent: function(key){
		 	if(key == 37){
		 		mt.moveGun('left');
		 	}else if(key == 39){
		 		mt.moveGun('right');
		 	}else if(key == 13){
				mt.shootBullet();
			}
		},

		initEnemy: function(){
			for(var i = 0 ; i < dom.enemyCount ; i++ ){
				var enemyObj = {
					left: Math.round(Math.random()*(dom.xMax - dom.xMin) + dom.xMin),
					top: Math.round(Math.random()*dom.eyMax),
					isAlive: true,
					domId: 'enemyNum' + i
				}
				dom.enemyArr.push(enemyObj);
			}
			mt.pushEnemy();
		},

		pushEnemy: function(){
			for( var i = 0 ; i < dom.enemyArr.length ; i++ ){
				var e = document.createElement('div');
				e.className = 'enemy';
				e.style.top = dom.enemyArr[i].top + 'px';
				e.style.left = dom.enemyArr[i].left + 'px';
				e.id = dom.enemyArr[i].domId;
				dom.enemyArea.appendChild(e);
			}
		},
		
		shootBullet: function(){
			var bullet = document.createElement('div');
			bullet.className = 'bullet';
			bullet.id = 'bullet' + dom.bulletCount;
			bullet.style.left = dom.gunTip.getBoundingClientRect().left - 10 + 'px';
			bullet.style.top = dom.gunTip.getBoundingClientRect().top + 'px';
			dom.bulletArr.push( {bullet: bullet, ttl: dom.ttl, id: dom.bulletCount} );
			dom.timeLeft = dom.ttl;
			dom.bulletBlock.appendChild(bullet);
			var bullet = document.getElementById('bullet'+dom.bulletCount);
			dom.bulletCount++;
			mt.trackBullet();
		},
		
		trackBullet: function(){
			if(dom.timeLeft > 0 && dom.bulletArr.length > 0){
				for( var i = 0 ; i < dom.bulletArr.length ; i++){
					var bulletObj = dom.bulletArr[i];
					var bullet = document.getElementById('bullet'+bulletObj.id);
					if(bulletObj.ttl > 0){
						var bulletObjRect = bullet.getBoundingClientRect();
						bullet.style.top = bulletObjRect.top - dom.timeStep/3 + 'px';
						bulletObj.ttl -= dom.timeStep;
						for(var j = 0 ; j < dom.enemyArr.length ; j++){
							var enemy = dom.enemyArr[j];
							var enemyDom = document.getElementById(enemy.domId);
							var enemyRect = enemyDom.getBoundingClientRect();
							if(bulletObjRect.top <= enemyRect.bottom && bulletObjRect.left >= enemyRect.left && bulletObjRect.left <= enemyRect.right ){
								enemyDom.remove();
								dom.enemyArr.splice(j, 1);
								dom.score++;
								mt.bindScore();
							}
						}
					}else {
						dom.bulletArr.splice(i, 1);
						bullet.remove();
					}
				}
				dom.timeLeft -= dom.timeStep;
				window.setTimeout(function(){
					mt.trackBullet();
				}, dom.timeStep);
			}
		}

	},
	events: function(){
		window.addEventListener('keydown', function(ev){
			mt.keyEvent(ev.keyCode);
		});
		
		dom.closeBtn.addEventListener('click', function(){
			mt.init();
		});
		dom.moveLeft.addEventListener('click', function(){
			mt.moveGun('left');
		});
		dom.moveRight.addEventListener('click', function(){
			mt.moveGun('right');
		});
		dom.gameArea.addEventListener('click', function(){
			mt.shootBullet();
		});
	},
	init: function(){
		dom.xMin = (window.innerWidth/100) * dom.xMin;
		dom.xMax = (window.innerWidth/100) * dom.xMax;
		dom.eyMax = (window.innerHeight/100) * dom.eyMax;
		
	},
	doms: {
		min: 1,
		sec: 0,
		timerInstance: null,
		score: 0,
		xMin: 5,
		xMax: 70,
		eyMax: 30,
		step: 10,
		enemyArr: [],
		bulletArr: [],
		bulletCount: 0,
		enemyCount: 20,
		ttl: 2000,
		timeStep: 100,
		timeLeft: 0,
		gameArea: document.getElementsByClassName('game-area')[0],
		clock: document.getElementById('clock'),
		scoreBoard: document.getElementById('score'),
		gun: document.getElementById('gun'),
		enemyArea: document.getElementById('enemyArea'),
		bulletBlock: document.getElementById('bulletBlock'),
		gunTip: document.getElementById('gunTip'),
		popup: document.getElementById('popup'),
		popupScore: document.getElementById('popupScore'),
		closeBtn: document.getElementById('closeBtn'),
		overlay: document.getElementById('overlay'),
		moveLeft: document.getElementById('moveLeft'),
		moveRight: document.getElementById('moveRight'),
	}
};
var dom = shooter.doms;
var mt = shooter.methods;
window.onload = function(){
	shooter.events();
	shooter.init();
}
