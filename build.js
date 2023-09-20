const {globSync} = require('glob'),
      sass       = require('sass'),
      fs         = require('fs'),
      spc        = (str, len = 60) => (str + (((new Array(100)).fill(' ')).join(''))).slice(0, len) + " ==> ";
let   summary    = {};

//!! CLEANING PUBLIC FOLDER
console.log('\n\n======================================\nCLEANING PUBLIC FOLDER');
fs.rmSync('./public', { recursive: true, force: true });
console.log('    ...done.');

//@@ HTML FILES
console.log('\n\n======================================\nHTML FILES');
const htmlfiles = globSync('**/*.html', { ignore: 'node_modules/**' })
if(htmlfiles.length ) {
    console.log('     Located html files :', htmlfiles.join(', '));
    fs.mkdirSync('./public/', { recursive: true });

    for(htmlFile of htmlfiles) {
        summary.html = summary.html ? summary.html + 1 : 1;
        
        let htmlFileName = htmlFile.replace(/^.+\//, '');
        fs.copyFileSync(htmlFile, './public/' + htmlFileName);
        console.log('    ~> ', spc(htmlFile), './public/' + htmlFileName);
    }
}

//## JS FILES
console.log('\n\n======================================\nJS FILES');
const jsfiles = globSync('./src/**/*.js', { ignore: 'node_modules/**' })
if(jsfiles.length ) {
    console.log('     Located js files :', jsfiles.join(', '));
    fs.mkdirSync('./public/js/', { recursive: true });

    for(jsFile of jsfiles) {
        summary.js = summary.js ? summary.js + 1 : 1;
        
        let jsFileName = jsFile.replace(/^.+\//, '');
        fs.copyFileSync(jsFile, './public/js/' + jsFileName);
        console.log('    ~> ', spc(jsFile), './public/js/' + jsFileName);
    }
}

//$$ SASS/SCSS/CSS FILES
console.log('\n\n======================================\nSASS/SCSS/CSS FILES');
const sassFiles = globSync('**/*.{sass,scss}', { ignore: 'node_modules/**' })
if(sassFiles.length ) {
    console.log('     Located scss files :', sassFiles.join(', '));
    fs.mkdirSync('./public/css/', { recursive: true });

    for(sassFile of sassFiles) {
        summary.sass = summary.sass ? summary.sass + 1 : 1;

        let sassFileName = sassFile.replace(/^.+\//, '');
        let compiledCSS  = sass.compile(sassFile, {file : sassFile, syntax : 'scss'});
            sassFileName = sassFileName.replace(/\.s[ac]ss$/, '.css');
        fs.writeFileSync('./public/css/' + sassFileName, compiledCSS.css);
        console.log('    ~> ', spc(sassFile), './public/css/' + sassFileName);
    }
}

//%% IMAGE FILES
console.log('\n\n======================================\nIMAGE FILES');
const images = globSync(['**/*.{png,jpeg,svg,png}'], { ignore: ['node_modules/**', '**/*favicon*'] });
if(images.length ) {
    console.log('    Located image files :', images.join(', '));
    fs.mkdirSync('./public/images/', { recursive: true });
    
    for(image of images) {
        summary.images = summary.images ? summary.images + 1 : 1;

        let imageName = image.replace(/^.+\//, '');
        if(!/favicon/i.test(imageName)){
            fs.copyFileSync(image, './public/images/' + imageName);
            console.log('    ~> ', spc(image), './public/images/' + imageName);
        }
    }
}

//^^ ICON/FAVICON FILES
console.log('\n\n======================================\nICON/FAVICON FILES');
const icons = globSync(['**/*.{png,ico}'], { ignore: 'node_modules/**' });
if(icons.length ) {
    console.log('    Located icon files :', icons.join(', '));
    fs.mkdirSync('./public/icons/Favicons/', { recursive: true });

    for(icon of icons) {
        let iconName = icon.replace(/^.+\//, '');
        if(/favicon/i.test(iconName)) {
            summary.favicons = summary.favicons ? summary.favicons + 1 : 1;
            fs.copyFileSync(icon, './public/icons/Favicons/' + iconName);
            console.log('    ~> ', spc(icon), './public/icons/Favicons/' + iconName);
        }else{
            summary.icons = summary.icons ? summary.icons + 1 : 1;
            fs.copyFileSync(icon, './public/icons/' + iconName);
            console.log('    ~> ', spc(icon), './public/icons/' + iconName);
        }
    }
}

//&& DOWNLOADABLE FILES
console.log('\n\n======================================\nDOWNLOADABLE FILES');
const downloadables = globSync(['**/*.{pdf,doc,docx,xls,xlsx,zip}'], { ignore: 'node_modules/**' });
if(downloadables.length ) {
    console.log('    Located downloadable files :', downloadables.join(', '));
    fs.mkdirSync('./public/downloadables/', { recursive: true });

    for(downloadable of downloadables) {
        summary.downloadables = summary.downloadables ? summary.downloadables + 1 : 1;

        let downloadableName = downloadable.replace(/^.+\//, '');
        fs.copyFileSync(downloadable, './public/downloadables/' + downloadableName);
        console.log('    ~> ', spc(downloadable), './public/downloadables/' + downloadableName);
    }
}

//** BUILD SUMMARY
console.log('\n\n======================================\nBUILD SUMMARY');
console.log('    html          : ', (summary.html          || 0));
console.log('    js            : ', (summary.js            || 0));
console.log('    sass          : ', (summary.sass          || 0));
console.log('    images        : ', (summary.images        || 0));
console.log('    icons         : ');
console.log('      ⤷ icons     : ', (summary.icons         || 0));
console.log('      ⤷ favicons  : ', (summary.favicons      || 0));
console.log('    downloadables : ', (summary.downloadables || 0));

//!! OUTPUT SUMMARY
console.log('\n\n======================================\nOUTPUT SUMMARY');
console.log('    ', Object.values(summary).reduce((r,c)=>r+c, 0), 'files copied to ./public/ folder');

//!! STARTING LOCAL SERVER IN PRODUCTION MODE
console.log('\n\n======================================\nSTARTING LOCAL SERVER IN PRODUCTION MODE');


