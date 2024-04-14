const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
    .option('output', {
        alias: 'o',
        describe: 'Path where the merged PDF file will be saved',
        type: 'string',
        demandOption: true
    })
    .option('files', {
        alias: 'f',
        describe: 'List of paths to the PDF files to merge',
        type: 'array',
        demandOption: true
    })
    .help()
    .alias('help', 'h')
    .argv;

async function mergePdfs(files, outputPath) {
    const mergedPdf = await PDFDocument.create();
    for (let file of files) {
        const pdfBytes = fs.readFileSync(file);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }
    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);
    console.log(`Merged PDF saved to ${outputPath}`);
}

mergePdfs(argv.files, argv.output);
