const isDevMode = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

const express = require("express");
const path = require('path');
const stringTone = require("./src/scripts/StringTone.js");
const hexConversions = require("./src/scripts/HexConversions.js")
const hexTools = require("./src/scripts/HexTools.js")

const sass= require('sass');

const app = express()

app.listen(3000, () => {
    console.log("Server has started! Open http://localhost:3000")
})


const baseSourcePath = (isDevMode) ? 'src/' : 'public/';

const supportedFileTypes = {
    css:  {  mimeType: 'text/css',         basePath: path.join(__dirname, baseSourcePath + '/css/'),         extension: 'css'},
    scss: {  mimeType: 'text/css',         basePath: path.join(__dirname, baseSourcePath + '/css/'),         extension: 'css'},
    sass: {  mimeType: 'text/css',         basePath: path.join(__dirname, baseSourcePath + '/css/'),         extension: 'css'},
    js:   {  mimeType: 'text/javascript',  basePath: path.join(__dirname, baseSourcePath + '/js/'),          extension: 'js'},
    zip:  {  mimeType: 'application/zip',  basePath: path.join(__dirname, baseSourcePath + '/dowloads'),     extension: 'zip'},
    htm:  {  mimeType: 'text/html',        basePath: path.join(__dirname, baseSourcePath + '/'),             extension: 'html'},
    html: {  mimeType: 'text/html',        basePath: path.join(__dirname, baseSourcePath + '/'),             extension: 'html'},
    json: {  mimeType: 'application/json', basePath: path.join(__dirname, baseSourcePath + '/json'),         extension: 'json'},
    ico:  {  mimeType: 'image/x-icon',     basePath: path.join(__dirname, baseSourcePath + '/images/icons'), extension: 'ico'},
    png:  {  mimeType: 'image/png',        basePath: path.join(__dirname, baseSourcePath + '/images'),       extension: 'png'},
    jpg:  {  mimeType: 'image/jpeg',       basePath: path.join(__dirname, baseSourcePath + '/images'),       extension: 'jpg'},
    jpeg: {  mimeType: 'image/jpeg',       basePath: path.join(__dirname, baseSourcePath + '/images'),       extension: 'jpg'},
    gif:  {  mimeType: 'image/gif',        basePath: path.join(__dirname, baseSourcePath + '/images'),       extension: 'gif'},
    svg:  {  mimeType: 'image/svg+xml',    basePath: path.join(__dirname, baseSourcePath + '/images'),       extension: 'svg'}
}

//** Handle Website Page Requests (NON-API)
app.get(/^\/(?!api\/)(.*)$/i, async (req, res) => {
    reqFullPath = req.path;
    console.log('reqFullPath :', reqFullPath);
    if(req.path == null || req.path === '' || req.path === '/') reqFullPath += 'index.html'
    let [reqProtocol, reqRelativePath, reqPath, reqFileName, reqFileExt] = [...reqFullPath.matchAll(/^(https?:\/\/)?(\.\/|\.\.\/)?(\S*\/)([^\.\s]+?)(?:\.(\S*))?$/g)][0].splice(1);

    if(!reqPath || reqPath==='/') reqPath = '/';
    if(!reqFileExt) {
        reqFileExt = 'html';
        reqPath = 'components/' + reqFileName + reqPath;
    }
    if(!isDevMode) reqFileExt = supportedFileTypes[reqFileExt].extension;
    reqPath = (isDevMode) ? path.join(__dirname, baseSourcePath + reqPath) : path.join(__dirname, supportedFileTypes[reqFileExt].basePath + reqPath); 
    
    if(isDevMode){
        console.log('Path Elements', '\nreqProtocol: ', reqProtocol, '\nreqRelativePath: ', reqRelativePath, '\nreqPath: ', reqPath, '\nreqFileName: ', reqFileName, '\nreqFileExt: ', reqFileExt)
        if(/^s?[ca]ss$/i.test(reqFileExt)) {
            if(/fluid/.test(reqFullPath)) console.log('reqFullPath :', reqFullPath);
            if(/\/sass\//.test(reqFullPath)) {
                let mixinPath = path.join(__dirname, 'src/' + reqFullPath);
                console.log('mixinPath :', mixinPath);
                res.set('Content-Type', supportedFileTypes['css'].mimeType);
                let compiledMixin = sass.compile(mixinPath, {style:"expanded"});
                console.log('compiledMixin :', compiledMixin);
                return res.sendFile(mixinPath);
            }
            res.set('Content-Type', supportedFileTypes['css'].mimeType);
            let targetSassPath = path.join(reqPath, reqFileName + '.' + reqFileExt);
            let sassCompilation = sass.compile(targetSassPath, {style:"expanded"});
            if(/fluid/.test(reqFullPath))console.log('sassCompilation :', sassCompilation);
            return res.send(sassCompilation.css);
        }
        res.set('Content-Type', supportedFileTypes[reqFileExt].mimeType);
        return res.sendFile(path.join(reqPath, reqFileName + '.' + reqFileExt));
    }else{
        res.set('Content-Type', supportedFileTypes[reqFileExt].mimeType);
        return res.sendFile(path.join(supportedFileTypes[reqFileExt].basePath + reqFileName + '.' + reqFileExt));
    }
})

/*
Available API Options:
    All API interactions are done through the /api/ path. Assuming that the first path component is 'api', 
    all subsequent path components are treated as options for the API, until the last path component, 
    which is treated as the string to convert. It is presupposed that the string to convert is urlencoded;
    the options do not need to be.
    
    The following list contains all available options for requests made to the API. They can be used in any order,
    and any number of options can be used, but only the last of each type will be used.

    AVAILABLE OPTIONS:
    Category: Included Returns
    [D] fg:         foreground color  - the foreground color of the string to convert
                                        (this is the default option, and is used if no options are passed)
        bg:         background color  - this is the a11y-compliant background color for the foreground color of the string
        (Note that if both fg and bg are passed, both will be returned in the response!)

        verbose:    verbose output    - this returns the full object of the converted string, including the converted string,

    Category: Hex Format
    [D] deflate:    deflate color     - this deflates the foreground color to the shortest possible 3- or 4-digit hex/hexa code,
                                        depending on whether the original color was 6- or 8-digit and assuming each color channel
                                        is repeated (ex: #aaccff -> #acf; #ff0000ff -> #f00f).
        inflate:    inflate color     - this inflates the foreground color to the full 6- or 8-digit hex/hexa code, 
                                        depending on whether the original color was 3- or 4-digit and if it isn't already
                                        (ex: #acf -> #aaccff; #f00f -> #ff0000ff).
        round:      round color       - this rounds and deflates the foreground color to the nearest web-safe color
        (Note that only the last option of this type will be used!)
        
    Category: Color Format
    [D] hex:        hex color         - returns the requested color(s) as hex colors 
                                        (this is the default option, and is used if no options are passed)
        hexa:       hexa color        - returns the requested color(s) as hexa colors
        rgb:        rgb color         - returns the requested color(s) as rgb colors
        rgba:       rgba color        - returns the requested color(s) as rgba colors
        hsl:        hsl color         - returns the requested color(s) as hsl colors
        hsla:       hsla color        - returns the requested color(s) as hsla colors
        cmyk:       cmyk color        - returns the requested color(s) as cmyk colors
        cmyka:      cmyka color       - returns the requested color(s) as cmyka colors
        (Note that only the last option of this type will be used!)

    Category: Return Format
    [D] string:     string           - returns the requested color(s) as a string (or an object formatted as a string if necessary)
                                        (this is the default option, and is used if no options are passed)
        object:     object            - returns the requested color(s) as an object
*/

//## Handle String Passed Into API (NON-WEBSITE)

const setCaseFormat = (string, caseFormat="auto") => (typeof string !== 'string' || caseFormat === 'auto' || caseFormat === '') 
                                                  ?  string 
                                                  : ((caseFormat === 'upper')  
                                                      ? string.toUpperCase() 
                                                      : string.toLowerCase());

const webFormats = {
    rgb:   { prefix: 'rgb(',   units: ['','','']},
    rgba:  { prefix: 'rgba(',  units: ['','','','']},
    hsl:   { prefix: 'hsl(',   units: ['','%','%']},
    hsla:  { prefix: 'hsla(',  units: ['','%','%','']},
    cmyk:  { prefix: 'cmyk(',  units: ['%','%','%','%']},
    cmyka: { prefix: 'cmyka(', units: ['%','%','%','%', '']},
};

const setWebFormat = (value, colorFormat) => {
    if(value == null || /^hexa?$/i.test(colorFormat) || (typeof(value) !== 'string' && !Array.isArray(value))) return value;
    value = value?.split?.(',')??value;
    return !Array.isArray(value) 
           ? value 
           : colorFormat + "(" + value.map((v,i)=>v + webFormats[colorFormat].units[i]).join(', ') + ")";
}

let summaryOutput, formattedReturnString;
// app.get('/api\/?/i', (req, res, next) => {
//     // User is requesting the API docs (passed in only the /api path)
//     console.log('req.path :', req.path);
//     res.set('Content-Type', supportedFileTypes['html'].mimeType);
//     return res.sendFile(path.join(req.path, '/components/docs/docs.html'));
// });

app.get('/api/(:stringToConvert([\\S\\s]+))?', (req, res, next) => {
    // User is requesting the API docs (passed in only the /api path)
    console.log('req.path :', req.path);
    if(/^\/api\/?$/i.test(req.path)) {
    console.log('req.path :', req.path);
    res.set('Content-Type', supportedFileTypes['html'].mimeType);
    return res.sendFile(path.join(__dirname, baseSourcePath + req.path.replace(/\/api/i, ''), 'components/docs/docs.html'));

    }
    const pathComponents  = req.path.replace(/\/(?:fgbg|bgfg)\//, '/fg/bg/').split('/').slice(1);
    const includedReturns = ['fg', 'bg', 'verbose', 'convert'];
    const colorFormats    = ['hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla', 'cmyk', 'cmyka'];
    const hexFormats      = ['deflate', 'inflate', 'round', 'websafe'];
    const caseFormats     = ['auto', 'upper', 'lower'];
    const returnFormats   = ['string', 'object', 'web'];
    let remoteIP          = req.socket.remoteAddress.replace(/::1/, 'localhost');
    console.log(`INCOMING REQUEST FROM:`, remoteIP, `\nRequested path: ${req.path}\nPath components:`, pathComponents);

    

    if(/^api$/i.test(pathComponents.shift(0))) {
        const stringToConvert = pathComponents.pop();
        const optionsInputs   = pathComponents;
        let options           = {
            fg           : false,
            bg           : false,
            verbose      : false,
            convert      : false,
            caseFormat   : "upper",
            colorFormat  : "hex",
            hexFormat    : "deflate",
            returnFormat : "string"
        };
        while(optionsInputs.length > 0) {
            let option = optionsInputs.shift().toLowerCase();
            if(includedReturns.includes(option))    options[option]      = true;
            else if(hexFormats.includes(option))    options.hexFormat    = option;
            else if(caseFormats.includes(option))   options.caseFormat   = option;
            else if(colorFormats.includes(option))  options.colorFormat  = option;
            else if(returnFormats.includes(option)) options.returnFormat = option;
        }
        console.log('stringToConvert :', stringToConvert);
        let convertedString          = (options.convert && /^(?:\%23|\#)?([a-f0-9]{8}|[a-f0-9]{6}|[a-f0-9]{3,4})$/i.test(decodeURIComponent(stringToConvert))) ? decodeURIComponent(stringToConvert).replace('#', '') : stringTone.getStringFG(stringToConvert);
        console.log('convertedString :', convertedString);
        if(!options.fg && !options.bg) options.fg = true;
        let contrastingBG            = (options.bg) ? stringTone.getStringBG(convertedString) : '';
        console.log('contrastingBG :', contrastingBG);

        formattedReturnString    = hexTools[`${options.hexFormat}Hex`](convertedString);
        let preferredOutputFormat    = hexConversions.to(formattedReturnString, options.colorFormat);

        summaryOutput = {
            "stringInput"             : stringToConvert,
            "options"                 : options,
            "stringHexColorValueFG"   : convertedString,
            "contrastingHexColorBG"   : contrastingBG,
            "formattedReturnString"   : formattedReturnString,
            "requestedColorEncoding"  : options.colorFormat,
            "preferredCaseFormat"     : options.caseFormat,
            "colorInRequestedFormat"  : preferredOutputFormat,
        };
        console.log('summaryOutput :', summaryOutput);
    } else {
        // direct user to 404 page
        console.log("404")
    }
    next();
}, (req, res) => {
    console.log('summaryOutput :', summaryOutput);
    let bgColorInRequestedFormat  = null,
        returnFormat              = summaryOutput.options.returnFormat,
        colorFormat               = summaryOutput.options.colorFormat,
        caseFormat                = summaryOutput.options.caseFormat,
        reqFG                     = summaryOutput.options.fg,
        foreground                = reqFG ? setCaseFormat(summaryOutput.colorInRequestedFormat, caseFormat) : null,
        reqBG                     = summaryOutput.options.bg,
        background                = reqBG ? setCaseFormat(hexConversions.to(summaryOutput.contrastingHexColorBG, colorFormat), caseFormat) : null;
    
    if(returnFormat === 'web') {
        foreground = setWebFormat(foreground, colorFormat);
        background = setWebFormat(background, colorFormat);
    }

    if(summaryOutput.options.verbose) return res.send(JSON.stringify(Object.assign(summaryOutput, {foreground, background})));
    if(reqFG && reqBG || returnFormat === 'object') return res.send(JSON.stringify({foreground, background}));
    return res.send(foreground || background);
})
