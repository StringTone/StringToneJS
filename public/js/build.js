var {glob, Glob, globSync, globStream, globStreamSync} = require('glob');
var sass = require('sass');
var fs=require('fs');

// all js files, but don't look in node_modules
const jsfiles = globSync('**/*.js', { ignore: 'node_modules/**' })
console.log('jsfiles :', jsfiles);

// Create a copy of each JS file in public/js
for(jsFileName of jsfiles) {
    console.log('jsFileName :', jsFileName);
    
    let jsFile = jsFileName.split('/');
    let jsFileObject = {};
    jsFileObject.fileName = jsFile.pop();
    jsFileObject.filePath = jsFile.join('/');
    jsFileObject.jsOutput = './' + jsFileObject.filePath + '/' + jsFileObject.fileName;
    jsFileObject.compiledJS = fs.readFileSync(jsFileName, 'utf8');
    fs.writeFileSync('./public/js/' + jsFileObject.fileName, jsFileObject.compiledJS);
}

const scssfiles = globSync('**/*.scss', { ignore: 'node_modules/**' })
console.log('scssfiles :', scssfiles);
let sassFiles = [];

    for(sassFileName of scssfiles)  {
        console.log('sassFileName :', sassFileName);
        let sassFileObject = {};
        sassFile = sassFileName.split('/');
        sassFileObject.fileName = sassFile.pop();
        sassFileObject.filePath = sassFile.join('/');
        sassFileObject.cssFileName = sassFileObject.fileName.replace(/\.scss$/, '.css');
        sassFileObject.cssOutput = './' + sassFileObject.filePath + '/' + sassFileObject.cssFileName;
        sassFileObject.compiledCSS = sass.compile('./' + sassFileName, {file:sassFileObject.cssOutput, syntax:'scss'})
        sassFiles.push(sassFileObject);
        // if(env === 'development') {
        //     return sassFileObject.compiledCSS.css;
        // } else if(env === 'production') {
            fs.writeFileSync(sassFileObject.cssOutput, sassFileObject.compiledCSS.css);
            // Next, move the compiled file to public/css
            fs.renameSync(sassFileObject.cssOutput, './public/css/' + sassFileObject.cssFileName);

        // }

}

const htmlfiles = globSync('**/*.html', { ignore: 'node_modules/**' })
console.log('htmlfiles :', htmlfiles);
for(htmlFileName of htmlfiles) {
    console.log('htmlFileName :', htmlFileName);
    
    let htmlFile = htmlFileName.split('/');
    let htmlFileObject = {};
    htmlFileObject.fileName = htmlFile.pop();
    htmlFileObject.filePath = htmlFile.join('/');
    htmlFileObject.htmlOutput = './' + htmlFileObject.filePath + '/' + htmlFileObject.fileName;
    htmlFileObject.compiledHTML = fs.readFileSync(htmlFileName, 'utf8');
    fs.writeFileSync('./public/' + htmlFileObject.fileName, htmlFileObject.compiledHTML);
}
const images = globSync(['**/*.{png,jpeg,svg,png,ico}'], { ignore: 'node_modules/**' });
console.log('images :', images);

for(imageName of images) {
    console.log('imageFileName :', imageName);
    
    let imageFile = imageName.split('/');
    let imageFileObject = {};
    imageFileObject.fileName = imageFile.pop();
    imageFileObject.filePath = imageFile.join('/');
    imageFileObject.htmlOutput = './' + imageFileObject.filePath + '/' + imageFileObject.fileName;
    fs.copyFileSync(imageName, './public/' + imageFileObject.fileName);
}
