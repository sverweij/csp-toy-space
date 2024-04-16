import express from 'express';
import helmet from 'helmet'
import { dirname, join } from 'node:path'
import bodyParser from 'body-parser';

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
            // styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'report-sample'"],
            // imgSrc:  ["'self'", "https:", "'report-sample'"],
            imgSrc:  ["'self'", "https:", "'report-sample'"],
            frameAncestors: [
                // "'self'"
            ],
            objectSrc: "'none'",
            reportUri: "http://localhost:3000/report-violation/",
        }
    },
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
}));
app.use(bodyParser.json(
    {type: 'application/csp-report'}
))

app.use(express.static(join(dirname(new URL(import.meta.url).pathname), 'public/')));

app.post('/report-violation', (req, res) => {
    console.log('CSP violation report:');
    console.log(JSON.stringify(req.body));
    res.status(204).end();
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

