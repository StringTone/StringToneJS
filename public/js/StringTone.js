const hexTools = require("./HexTools.js");

class StringTone {
    constructor(){
        return (!StringTone.instance) ? (StringTone.instance = this) : StringTone.instance;
    }
    #cca       = (s, i=0)  => s.charCodeAt(i);
    #fcc       = (c)       => String.fromCharCode(c);
    #nts       = (n)       => n.toString(16);
    #hashStr   = (str)     => [...str].reduce((h,c)=>this.#cca(c) + ((h << 5) - h), 0);
    #rotateArr = (str)     => [0,2,4].map(v=>('0' + this.#nts((this.#hashStr(str) >> ((v) * 5)  & 0xFF))).slice(-2));
    #strToClr  = (v, n='') => {
        for(var l in v) n += this.#fcc(((this.#cca(v,l) * (l+2) * v.length) % 97 + 32));
        return (n.length < 6) 
        ? (n + this.#strToClr(n + v)).slice(0, 6)
        : n.slice(0, v.length);
    };
    
    #a11yBG    = (hex, respectAlpha=0) => {
        let [r,g,b,a]=hexTools.inflateHex(hex, true, respectAlpha).map(v => parseInt('0x' + v));
        return ((~~(r*299) + ~~(g*587) + ~~(b*114))/1000) >= 128 || (!!(~(128/a) + 1) && respectAlpha) ? '#FFF' : '#000';   
    }
    
    getStringFG   = (str) => (str == null || str === '') ? '#000000' : hexTools.deflateHex(this.#rotateArr(this.#strToClr(str)).join(''));
    getStringBG   = (str) => (str == null || str === '') ? '#ffffff' : this.#a11yBG(this.getStringFG(str));
}

let stringTone = new StringTone();
module.exports = stringTone;
