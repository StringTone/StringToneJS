const express = require("express");
const path = require('path');
const stringTone = require("./src/scripts/StringTone.js");
const hexConversions = require("./src/scripts/HexConversions.js")
const hexTools = require("./src/scripts/HexTools.js")
// const glob = require('glob');
// console.log('glob :', glob.glob('**/*.scss', (err, files) => {console.log(err, files)}));

const sass= require('sass');

const app = express()



// app.use('/css/:cssName', compileSass.setup({
//     sassFilePath: path.join(__dirname, 'src/scss/'),
//     sassFileExt: 'scss',
//     embedSrcMapInProd: true,
//     resolveTildes: true,
//     sassOptions: {
//       alertAscii: true,
//       verbose: true
//     }
//   }));
//   

// 
// app.use(sassMiddleware({
//     /* Options */
//     src: path.join(__dirname, 'public', 'src/scss'),
//     dest: path.join(__dirname, 'public'),
//     debug: true,
//     outputStyle: 'compressed',
//     prefix:  '/prefix'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
// }));
// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
// app.use('/public', express.static(path.join(__dirname, 'public')));


// 
// const projectRoot = path.resolve(__dirname);
// console.log('Project Root:', projectRoot);
// 
// app.use(sassMiddleware({
//     /* Options */
//     src: path.join(__dirname, 'src/scss'),
//     dest: path.join(__dirname, 'src/scss'),
//     debug: true,
//     log: function (severity, key, value) { 
//         // winston.log(severity, 'express-dart-sass   %s : %s', key, value); 
//         // console.log('severity, key, value :', severity, key, value);
//         console[severity]('express-dart-sass   %s : %s', key, value);
//     },
//     outputStyle: 'compressed',
//     root:  '/src',
//     response:true
// }));
// app.use('/src', express.static(path.join(__dirname, 'src')));
// app.use(express.static(path.join(__dirname, 'src')));

app.listen(3000, () => {
    console.log("Server has started! Open http://localhost:3000")
})

const isDevMode = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
const baseSourcePath = (isDevMode) ? 'src/' : 'public/';

const supportedFileTypes = {
    css:  {  mimeType: 'text/css',         basePath: path.join(__dirname, baseSourcePath + '/css/'),         },
    scss: {  mimeType: 'text/css',         basePath: path.join(__dirname, baseSourcePath + '/css/'),         },
    sass: {  mimeType: 'text/css',         basePath: path.join(__dirname, baseSourcePath + '/css/'),         },
    js:   {  mimeType: 'text/javascript',  basePath: path.join(__dirname, baseSourcePath + '/js/'),          },
    zip:  {  mimeType: 'application/zip',  basePath: path.join(__dirname, baseSourcePath + '/dowloads'),     },
    html: {  mimeType: 'text/html',        basePath: path.join(__dirname, baseSourcePath + '/'),             },
    json: {  mimeType: 'application/json', basePath: path.join(__dirname, baseSourcePath + '/json'),         },
    ico:  {  mimeType: 'image/x-icon',     basePath: path.join(__dirname, baseSourcePath + '/images/icons'), },
    png:  {  mimeType: 'image/png',        basePath: path.join(__dirname, baseSourcePath + '/images'),       },
    jpg:  {  mimeType: 'image/jpeg',       basePath: path.join(__dirname, baseSourcePath + '/images'),       },
    jpeg: {  mimeType: 'image/jpeg',       basePath: path.join(__dirname, baseSourcePath + '/images'),       },
    gif:  {  mimeType: 'image/gif',        basePath: path.join(__dirname, baseSourcePath + '/images'),       },
    svg:  {  mimeType: 'image/svg+xml',    basePath: path.join(__dirname, baseSourcePath + '/images'),       }
}
supportedFileTypes['jpeg'] = supportedFileTypes['jpg'];

//* Handle Website Page Requests
app.get(/^\/(?!api\/)(.*)$/i, async (req, res) => {
    // if not dev mode, sgrip out file name and hand it back from the relevant public folder
    // otherwise, hand back the file requested, except for scss files, which need to be compiled
    // and then handed back in their compiled form, regardless of file path
    if((req.path == '/'))
        return res.render('index.html')

    let reqFullPath = req.path;
    if(/fluid/.test(reqFullPath)) console.log('reqFullPath :', reqFullPath);
    let [reqProtocol, reqRelativePath, reqPath, reqFileName, reqFileExt] = [...reqFullPath.matchAll(/^(https?:\/\/)?(\.\/|\.\.\/)?(\S*\/)([^\.\s]+?)(?:\.(\S*))?$/g)][0].splice(1);
    if(!reqPath || reqPath==='/') reqPath = '/';
    if(!reqFileExt) {
        reqFileExt = 'html';
        reqPath = 'components/' + reqFileName + reqPath;
    }
    
    reqPath = (isDevMode) ? path.join(__dirname, baseSourcePath + reqPath) : path.join(__dirname, supportedFileTypes[reqFileExt].basePath + reqPath); 
    if(/fluid/.test(reqFullPath))console.log('reqPath :', reqPath);


    
    
    if(isDevMode){
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
        return res.sendFile(path.join(__dirname, supportedFileTypes[reqFileExt].basePath + reqFileName + '.' + reqFileExt));
    }

    let requestOriginationPath  = req.path.split('/');
    let requestedCompleteName   = requestOriginationPath.pop();
    let {requestedFileName, 
        requestedFileExtension} = requestedCompleteName.split('.');
    let requestedComponentPath  = requestOriginationPath.join('/');

    requestedComponentFileName = requestedComponentPath + '.' + requestedFileExtension;
    console.clear();
    console.log('req.path :', req.path);
    console.log('requestedCompleteName :', requestedCompleteName);
    console.log('requestedComponentPath :', requestedComponentPath);
    console.log('requestedFileExtension :', requestedFileExtension);
    switch(requestedFileExtension) {
        case 'css':
        case 'scss':
            requestedComponentFileName = requestedComponentFileName.replace(/\.s?css$/i, '.' + requestedFileExtension);
            res.set('Content-Type', 'text/css');
            if(process.env.NODE_ENV === 'development') {
                res.send(sass.compile('./' + sassFileName, {file:sassFileObject.cssOutput, syntax:'scss'}))
            }else{
                res.sendFile(path.join(__dirname, 'src/components/' + requestedComponentPath, requestedComponentFileName));
            }
            break;
        case 'js':
            res.set('Content-Type', 'text/javascript');
            res.sendFile(path.join(__dirname, 'src/components/' + requestedComponentPath, requestedComponentFileName));
            break;
        default:
            res.set('Content-Type', 'text/html');
            res.sendFile(path.join(__dirname, 'src/components/' + requestedComponentPath, requestedComponentFileName));
            break;
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

// Handle String Passed Into API
let summaryOutput, formattedReturnString;

app.get('/api/:stringToConvert([\\S\\s]+)', (req, res, next) => {
    const pathComponents  = req.path.replace(/\/(?:fgbg|bgfg)\//, '/fg/bg/').split('/').slice(1);
    const includedReturns = ['fg', 'bg', 'verbose'];
    const colorFormats    = ['hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla', 'cmyk', 'cmyka'];
    const hexFormats      = ['deflate', 'inflate', 'round', 'websafe'];
    const returnFormats   = ['string', 'object'];
    let remoteIP          = req.socket.remoteAddress.replace(/::1/, 'localhost');
    console.log(`INCOMING REQUEST FROM:`, remoteIP, `\nRequested path: ${req.path}\nPath components:`, pathComponents);
    if(/^api$/i.test(pathComponents.shift(0))) {
        const stringToConvert = pathComponents.pop();
        const optionsInputs   = pathComponents;
        let convertedString   = stringTone.getStringFG(stringToConvert);
        let options           = {
            fg           : false,
            bg           : false,
            verbose      : false,
            colorFormat  : "hex",
            hexFormat    : "deflate",
            returnFormat : "string"
        };
        while(optionsInputs.length > 0) {
            let option = optionsInputs.shift().toLowerCase();
            if(includedReturns.includes(option))    options[option]      = true;
            else if(hexFormats.includes(option))    options.hexFormat    = option;
            else if(colorFormats.includes(option))  options.colorFormat  = option;
            else if(returnFormats.includes(option)) options.returnFormat = option;
        }
        if(!options.fg && !options.bg) options.fg = true;
        let contrastingBG            = (options.bg) ? stringTone.getStringBG(stringToConvert) : '';

        let formattedReturnString    = hexTools[`${options.hexFormat}Hex`](convertedString);
        let preferredOutputFormat    = hexConversions.to(formattedReturnString, options.colorFormat);

        summaryOutput = {
            "stringInput"             : stringToConvert,
            "options"                 : options,
            "stringHexColorValueFG"   : convertedString,
            "contrastingHexColorBG"   : contrastingBG,
            "formattedReturnString"   : formattedReturnString,
            "requestedColorEncoding"  : options.colorFormat,
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
        returnFormatStr           = summaryOutput.options.returnFormat === "string",
        colorFormat               = summaryOutput.options.colorFormat,
        reqFG                     = summaryOutput.options.fg,
        reqBG                     = summaryOutput.options.bg;
    if(reqBG) bgColorInRequestedFormat = hexConversions.to(summaryOutput.contrastingHexColorBG, summaryOutput.options.colorFormat);
    console.log('bgColorInRequestedFormat :', bgColorInRequestedFormat);
    if(summaryOutput.options.verbose){
        return res.send(((returnFormatStr) ? JSON.stringify(summaryOutput) : summaryOutput));
    }
    response = {};
    if(reqFG && reqBG) {
        response[colorFormat + 'FG'] = summaryOutput.colorInRequestedFormat;
        response[colorFormat + 'BG'] = bgColorInRequestedFormat;
        if(returnFormatStr) 
            res.send(JSON.stringify(response));
        else 
            res.send(response);
        return;
    }
    if(returnFormatStr) {
        if(reqFG) res.send(summaryOutput.colorInRequestedFormat);
        if(reqBG) res.send(bgColorInRequestedFormat);
    } else {
        if(reqFG) response[colorFormat] = summaryOutput.colorInRequestedFormat;
        if(reqBG) response[colorFormat + 'BG'] = bgColorInRequestedFormat;
        res.send(response);
    }
    return;
})


// app.get(/:targetString/, (req, res) => {
//   console.log(req.params)
//   res.send(req.params.targetString)
// })
