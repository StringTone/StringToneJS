const hexTools = require("./HexTools.js");
class HexConversions {
    constructor() {
        return (!HexConversions.instance) ? (HexConversions.instance = this) : HexConversions.instance;
    }

    

    #HEX  = (hex, respectAlpha=false) => {
        let result = hex;
        if(respectAlpha){
            if(/^#?[0-9a-f]{3}$/i.test(hex)) result = result + 'f';
            else if(/^#?[0-9a-f]{6}$/i.test(hex)) result = result + 'ff';
        } else {
            if(/^#?[0-9a-f]{4}$/i.test(hex)) result = result.slice(0,4);
            else if(/^#?[0-9a-f]{6}$/i.test(hex)) result = result.slice(0,7);
        }
        return result;
    }
    #HEXA = (hex) => this.#HEX(hex, true);
    #RGB  = (hex, respectAlpha=false) => {
        let result = hexTools.inflateHex(hex, true, respectAlpha).map(v => parseInt('0x' + v));
        if(!respectAlpha) {
            result = result.slice(0,3);
        } else {
            if(result.length === 3) result.push(1);
            else result.push(result.pop() / 255);
        }
        console.log('#RGB result :', result);
        return result;
    }
    #RGBA = (hex) => this.#RGB(hex, true);

    #HSL  = (hex, respectAlpha=false) => {
        let hexArr = hexTools.inflateHex(hex, true, respectAlpha)
        let rgba = this.#RGBA(hex);
        let [r,g,b,a] = this.#RGBA(hexTools.inflateHex(hex, true, respectAlpha)).map(v => v / 255),
			max       = Math.max(r, g, b),
			min       = Math.min(r, g, b),
			l         = (max + min) / 2,
			s         = (max === min) ? 0 : (l > 0.5) ? (max - min) / (2 - max - min) : (max - min) / (max + min),
			h         = (max === min) ? 0 : (max === r) ? (g - b) / (max - min) + (g < b ? 6 : 0) : (max === g) ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4,
			result    = [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)];
        if(respectAlpha) result.push(a * 255);
        return result;
    }
    #HSLA = (hex) => this.#HSL(hex, true);

    #CMYK = (hex, respectAlpha=false) => {
        let [r,g,b,a] = this.#RGBA(hex).map(v => v / 255),
			k         = 1 - Math.max(r, g, b),
			c         = (1 - r - k) / (1 - k),
			m         = (1 - g - k) / (1 - k),
			y         = (1 - b - k) / (1 - k),
            result    = [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
        if(respectAlpha) result.push(a * 255);
        return result;
    }
    #CMYKA = (hex) => this.#CMYK(hex, true);

    to = (hex, format='hex') => {
        console.log('convertHex hex :', hex);
        if(hex == null || hex === '') return hex;
        const conversionMap = {
            "hex"  : this.#HEX,
            "hexa" : this.#HEXA,
            "rgb"  : this.#RGB,
            "rgba" : this.#RGBA,
            "hsl"  : this.#HSL,
            "hsla" : this.#HSLA,
            "cmyk" : this.#CMYK,
            "cmyka": this.#CMYKA
        };
        return conversionMap[format.trim().toLowerCase()](hex);
    }
}

const hexConversions = new HexConversions();
module.exports = hexConversions;
