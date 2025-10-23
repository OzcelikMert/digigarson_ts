import pdf from 'html-pdf';

const create = async (params: IPDFCreateParamsUtil) => {
  const options: pdf.CreateOptions = {
    //win32: ['-print-settings "noscale"'],
    type: 'pdf',
    height: params.height,
    width: params.width,
    renderDelay: 0,
    border: '0',
    quality: "100",
    phantomArgs: ['--web-security=no', '--local-url-access=yes']
  };

  try {
    await new Promise((resolve, reject) => {
      pdf.create(params.content, options).toFile(params.dir, function (err, res) {
        if (err) {
          console.error('PDF creation error:', err);
          reject(err);
          return;
        }
        resolve(true);
      });
    });
    console.log('PDF creation successful:', params.dir);
    return true;
  } catch (e) {
    console.error('PDF creation error (catch):', e);
    return false;
  }
};

export const PDFUtil = {
  create,
};
