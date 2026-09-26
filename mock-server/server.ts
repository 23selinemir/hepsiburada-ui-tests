import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/token', (req: Request, res: Response) => {
  const user = req.header('user');
  const pass = req.header('pass');

  if (!user || !pass) {
    return res.status(400).json({
      error: 'user ve pass header bilgileri zorunludur.',
    });
  }

  return res.status(200).json({
    token: 'mock-token-12345',
  });
});
app.get('/viewInvoice', (req: Request, res: Response) => {
  const barcode = req.query.barcode;

  if (!barcode) {
    return res.status(400).json({
      error: 'barcode query parametresi zorunludur.',
    });
  }

  return res.status(200).json({
    InvoiceLink: 'http://abc.com/invoice.pdf',
    Result: {
      success: true,
    },
  });
});
app.post('/sendInvoice', (req: Request, res: Response) => {
  const token = req.header('token');
  const barcode = req.body.Barcode;

  if (!token) {
    return res.status(401).json({
      error: 'token header bilgisi zorunludur.',
    });
  }

  if (!barcode) {
    return res.status(400).json({
      error: 'Barcode request body içerisinde zorunludur.',
    });
  }

  return res.status(200).json({
    Barcode: barcode,
    Result: {
      success: true,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Mock server http://localhost:${PORT} adresinde çalışıyor.`);
});