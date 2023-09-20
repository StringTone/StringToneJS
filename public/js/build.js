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
    summary.html = 0;

    for(htmlFileName of htmlfiles) {
        console.log('    ~> ', spc(htmlFileName), './public/' + htmlFileName);
        summary.html++;
        
        let htmlFile = htmlFileName.split('/');
        let htmlFileObject = {};
        htmlFileObject.fileName = htmlFile.pop();
        htmlFileObject.filePath = htmlFile.join('/');
        htmlFileObject.htmlOutput = './' + htmlFileObject.filePath + '/' + htmlFileObject.fileName;
        htmlFileObject.compiledHTML = fs.readFileSync(htmlFileName, 'utf8');
        fs.writeFileSync('./public/' + htmlFileObject.fileName, htmlFileObject.compiledHTML);
    }
}

console.log('\n\n======================================\nJS FILES');
const jsfiles = globSync('**/*.js', { ignore: 'node_modules/**' })
if(jsfiles.length ) {
    console.log('     Located js files :', jsfiles.join(', '));
    fs.mkdirSync('./public/js/', { recursive: true });
    summary.js=0;

    for(jsFileName of jsfiles) {
        console.log('    ~> ', spc(jsFileName), './public/js/' + jsFileName);
        summary.js++;
        
        let jsFile = jsFileName.split('/');
        let jsFileObject = {};
        jsFileObject.fileName = jsFile.pop();
        jsFileObject.filePath = jsFile.join('/');
        jsFileObject.jsOutput = './' + jsFileObject.filePath + '/' + jsFileObject.fileName;
        jsFileObject.compiledJS = fs.readFileSync(jsFileName, 'utf8');
        fs.writeFileSync('./public/js/' + jsFileObject.fileName, jsFileObject.compiledJS);
    }
}

console.log('\n\n======================================\nCSS FILES');
const scssfiles = globSync('**/*.scss', { ignore: 'node_modules/**' })
if(scssfiles.length ) {
    console.log('     Located scss files :', scssfiles.join(', '));
    fs.mkdirSync('./public/css/', { recursive: true });
    summary.sass=0;
    
    for(sassFileName of scssfiles)  {
        console.log('    ~> ', spc(sassFileName), './public/css/' + sassFileName);
        summary.sass++;

        let sassFileObject = {};
        sassFile = sassFileName.split('/');
        sassFileObject.fileName = sassFile.pop();
        sassFileObject.filePath = sassFile.join('/');
        sassFileObject.cssFileName = sassFileObject.fileName.replace(/\.scss$/, '.css');
        sassFileObject.cssOutput = './' + sassFileObject.filePath + '/' + sassFileObject.cssFileName;
        sassFileObject.compiledCSS = sass.compile('./' + sassFileName, {file:sassFileObject.cssOutput, syntax:'scss'})
        fs.writeFileSync(sassFileObject.cssOutput, sassFileObject.compiledCSS.css);
        fs.renameSync(sassFileObject.cssOutput, './public/css/' + sassFileObject.cssFileName);
    }
}

console.log('\n\n======================================\nIMAGE FILES');
const images = globSync(['**/*.{png,jpeg,svg,png}'], { ignore: ['node_modules/**', '**/*favicon*'] });
if(images.length ) {
    console.log('    Located image files :', images.join(', '));
    fs.mkdirSync('./public/images/', { recursive: true });
    summary.images=0;
    
    for(imageName of images) {
        console.log('    ~> ', spc(imageName), './public/images/' + imageName);

        summary.images++;
        
        let imageFile = imageName.split('/');
        let imageFileObject = {};
        imageFileObject.fileName = imageFile.pop();
        imageFileObject.filePath = imageFile.join('/');
        imageFileObject.htmlOutput = './' + imageFileObject.filePath + '/' + imageFileObject.fileName;
        if(!/favicon/.test(imageFileObject.fileName)) fs.copyFileSync(imageName, './public/images/' + imageFileObject.fileName);
    }
}

console.log('\n\n======================================\nICON FILES');
const icons = globSync(['**/*.{png,ico}'], { ignore: 'node_modules/**' });
if(icons.length ) {
    console.log('    Located icon files :', icons.join(', '));
    fs.mkdirSync('./public/icons/Favicons/', { recursive: true });
    summary.icons=0;

    for(iconName of icons) {
        console.log('    ~> ', spc(iconName), './public/icons/' + iconName);
        summary.icons++;
        
        let iconFile = iconName.split('/');
        let iconFileObject = {};
        iconFileObject.fileName = iconFile.pop();
        iconFileObject.filePath = iconFile.join('/');
        iconFileObject.htmlOutput = './' + iconFileObject.filePath + '/' + iconFileObject.fileName;
        if(/favicon/.test(iconFileObject.fileName)) 
            fs.copyFileSync(iconName, './public/icons/Favicons/' + iconFileObject.fileName);
        else
            fs.copyFileSync(iconName, './public/icons/' + iconFileObject.fileName);
    }
}

console.log('\n\n======================================\nDOWNLOADABLE FILES');
const downloadables = globSync(['**/*.{pdf,doc,docx,xls,xlsx,zip}'], { ignore: 'node_modules/**' });
if(downloadables.length ) {
    console.log('    Located downloadable files :', downloadables.join(', '));
    fs.mkdirSync('./public/downloadables/', { recursive: true });
    summary.downloadables=0;

    for(downloadableName of downloadables) {
        console.log('    ~> ', spc(downloadableName), './public/downloadables/' + downloadableName);
        summary.downloadables++;
        
        let downloadableFile = downloadableName.split('/');
        let downloadableFileObject = {};
        downloadableFileObject.fileName = downloadableFile.pop();
        downloadableFileObject.filePath = downloadableFile.join('/');
        downloadableFileObject.htmlOutput = './' + downloadableFileObject.filePath + '/' + downloadableFileObject.fileName;
        fs.copyFileSync(downloadableName, './public/downloadables/' + downloadableFileObject.fileName);
    }
}

console.log('SUMMARY');
console.log('    html          : ', (summary.html          || 0));
console.log('    js            : ', (summary.js            || 0));
console.log('    sass          : ', (summary.sass          || 0));
console.log('    images        : ', (summary.images        || 0));
console.log('    icons         : ', (summary.icons         || 0));
console.log('    downloadables : ', (summary.downloadables || 0));


