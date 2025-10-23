import ptp from 'pdf-to-printer';

const print = async (dir: string, printerName: string, height?: number) => {
  const options: ptp.PrintOptions = {
    printer: printerName,
    scale: 'noscale'
  };

  try {
    await ptp.print(dir, options);
    console.log('Print successful:', dir);
    return true;
  } catch (e) {
    console.error('Print error:', e);
    return false;
  }
};

export const PrinterUtil = {
  print
}