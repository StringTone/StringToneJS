console.log('index loaded its JS');
// /////////////////////////////////////////////// //
//  NOTE: special thanks and much love to #EC1022  //
//  for both his saintly patience explaining hash  //
//  algorythms, as well as some amazing BBQ ribs!  //
// /////////////////////////////////////////////// //

const stringToHue = document.getElementById('stringToHue'), 
      DB          = document.body;
let   debounce    = null,
      snapshot;

const chromafy = str => {
    if(str === '') return '#FFF';
    const fcc=c=>String.fromCharCode(c),
          cca=(s,i)=>s.charCodeAt(i);
    let stopRGBurgler = v => DB.dataset.rgb = v.map(v=>parseInt(v,16)),
        kershuffleArr = (v, n='') => {
            var n = '';
            for(var l in v) n += fcc(((cca(v,l) * (l+2) * v.length) % 97 + 32));
            return (n.length < 6) 
                    ? (n + kershuffleArr(n + v)).slice(0, 6)
                    : n.slice(0, v.length);
        },
        hasherdabbery = str => [...str].reduce((hasherdabbery,char)=>cca(char,0) + ((hasherdabbery << 5) - hasherdabbery), 0),
        shuffleKerfuffle = str => [0,2,4].map(v=>('0' + (+(hasherdabbery(str) >> ((v) * 5) & 0xFF)).toString(16)).slice(-2)),
        chromaficated = shuffleKerfuffle(kershuffleArr(str));
    
    stopRGBurgler(chromaficated);
    return '#' + chromaficated.join(''); 
}

function huemanize() {
    snapshot      = DB.style;
    function hueDidIt(){
        let inputText = stringToHue.value,
            bodyBG    = chromafy(stringToHue.value),
            panelBG   = (bodyBG === "#FFF") ? chromafy(String(Math.random())) : '#FFF',
            rgbOutput = DB.dataset.rgb,
            activeOP  = +(inputText !== ""),
            inactiveOp = +(!activeOP);
        if(bodyBG && bodyBG === "#FFF") {
            DB.style = snapshot;
        } else {
            DB.style=`--hue:${bodyBG}; --derived:"${bodyBG}"; --panelHue:${panelBG}; --panelDerived:"${panelBG}"; --rgb:"${rgbOutput}"; --activeOutput:${activeOP}; --inactiveOutput:${inactiveOp}`;
        }
    }
    
    function hueGoBoss() {
        DB.removeAttribute('style');
        DB.removeAttribute('data-rgb');
        // document.documentElement.removeAttribute("style");
    }
    return clearTimeout(debounce) || (debounce = (stringToHue.value !== "") ? setTimeout(hueDidIt, debounce ? 250 : 0) : hueGoBoss())
}


stringToHue.addEventListener('input', huemanize)
stringToHue.addEventListener('change', huemanize)
stringToHue.addEventListener('blur', huemanize)
huemanize();


window.addEventListener("load", () => {
    document.body.dataset.newload = "false";
    const randomLetter = (randomized = ~~(Math.random() * 57) + 65) =>
            randomized < 97 && randomized > 90
                ? randomLetter()
                : String.fromCharCode(randomized),
        letterSwarmCt = 20,
        bgLayer = document.getElementById("page-bg"),
          families =  ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'math'];
    
    
    document.body.style = bgLayer.style = `--bg1: ${~~(Math.random() * 1080)}; --bg2: ${~~(Math.random() * 1080)};    --bg3: ${~~(Math.random() * 1080)};    --bg4: ${~~(Math.random() * 1080)};    --bg5: ${~~(Math.random() * 1080)};`
    for (var i = 0; i < letterSwarmCt; i++) {
        let cssVars = {
            "--fm": families[~~(Math.random() * 6)],
            "--sz": `${5 + ~~(Math.random() * 20)}vh`,
            "--r1": `${~~(Math.random() * 360)}deg`,
            "--r2": `${360 - ~~(Math.random()) + 360}deg`,
            "--r3": `${360 - ~~(Math.random() * 1440) + 360}deg`,
            "--r4": `${360 - ~~(Math.random() * 720) + 360}deg`,
            "--r5": `${360 - ~~(Math.random() * 360) + 360}deg`,
            "--x1": `${50 - (Math.random() * 100) + 50}vw`,
            "--y1": `${50 - (Math.random() * 100) + 50}vh`,
            "--x2": `${50 - (Math.random() * 100) + 50}vw`,
            "--y2": `${50 - (Math.random() * 100) + 50}vh`,
            "--x3": `${50 - (Math.random() * 100) + 50}vw`,
            "--y3": `${50 - (Math.random() * 100) + 50}vh`,
            "--x4": `${50 - (Math.random() * 100) + 50}vw`,
            "--y4": `${50 - (Math.random() * 100) + 50}vh`,
            "--x5": `${50 - (Math.random() * 100) + 50}vw`,
            "--y5": `${50 - (Math.random() * 100) + 50}vh`,
            "--d": `${(75 + ~~(Math.random() * 125)) * 10}s`,
            "--o": `${(~~(Math.random() * 50) + 40) / 100}`,
            "--b": `${~~(Math.random() * 8)}px`
        };
        //bgLayer.insertAdjacentHTML("beforeEnd", `<var style="${Object.entries(cssVars).reduce((cv,pv)=>cv+=`${pv[0]}:${pv[1]};`, "")}">${randomLetter()}</var>`);
        //document.querySelector('.blurNotes').style = cssVars;
        
    }
});

function resetField() {
    let inputField = document.getElementById("stringToHue");
    inputField.value="";
    inputField.focus();
    inputField.blur();
}
// 
// let bCounter=0;
// const blurCoder = () => {
//     document.body.classList.add("pageBlur");
//     bCounter+=1;
//         setTimeout(blurCountdown, 1750);
// 
//     console.log(bCounter)
//     if(bCounter >= 3) {
//         document.body.classList.add('dialog');
//     }        
// 
// };
// 
// const focusCoder = () => {
//     document.body.classList.remove("pageBlur");
// }
// 
// const blurCountdown = () => {
//     if(bCounter <= 0) {
//         return;
//     }
//     bCounter--;
//     setTimeout(blurCountdown, 1750);
// }

// window.addEventListener('blur',blurCoder);
// window.addEventListener('pagehide',blurCoder);
// window.addEventListener('unload',blurCoder);

// window.addEventListener('focus', focusCoder);
// window.addEventListener('pageshow', focusCoder);
