var timerFunction;
var imagePuzzle = {
    stepCount: 0,
    highSscorecore: 0,
    startTime: new Date().getTime(),
    startGame: function (image, gridSize) {
        this.setImage(image, gridSize);
        helper.doc('playPanel').style.display = 'block';
        helper.shuffle('sortable');
        this.stepCount = 0;
        helper.doc('highScore').innerHTML = localStorage.getItem('score') ;
        this.startTime = new Date().getTime();
        this.tick();
    },
    tick: function () {
        var now = new Date().getTime();
        var elapsedTime = parseInt((now - imagePuzzle.startTime) / 1000, 10);
        helper.doc('timerPanel').textContent = elapsedTime;
        timerFunction = setTimeout(imagePuzzle.tick, 1000);
    },
    setImage: function (image, gridSize = 4) {
        var percentage = 100 / (gridSize - 1);
        helper.doc('sortable').innerHTML = ''; 
        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = (percentage * (i % gridSize)) + '%'; //150%
            var ypos = (percentage * Math.floor(i / gridSize)) + '%'; //0%
            // <li id=0 data-value=0 draggable=true></li>
            // li{
            //     backgroundImage=image.jpg ;
            //     backgroundSize = 900%
            //     backgroundPosition= 100% 0%;
            // }
            let li = document.createElement('li');
            li.id = i;
            li.setAttribute('data-value', i);
            if(image.src){
                li.style.backgroundImage = 'url(' + image.src + ')';
            } else {
                li.style.backgroundImage = 'url(' + image + ')';
            }
            // li.style.backgroundSize = (gridSize * 100) + '%';
            li.style.backgroundPosition = xpos + ' ' + ypos;
            li.style.width = 400 / gridSize + 'px';
            li.style.height = 400 / gridSize + 'px';
            li.setAttribute('draggable', 'true');
            li.setAttribute('dragstart', 'true');
            helper.doc('sortable').appendChild(li);
            li.ondragstart = (event) => event.dataTransfer.setData('data', event.target.id);
            li.ondragover = (event) => event.preventDefault();
            li.ondrop = (event) => {
                let origin = helper.doc(event.dataTransfer.getData('data'));
                let dest = helper.doc(event.target.id);
                let p = dest.parentNode;
                if (origin && dest && p) {
                    let temp = dest.nextSibling;
                    let x_diff = origin.offsetLeft-dest.offsetLeft;
                    let y_diff = origin.offsetTop-dest.offsetTop;
                    if(y_diff == 0 && x_diff >0){
                        //LEFT SWAP
                        p.insertBefore(origin, dest);
                        p.insertBefore(temp, origin);
                    }
                    else{
                        p.insertBefore(dest, origin);
                        p.insertBefore(origin, temp);
                    }
                    let vals = Array.from(helper.doc('sortable').children).map(x => x.id);
                    var now = new Date().getTime();
                    helper.doc('stepCount').textContent = ++imagePuzzle.stepCount;
                    document.querySelector('.timeCount').textContent = (parseInt((now - imagePuzzle.startTime) / 1000, 10));
                    if (isSorted(vals)) {
                        // helper.doc('actualImageBox').style.display = 'none';
                        // helper.doc('gameOver').style.display = 'block';
                        helper.doc('actualImageBox').innerHTML = helper.doc('gameOver').innerHTML;
                        helper.doc('stepCount').textContent = imagePuzzle.stepCount;
                        if(localStorage.getItem('score') > imagePuzzle.stepCount) {
                            localStorage.setItem('score', imagePuzzle.stepCount);
                        }
                    }
                }
            };
        }
        //helper.shuffle('sortable');
    }
};
isSorted = (arr) => arr.every((elem, index) => { return elem == index; });
var helper = {
    doc: (id) => document.getElementById(id) || document.createElement("div"),
    shuffle: (id) => {
        var ul = document.getElementById(id);
        for (var i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }
}