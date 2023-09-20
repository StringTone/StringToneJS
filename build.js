var {glob, Glob, globSync, globStream, globStreamSync} = require('glob');
var sass = require('sass');
var fs=require('fs');
var summary = {};
let spacer = '                                  ';

const spc = (str, len=40) => {
    return (str + spacer).substr(0, len) + " ==> ";
}

console.log('\n\n======================================\nCLEANING PUBLIC FOLDER');
fs.rmSync('./public', { recursive: true, force: true });

console.log('\n\n======================================\nHTML FILES');
const htmlfiles = globSync('**/*.html', { ignore: 'node_modules/**' })
if(htmlfiles.length ) {
    console.log('     Located html files :', htmlfiles.join(', '));
    fs.mkdirSync('./public/', { recursive: true });

    for(htmlFile of htmlfiles) {
        summary.html = summary.html ? summary.html + 1 : 1;
        
        let htmlFileName = htmlFile.replace(/^.*?\//, '');
        fs.copyFileSync(htmlFile, './public/' + htmlFileName);
        console.log('    ~> ', spc(htmlFileName), './public/' + htmlFileName);
    }
}

console.log('\n\n======================================\nJS FILES');
const jsfiles = globSync('**/*.js', { ignore: 'node_modules/**' })
if(jsfiles.length ) {
    console.log('     Located js files :', jsfiles.join(', '));
    fs.mkdirSync('./public/js/', { recursive: true });

    for(jsFile of jsfiles) {
        summary.js = summary.js ? summary.js + 1 : 1;
        
        let jsFileName = jsFile.replace(/^.*?\//, '');
        fs.copyFileSync(jsFile, './public/js/' + jsFileName);
        console.log('    ~> ', spc(jsFileName), './public/js/' + jsFileName);
    }
}

console.log('\n\n======================================\nCSS FILES');
const scssfiles = globSync('**/*.{sass,scss}', { ignore: 'node_modules/**' })
if(scssfiles.length ) {
    console.log('     Located scss files :', scssfiles.join(', '));
    fs.mkdirSync('./public/css/', { recursive: true });
    
    for(sassFileName of scssfiles)  {
        summary.sass = summary.sass ? summary.sass + 1 : 1;

        let sassFileObject = {};
        sassFile = sassFileName.split('/');
        sassFileObject.fileName = sassFile.pop();
        sassFileObject.filePath = sassFile.join('/');
        sassFileObject.cssFileName = sassFileObject.fileName.replace(/\.scss$/, '.css');
        sassFileObject.cssOutput = './' + sassFileObject.filePath + '/' + sassFileObject.cssFileName;
        sassFileObject.compiledCSS = sass.compile('./' + sassFileName, {file:sassFileObject.cssOutput, syntax:'scss'})
        fs.writeFileSync('./public/css/' + sassFileObject.cssFileName, sassFileObject.compiledCSS.css);
        // fs.renameSync(sassFileObject.cssOutput, './public/css/' + sassFileObject.cssFileName);
        console.log('    ~> ', spc(sassFileName), './public/css/' + sassFileName);
    }
}

console.log('\n\n======================================\nIMAGE FILES');
const images = globSync(['**/*.{png,jpeg,svg,png}'], { ignore: ['node_modules/**', '**/*favicon*'] });
if(images.length ) {
    console.log('    Located image files :', images.join(', '));
    fs.mkdirSync('./public/images/', { recursive: true });
    
    for(image of images) {
        summary.images = summary.images ? summary.images + 1 : 1;

        let imageName = image.replace(/^.*?\//, '');
        if(!/favicon/i.test(imageName)){
            fs.copyFileSync(imageName, './public/images/' + imageName);
            console.log('    ~> ', spc(imageName), './public/images/' + imageName);
        }
    }
}

console.log('\n\n======================================\nICON FILES');
const icons = globSync(['**/*.{png,ico}'], { ignore: 'node_modules/**' });
if(icons.length ) {
    console.log('    Located icon files :', icons.join(', '));
    fs.mkdirSync('./public/icons/Favicons/', { recursive: true });

    for(icon of icons) {
        let iconName = icon.replace(/^.*?\//, '');
        if(/favicon/i.test(iconName)) {
            fs.copyFileSync(iconName, './public/icons/Favicons/' + iconName);
            console.log('    ~> ', spc(iconName), './public/icons/Favicons/' + iconName);
            summary.favicons = summary.favicons ? summary.favicons + 1 : 1;
        }else if(/\.ico$/i.test(iconName)) {
            fs.copyFileSync(iconName, './public/icons/' + iconName);
            console.log('    ~> ', spc(iconName), './public/icons/' + iconName);
            summary.icons = summary.icons ? summary.icons + 1 : 1;
        }
    }
}

console.log('\n\n======================================\nDOWNLOADABLE FILES');
const downloadables = globSync(['**/*.{pdf,doc,docx,xls,xlsx,zip}'], { ignore: 'node_modules/**' });
if(downloadables.length ) {
    console.log('    Located downloadable files :', downloadables.join(', '));
    fs.mkdirSync('./public/downloadables/', { recursive: true });

    for(downloadable of downloadables) {
        summary.downloadables = summary.downloadables ? summary.downloadables + 1 : 1;

        let downloadableName = downloadable.replace(/^.*?\//, '');
        fs.copyFileSync(downloadableName, './public/downloadables/' + downloadableName);
        console.log('    ~> ', spc(downloadableName), './public/downloadables/' + downloadableName);
    }
}

console.log('\n\n======================================\nBUILD SUMMARY');
console.log('    html          : ', (summary.html          || 0));
console.log('    js            : ', (summary.js            || 0));
console.log('    sass          : ', (summary.sass          || 0));
console.log('    images        : ', (summary.images        || 0));
console.log('    icons         : ');
console.log('      ⤷ icons     : ', (summary.icons         || 0));
console.log('      ⤷ favicons  : ', (summary.favicons      || 0));
console.log('    downloadables : ', (summary.downloadables || 0));


