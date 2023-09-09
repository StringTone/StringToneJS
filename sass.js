var {glob, Glob, globSync, globStream, globStreamSync} = require('glob');
var sass = require('sass');
var fs=require('fs');

var env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';
process.env.NODE_ENV = env;

let sassFiles = [];


// Iterate the results, extract the path of each, and output it
function compileSCSS(inputFile, outputFile) {
    return sass.render(
      {
        file: inputFile,
        outputStyle: 'compressed', // Choose your desired output style: nested, expanded, compact, or compressed
        syntax: 'scss',
      },
      function (error, result) {
        if (!error) {
          fs.writeFile(outputFile, result.css, function (err) {
            if (!err) {
              console.log(`Compiled ${inputFile} to ${outputFile}`);
            } else {
              console.error(`Error writing file: ${err}`);
            }
          });
        } else {
          console.error(`Error compiling ${inputFile}: ${error}`);
        }
      }
    );
  }

  // function that accepts a single file path and compiles the scss to css
    function compileSingleFile(filePath) {
        const file = filePath.split('/');
        const fileName = file.pop();
        const fileExt = fileName.split('.').pop();
        const fileBase = fileName.replace(`.${fileExt}`, '');
        const fileDir = file.join('/');
        const cssFileName = `${fileBase}.css`;
        const cssOutput = `./${fileDir}/${cssFileName}`;
        let compiledCSS = compileSCSS(filePath, cssOutput);
        if(env === 'development') {
            return compiledCSS.css;
        } else if(env === 'production') {
            fs.writeFileSync(cssOutput, compiledCSS.css);
        }
    }

    // function that iterates all the scss files within a directory and compiles them to css
    function compileDirectory(dirPath='') {
        var sg = new Glob(dirPath + '**/*.scss', {absolute:false, root:'./src/', ignore:['**/node_modules/**', '**/vendor/**']});

        for(sassFileName of sg)  {
            console.log('sassFileName :', sassFileName);
            let sassFileObject = {};
            sassFile = sassFileName.split('/');
            sassFileObject.fileName = sassFile.pop();
            sassFileObject.filePath = sassFile.join('/');
            sassFileObject.cssFileName = sassFileObject.fileName.replace(/\.scss$/, '.css');
            sassFileObject.cssOutput = './' + sassFileObject.filePath + '/' + sassFileObject.cssFileName;
            sassFileObject.compiledCSS = sass.compile('./' + sassFileName, {file:sassFileObject.cssOutput, syntax:'scss'})
            sassFiles.push(sassFileObject);
            if(env === 'development') {
                return sassFileObject.compiledCSS.css;
            } else if(env === 'production') {
                fs.writeFileSync(sassFileObject.cssOutput, sassFileObject.compiledCSS.css);
            }
        }
    }
    
    


console.log('sassFiles :', sassFiles, env);

module.exports = sassFiles;
;
// iterate all the sass files and compile them to css, then output them to their original location
// 
// sassFiles.forEach(sassFile => {
//     fs.writeFileSync(sassFile.cssOutput, sassFile.compiledCSS);
// });
