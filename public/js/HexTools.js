class HexTools {
    constructor() {
        return (!HexTools.instance) ? (HexTools.instance = this) : HexTools.instance;
    }
    #getHexArray = (hex, includeAlpha = false) => {
        if(Array.isArray(hex)) return hex;
        if(typeof(hex) !== 'string') return [];
        let hexSegmentLength = (hex.length >= 6) + 1;
        let hexArray = hex?.match(new RegExp(`[0-9a-f]{${hexSegmentLength}}`, 'gi'))??[];
        if(hexArray == null || hexArray.length < 3) return [];
        
        if(includeAlpha === true){
            if(hexArray.length === 3 && hex.length < 5) { hexArray.push(('f'.repeat(hexSegmentLength))); }
        }else {
            if(hexArray.length === 4) { hexArray = hexArray.slice(0,3); }
        }
        return hexArray;
    }
    #formatHexArr = (hexArr=null) => (hexArr != null) ? '#' + [...hexArr].join('').replace(/#+/, '') : "";
    roundHex   = (hex) => hexTools.deflateHex(hex, true);
    websafeHex = this.roundHex;

    deflateHex = function(hex, round=false, respectAlpha=false){
        if(new RegExp(/^#?[0-9a-f]{3,4}$/i).test(hex)){
            if(respectAlpha) return (hex.length === 4) ? this.#formatHexArr(hex) : this.#formatHexArr(hex + 'f');
            else return this.#formatHexArr(hex.slice(0,3));
        }
        let hexArr = (respectAlpha && hex.length < 8) ? this.#getHexArray(hex + "ff") : this.#getHexArray(hex);
        
        let shortHex = "#";
        for(var i=0; i<hexArr.length; i++){
            let v = parseInt('0x' + hexArr[i]);
            if(round || !(v % 17)) shortHex += Math.round(v / 17).toString(16);
            else return this.#formatHexArr(hexArr);
        }
        return this.#formatHexArr(shortHex);
    }
    inflateHex = function(hex, returnArray=false, respectAlpha=false) {
        let shortHexArr = this.#getHexArray(hex, respectAlpha);
        if(shortHexArr == null || hex.length < 3 || hex.length > 5) {
            return returnArray ? shortHexArr : this.#formatHexArr(hex);
        }
        if(respectAlpha) { if(shortHexArr.length < 4 ) { shortHexArr.push('f'); } }
        else { if(shortHexArr.length === 4 ) { shortHexArr.pop(); } }
        shortHexArr = shortHexArr.map(c=>c.repeat(2).slice(0,2));
        return returnArray ? shortHexArr : this.#formatHexArr(shortHexArr);
    }
}

const hexTools = new HexTools();
module.exports = hexTools;
