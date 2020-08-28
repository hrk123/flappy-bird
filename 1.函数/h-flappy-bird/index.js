(function() {
    var skyStep = 4;
    var time = 80;
    var bidrTop = 235;
    var fontStyle = 'blue';
    var key = false;
    var downStep = 0;
    var firstStart = false;
    var pillarN = 'pillar';
    var randomHeight;
    var pillarLength = 7;
    var pillarArray = [];
    var pillarUpArray = [];
    var pillarLeft = 0;
    var timer;
    var currentPillar = 0;
    var pillarHeight = 0;
    var pillarDownHeight;
    var birdT = 0;
    var birdB = 0;
    var scoreNumber = 0;
    var score;
    var birdBounce;
    var rankingArray = [];
    var str = '';
    var Time;
    var restart;
    var backgroundMusic = document.getElementById('backMusic');
    var overMusic = document.getElementById('overMusic');


    console.log(backgroundMusic);

    //控制天空奔跑，小鸟翅膀摆动
    var sky_wing = setInterval(function() {
        skyRun();
        wingSwing();
        if (key) {
            pillarMove();
            pillarRun();
            upDetection();
        }

    }, time)

    var font_jump = setInterval(function() {
        if (!key) {
            fontSwitchover();
            bidrJump();
        }
    }, 300)

    //背景图跑起来
    var game = document.getElementById('game');
    game.style.backgroundPositionX = '0';

    function skyRun() {
        game.style.backgroundPositionX = parseInt(game.style.backgroundPositionX) - skyStep + 'px';
    }

    //小鸟翅膀摆动
    var bird = game.getElementsByClassName('bird')[0];
    bird.style.backgroundPositionX = '0';

    function wingSwing() {
        bird.style.backgroundPositionX = parseInt(bird.style.backgroundPositionX) - 30 + 'px';
    }

    //小鸟上下移动
    function bidrJump() {
        bidrTop = bidrTop === 235 ? 200 : 235;
        bird.style.top = bidrTop + 'px';
    }

    //开始游戏字体切换
    var start = game.getElementsByClassName('start')[0];

    function fontSwitchover() {
        var currentStyle = fontStyle;
        fontStyle = fontStyle === 'blue' ? 'white' : 'blue';
        start.classList.remove(currentStyle);
        start.classList.add(fontStyle);
    }

    //控制游戏开始
    var start = document.getElementsByClassName('start')[0];
    var score = document.getElementsByClassName('score')[0];
    start.addEventListener('click', startGame, false);

    function startGame() {
        key = true;
        score.style.display = 'block';
        start.style.display = 'none';
        bird.style.left = '80px';
        bird.style.transition = 'none';
        backgroundMusic.play();
        backgroundMusic.volume = .5;
        skyStep = 10;
        time = 3;

        for (var i = 1; i <= pillarLength; i++) {
            createPillar(i * 300);
        }


        //让小鸟自动向下掉
        timer = setInterval(function() {
            var currentTop = parseInt(bird.style.top);
            downStep++;
            bird.style.top = currentTop + downStep + 'px';
            if (parseInt(bird.style.top) >= 570 || currentTop <= 0) {
                Time = getDate();
                clearInterval(timer);
                clearInterval(sky_wing);
                block();
                replaceScore()
                setScoreLocal();
                restartGame();
                backgroundMusic.pause();
                overMusic.play();


            }
        }, 30)

        //让小鸟通过鼠标点击向上蹦跳
        game.addEventListener('click', birdBounce, false);
    }


    function birdBounce() {
        if (firstStart) {
            downStep = -10;
        }
        firstStart = true;
    }


    //创建柱子
    function createPillar(x) {
        randomHeight = Math.floor(50 + Math.random() * 300);

        var pillarUP = createElement('div', ['pillar', 'pillar_up'], {
            left: x + 'px',
            height: randomHeight + 'px'
        })
        var pillarDown = createElement('div', ['pillar', 'pillar_down'], {
            left: x + 'px',
            height: downHeight = 450 - randomHeight + 'px'
        })

        game.appendChild(pillarUP);
        game.appendChild(pillarDown);

        pillarArray.push(pillarUP);
        pillarUpArray.push(pillarUP);
        pillarArray.push(pillarDown);
    }


    //创建元素
    function createElement(elemet, classArry, styleObj) {

        pillarN = document.createElement(elemet);
        for (var i = 0; i < classArry.length; i++) {
            pillarN.classList.add(classArry[i]);
        }

        for (var prop in styleObj) {
            pillarN.style[prop] = styleObj[prop];
        }
        return pillarN;
    }

    //柱子移动
    function pillarMove() {
        for (var i = 0; i < pillarArray.length; i++) {
            pillarArray[i].style.left = pillarArray[i].offsetLeft - skyStep + 'px';

        }
    }


    //柱子轮回移动
    function pillarRun() {
        for (var i = 0; i < pillarArray.length; i++) {
            pillarLeft = parseInt(pillarArray[i].style.left);
            if (pillarLeft <= -52) {
                pillarArray[i].style.left = 2100 + 'px';
            }
        }
    }

    //碰撞柱子检测
    score = document.getElementsByClassName('score')[0];

    function upDetection() {
        for (var i = 0; i < pillarUpArray.length; i++) {
            currentPillar = parseInt(pillarUpArray[i].offsetLeft);
            pillarHeight = parseInt(pillarUpArray[i].style.height);
            pillarDownHeight = pillarHeight + 150;
            birdT = parseInt(bird.style.top);
            birdB = birdT + 30;
            if ((currentPillar <= 95 && currentPillar >= 13) && (birdT <= pillarHeight || birdB >= pillarDownHeight)) {
                Time = getDate();
                clearInterval(timer);
                clearInterval(sky_wing);
                block();
                replaceScore();
                setScoreLocal();
                restartGame();
                backgroundMusic.pause();
                overMusic.play();
                game.removeEventListener('click', birdBounce, false);
            } else if (currentPillar === 10) {
                scoreNumber++;
                score.innerText = scoreNumber;
            }
        }
    }
    //显示失败信息
    function block() {
        var mask = document.getElementsByClassName('mask')[0];
        var ranking = document.getElementsByClassName('rank-list')[0];
        restart = document.getElementsByClassName('restart')[0];
        mask.style.display = 'block';
        score.style.display = 'none';
        ranking.style.display = 'block';
        restart.style.display = 'block';

    }

    //通过柱子更新分数
    function replaceScore() {
        var finalScore = document.getElementsByClassName('finalScore')[0];
        finalScore.innerText = scoreNumber;
    }


    //生成排名项
    function createRankingList() {
        var length = rankingArray.length <= 6 ? rankingArray.length : 6;
        var rankList = document.getElementsByClassName('rank-list')[0];
        var index = 0;

        //排序
        rankingArray.sort(function(a, b) {
            return b['score'] - a['score'];
        })

        for (var i = 0; i < length; i++) {
            var rankStyle = '';
            switch (i) {
                case 0:
                    rankStyle = 'first';
                    break;
                case 1:
                    rankStyle = 'second';
                    break;
                case 2:
                    rankStyle = 'thirdly';
                    break;
            }

            str +=
                `<li class="rank-item">
                    <span class="rank ${rankStyle}">${++index}</span>
                    <span class="num">${rankingArray[i]['score']}</span>
                    <span class="date">${rankingArray[i]['time']}</span>
                </li>`;
            rankList.innerHTML = str;
        }
    }

    //获取时间
    function getDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        return `${year}:${month}:${day} ${hour}:${minutes}:${second}`;
    }


    //将 分数，时间 推送到本地存储中  
    function setScoreLocal() {
        rankingArray = getLocal('score') ? getLocal('score') : [];
        rankingArray.push({
            score: scoreNumber,
            time: Time,
        });

        setLocal('score', JSON.stringify(rankingArray));
        createRankingList()
    }


    //重新开始
    function restartGame() {
        restart.addEventListener('click', restartHandle, false);

        function restartHandle() {
            sessionStorage.setItem('play', true);
            window.location.reload();

        }
    }
}())