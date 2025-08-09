let gameSeq = [];
let userSeq = [];
let gmaeStart = false;
let level = 0;

// document.addEventListener("keypress", ()=>{
//     if(gmaeStart == false){
//         console.log("Game has Start");
//         gmaeStart = true;
//         levelUp();
//     }
// });

// function gameFlash(btn){
//     btn.classList.add("flash");

//     setTimeout(function(){
//         btn.classList.remove("flash");
//     }, 250);
// }

// function userFlash(btn){
//     btn.classList.add("userflash");

//     setTimeout(function(){
//         btn.classList.remove("userflash");
//     }, 250);
// }

// let h2 = document.querySelector("h2");
// let btns = ["yellow", "green", "purple", "green"];

// function levelUp(){
//     userSeq = [];
//     level++;
//     h2.innerText = `Level ${level}`;
    
//     let randIdx = Math.floor(Math.random() * 3);
//     let randColor = btns[randIdx];
//     let randBtn = document.querySelector(`.${randColor}`);//creat a class using randColor like yellow , red or more
//     // console.log(randIdx);
//     // console.log(randColor);
//     // console.log(randBtn);
//     gameSeq.push(randColor);
//     console.log(gameSeq);
    
//     gameFlash(randBtn);
// }

// function btnPress(){
//     // console.log(this);//here this is the curr btn press by user
//     let btn = this;
//     userFlash(btn);
//     userSeq.push(btn.getAttribute("id"));
//     checkAns(userSeq.length-1);
// }

// let allBtn = document.querySelectorAll(".btn");
// for(btn of allBtn){
//     btn.addEventListener("click", btnPress)
// }

// function checkAns(lastidx){//tracking curr level
//     if(userSeq[lastidx] === gameSeq[lastidx]) {

//         if(userSeq.length == gameSeq.length){
//             h2.innerHTML = `Keep Play! your current Score is ${level}`;
//             setTimeout(levelUp, 1000);
//         }

//     } else {
//         h2.innerHTML = `Game Over! Your Score is <b>${level}</b>. <br> please press a random for Restart the game`;

//         document.querySelector("body").style.backgroundColor = "red";
//         setTimeout(function(){
//             document.querySelector("body").style.backgroundColor = "white";
//         }, 1000);

//         reset();
//     }
// }

// function reset(){
//     gameStart = false;
//     gameSeq = [];
//     userSeq = [];
//     level = 0;
// }

document.addEventListener("keypress", ()=> {
    if(gmaeStart == false){
        console.log("game is start");
        gmaeStart = true;
        levelUp();
    }
});

let h2 = document.querySelector("h2");
let btn = ["yellow", "green", "red", "purple"];

function levelUp(){
    userSeq = [];
    level++;
    h2.innerText = `level ${level}`;
    let randIdx = Math.floor(Math.random() * 3);
    let randColor = btn[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    gameFlash(randBtn);
    console.log(gameSeq);
}
function gameFlash(btn){
    btn.classList.add("flash");
    setTimeout(() => {
        btn.classList.remove("flash");
    }, 250);
}
function userFlash(btn){
    btn.classList.add("userflash");
    setTimeout(() => {
        btn.classList.remove("userflash");
    }, 250);
}
let allBtn = document.querySelectorAll(".btn");
for(btn of allBtn){
    btn.addEventListener("click", function(){
        let btn = this;
        userSeq.push(btn.getAttribute("id"));
        checkAns(userSeq.length-1);
    });
}

function checkAns(idx){
    if(gameSeq[idx] === userSeq[idx]){
        if(gameSeq.length == userSeq.length){
            setTimeout(() => {
                level();
            }, 500);
        }
    } else {
        h1.innerHtml = `game over your scro is ${level}`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(() => {
            document.querySelector("body").style.backgroundColor = "white";
        }, 1000);
        reset();
    }
}

function reset(){
    gmaeStart = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

