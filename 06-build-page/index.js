const fs = require('fs').promises;
const path = require('path');

const outputDirectory = path.join(__dirname, 'project-dist');
const cssDirectory = path.join(__dirname, 'styles');
const htmlComponentsDirectory = path.join(__dirname, 'components');
const assetsDirectory = path.join(__dirname, 'assets');

const mkDirOutputDirectory = async () => {
  try {
    await fs.mkdir(outputDirectory, { recursive: true });
  } catch (error) {
    console.log(error);
  }
};

const copyDirectory = async (source, target) => {
  try {
    try {
      await fs.mkdir(target);
    } catch (error) {
      await fs.rm(target, { recursive: true });
      await fs.mkdir(target);
    }

    const files = await fs.readdir(source);

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const outputPath = path.join(target, file);

      const stats = await fs.stat(sourcePath);

      if (stats.isDirectory()) {
        await copyDirectory(sourcePath, outputPath);
      } else {
        await fs.copyFile(sourcePath, outputPath);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const mergeHTMLFiles = async () => {
  try {
    let templateHtml = await fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );

    const components = await fs.readdir(htmlComponentsDirectory);
    for (const comp of components) {
      const { name, ext } = path.parse(comp);
      if (ext !== '.html') break;
      const placeholderRegex = new RegExp(`{{${name}}}`);
      const replaceContent = await fs.readFile(
        htmlComponentsDirectory + `/${comp}`,
        'utf8',
      );
      templateHtml = templateHtml.replace(
        placeholderRegex,
        '\n' + replaceContent,
      );
    }
    await fs.writeFile(outputDirectory + '/index.html', templateHtml, 'utf8');
  } catch (error) {
    console.log(error);
  }
};

const mergeCSSFiles = async () => {
  try {
    const files = await fs.readdir(cssDirectory, { withFileTypes: true });
    const cssFiles = files.filter((file) => path.extname(file.name) === '.css');
    const promises = cssFiles.map(async (file) => {
      const filePath = path.join(cssDirectory, file.name);
      const data = await fs.readFile(filePath, 'utf8');
      return data + '\n';
    });
    const cssContents = await Promise.all(promises);
    const concatenateCss = cssContents.join('');

    await fs.writeFile(outputDirectory + '/style.css', concatenateCss, 'utf8');
  } catch (error) {
    console.log(error);
  }
};

const build = async () => {
  await mkDirOutputDirectory();
  await copyDirectory(assetsDirectory, outputDirectory + '/assets');
  await mergeHTMLFiles();
  await mergeCSSFiles();
};

build();
