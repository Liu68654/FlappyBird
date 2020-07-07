var flappybird = {

    skyPosition : 0,
    skySpeed : 2,
    birdTop : 260,
    startColor : "blue",
    startFlag : false,
    dropSpeed : 0,
    minTop : 0,
    maxTop : 570,
    pipeNum : 50,
    lastIndex : 4,
    // clientWidth : document.body.clientWidth,
    pipeArr : [],
    score : 0,
    


    init: function() {
        this.initDate();
        this.animaiton();
        this.handle();
        if(sessionStorage.getItem('played')) {
            this.start();
        }
    },
    initDate: function() {
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
        this.oRankList = this.el.getElementsByClassName('rank-list')[0]
        this.oRestart = this.el.getElementsByClassName('restart')[0];
        this.scoreArr = this.getScore();
    },
    getScore: function() {
        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr : [];
    },
    setScore: function() {
        this.scoreArr.push({
            score : this.score,
            time : this.getDate(),
        });

        this.scoreArr.sort(function(a, b) {
            return b.score - a.score;
        });
        setLocal('score', this.scoreArr);
    },
    getDate: function() {
        var d = new Date();
        var year = d.getFullYear();
        var month = formatNum(d.getMonth() + 1);
        var day = formatNum(d.getDate());
        var hour = formatNum(d.getHours());
        var minute = formatNum(d.getMinutes());
        var second = formatNum(d.getSeconds());
        return `${year}.${month}.${day} ${hour}:${minute}:${second}`
    },
    animaiton: function() {
        var self = this;
        var count = 0;
        this.timer = setInterval(function() {
            self.backgroundMove();
            if(self.startFlag){
                self.birdDrop();
                self.pipeMove();
            }
            if(++count % 10 === 0) {
                self.birdFly(count);
                if(!self.startFlag) {
                    self.startAnim();
                    self.birdMove();
                }
            }
        },30)
    },
    handle: function() {
        this.handleStart();
        this.handleClick();
        this.restart();
    },
    backgroundMove: function() {
        this.skyPosition -= this.skySpeed;
        this.el.style.backgroundPositionX = this.skyPosition + 'px';
    },
    birdFly: function(count) {
        this.counter = count % 3 *30;
        this.oBird.style.backgroundPositionX = this.counter + 'px';
    },
    birdMove: function() {
        this.birdTop = this.birdTop === 260 ? 300 : 260;
        this.oBird.style.top = this.birdTop + 'px';
        // if(this.birdTop === 260) {
        //     this.birdTop = 300;
        //     this.oBird.style.top = this.birdTop + 'px';
        // }else{
        //     this.birdTop = 260;
        //     this.oBird.style.top = this.birdTop + 'px';
        // }
    },
    birdDrop: function() {
        this.birdTop += ++this.dropSpeed;
        this.oBird.style.top = this.birdTop + 'px';
        this.hitJudge();
    },
    startAnim: function() {
        if(this.startColor === "blue"){
            this.oStart.classList.remove('start-blue');
            this.oStart.classList.add('start-white');
            this.startColor = "white";
        }else{
            this.oStart.classList.remove('start-white');
            this.oStart.classList.add('start-blue');
            this.startColor = "blue";
        }
    },
    hitJudge: function() {
        this.boundaryHit();
        this.pipeHit();
    },
    boundaryHit: function() {
        if(this.birdTop < this.minTop || this.birdTop > this.maxTop) {
            this.gameOver();
        }
    },
   
    handleStart: function() {
        var self = this;
        self.oStart.onclick = function() {
            self.startFlag = true;
            self.oStart.style.display = "none";
            self.oScore.style.display = "block";
            self.oBird.style.transition = "none";
            self.skySpeed = 4;
            for(let i = 0; i < self.pipeNum; i++) {
                self.creatPipe(300 * (i));
            }
        }
    },
    start: function() {
        this.startFlag = true;
        this.oStart.style.display = "none";
        this.oScore.style.display = "block";
        this.oBird.style.transition = "none";
        this.skySpeed = 4;
        for(let i = 0; i < this.pipeNum; i++) {
            this.creatPipe(300 * (i));
        }
    },
    handleClick: function() {
        var self = this;
        this.el.onclick = function(e) {
            if(!e.target.classList.contains('start')) {
                self.dropSpeed = -10;
            }
        }
    },
    creatPipe: function(space) {
        var topHeight = 50 + Math.floor(Math.random() * 200);
        var bottomHeight = 600 - 100 - topHeight;

        var oTopPipe = creatEle('div', ['pipe', 'top-pipe'], {
            height : topHeight + 'px',
            right : -space + 'px'});
        var oBottomPipe = creatEle('div', ['pipe', 'bottom-pipe'], {
            height : bottomHeight + 'px',
            right : -space + 'px'});
        this.el.appendChild(oTopPipe);
        this.el.appendChild(oBottomPipe);
        this.pipeArr.push({ top : oTopPipe,
                            bottom : oBottomPipe,
                            Y : topHeight + 10,
                            Yy : topHeight + 90,
                        })
    },
    pipeMove: function() {
        for(let i = 0; i < this.pipeArr.length; i++) {
            var oTpipe = this.pipeArr[i].top;
            var oBpipe = this.pipeArr[i].bottom;
            var x = oTpipe.offsetLeft - this.skySpeed;
            // if(x < -52) {
            //     var lastPipeLeft = this.pipeArr[this.lastIndex].top.offsetLeft;
            //     oTpipe.style.left = lastPipeLeft + 300 + 'px';
            //     oBpipe.style.left = lastPipeLeft + 300 + 'px';
            //     this.lastIndex = ++this.lastIndex % this.pipeNum;
            //     var topHeight = 50 + Math.floor(Math.random() * 200);
            //     var bottomHeight = 600 - 100 - topHeight;
            //     oTpipe.style.height = topHeight + 'px';
            //     oBpipe.style.height = bottomHeight + 'px'; 
            //     continue;
            // }
            
            oTpipe.style.left = x + 'px';
            oBpipe.style.left = x + 'px';
        }
    },
    // newPipeHit: function() {
        
    // },
    pipeHit: function() {
        var index = this.score;
        var birdLeft = this.oBird.offsetLeft;
        var birdY = this.birdTop;
        var pipeX = this.pipeArr[index].top.offsetLeft; 
        var pipeY = this.pipeArr[index].Y;
        var pipeYy = this.pipeArr[index].Yy; 
        if(pipeX <= (birdLeft + 15) && pipeX >= (birdLeft - 67) && (birdY <= pipeY || birdY >= pipeYy)) {
            this.gameOver();
        
        }
        this.getScoree();
    },
    getScoree: function() {
        var index = this.score;
        var birdLeft = this.oBird.offsetLeft;
        var pipeX = this.pipeArr[index].top.offsetLeft;
        if(pipeX < birdLeft - 67) {
            this.oScore.innerText = ++ this.score;
        }
        this.getFinalScore();
    },
    getFinalScore: function() {
        this.oFinalScore.innerText = this.score;
    },
    restart: function() {
        this.oRestart.onclick = function() {
            sessionStorage.setItem('played', true);
            window.location.reload();
    
        };
    },
    gameOver: function() {
        clearInterval(this.timer);
        this.setScore();
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        this.oScore.style.display = "none";
        this.renderRankList();
    },
    renderRankList: function() {
        var template = '';
        
        for(let i = 0; i < 5; i ++) {
            
            var degreeClass = '';
            (function(j){
                switch (j) {
                    case 0:
                        degreeClass = 'first';
                    case 1:
                        degreeClass = 'second';
                    case 2:
                        degreeClass = 'third';
                }
            }(i))
            template += `
            <li class="rank-item">
                <span class="rank-degree ${degreeClass}">${i + 1}</span>
                <span class="rank-score">${this.scoreArr[i].score}</span>
                <span class="rank-time">${this.scoreArr[i].time}</span>
            </li>
            `;
        }
        this.oRankList.innerHTML = template;
    },
}